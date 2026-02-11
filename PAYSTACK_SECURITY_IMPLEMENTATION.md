# Paystack Integration Security & Email Receipts - Implementation Summary

## Overview
This document outlines the fixes implemented to address three critical issues with the Paystack payment integration:

1. **Settings disappearing on page refresh**
2. **API key security and protection**
3. **Email receipts for successful payments**

---

## 1. Settings Persistence Fix

### Problem
When sellers configured their Paystack API keys and refreshed the page, the settings would disappear. This was caused by:
- The frontend `Store` interface in `useAuthStore.ts` didn't include `paystackPublicKey` and `paystackSecretKey` fields
- The backend auth endpoints (`login`, `register`, `getMe`) weren't returning these fields in the store object

### Solution
**Frontend Changes:**
- Updated `apps/web/src/store/useAuthStore.ts` to include Paystack keys in the Store interface:
  ```typescript
  interface Store {
      // ... existing fields
      paystackPublicKey?: string | null;
      paystackSecretKey?: string | null;
  }
  ```

**Backend Changes:**
- Updated `apps/api/src/auth/auth.service.ts` to include Paystack keys in all auth responses:
  - `register()` method
  - `login()` method  
  - `getMe()` method

Now when users log in or refresh the page, their Paystack settings are properly loaded and persisted.

---

## 2. API Key Security & Encryption

### Problem
Paystack secret keys were being stored in **plain text** in the database, which is a major security risk. If the database is compromised, attackers would have direct access to all merchant payment accounts.

### Solution
Implemented **AES-256-GCM encryption** for secret keys:

**New Files Created:**
- `apps/api/src/common/encryption.util.ts` - Encryption utility class

**Key Features:**
- Uses AES-256-GCM (Galois/Counter Mode) for authenticated encryption
- Derives encryption key from `ENCRYPTION_KEY` environment variable
- Stores encrypted data in format: `iv:authTag:encryptedData`
- Backward compatible with existing unencrypted data (logs warning and returns as-is)

**Updated Files:**
- `apps/api/src/payments/payments.service.ts`:
  - `connectStore()` - Encrypts secret key before saving to database
  - `getStoreKeys()` - Decrypts secret key when retrieving from database

**Environment Setup Required:**
Add to your `.env` file:
```bash
ENCRYPTION_KEY=your-secure-random-key-here-minimum-32-characters
```

**Security Notes:**
- Public keys are NOT encrypted (they're meant to be public)
- Secret keys are encrypted at rest in the database
- Keys are decrypted only when needed for API calls
- The encryption key should be kept secure and never committed to version control

---

## 3. Email Receipts for Customers

### Problem
Customers weren't receiving any email confirmation after successful payment, leading to:
- Poor user experience
- Increased support requests
- No payment proof for customers

### Solution
Implemented automated email receipt system using Resend:

**New Files Created:**
- `apps/api/src/common/email.service.ts` - Professional email service

**Email Features:**
- ✅ Beautiful, responsive HTML email template
- ✅ Order summary with itemized list
- ✅ Payment reference number
- ✅ Store branding (store name)
- ✅ Professional formatting with proper currency display (₦)
- ✅ Success indicator with checkmark icon

**Updated Files:**
- `apps/api/src/orders/orders.service.ts`:
  - Injected `EmailService` dependency
  - Enhanced `updateOrderStatus()` to send receipt email when status changes to 'PAID'
  - Includes full order details, items, and payment reference

- `apps/api/src/orders/orders.module.ts`:
  - Added `EmailService` to providers array

**Email Content Includes:**
- Order ID (first 8 characters, uppercase)
- Order date and time
- Payment reference from Paystack
- Store name
- Itemized list of products with quantities and prices
- Total amount paid
- Professional branding and footer

**Error Handling:**
- Email failures are logged but don't block payment confirmation
- Ensures payment processing continues even if email service is down

---

## Testing Instructions

### 1. Test Settings Persistence
1. Log in to seller dashboard
2. Navigate to Payments page
3. Enter Paystack API keys and click "Link Paystack Account"
4. Refresh the page
5. ✅ Keys should still be visible (public key visible, secret key masked)

### 2. Test Encryption
1. Check database before update:
   ```sql
   SELECT "paystackSecretKey" FROM "Store" WHERE id = 'your-store-id';
   ```
2. Update keys through the dashboard
3. Check database after update - secret key should now be encrypted (format: `hex:hex:hex`)

### 3. Test Email Receipts
1. Make a test purchase using Paystack test keys:
   - Test Public Key: `pk_test_...`
   - Test Secret Key: `sk_test_...`
2. Use Paystack test card: `4084084084084081`
3. Complete payment
4. ✅ Check customer email for receipt
5. ✅ Check server logs for email confirmation

**Test Card Details:**
- Card Number: `4084084084084081`
- Expiry: Any future date
- CVV: `408`
- PIN: `0000`
- OTP: `123456`

---

## Environment Variables Required

Add these to your `.env` files:

### Backend (`apps/api/.env`)
```bash
# Existing variables
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"

# Email Service (already configured)
RESEND_API_KEY="re_..."

# NEW: Encryption for API keys
ENCRYPTION_KEY="your-secure-random-key-minimum-32-chars-change-in-production"
```

### Frontend (`apps/web/.env.local`)
```bash
# No new variables needed
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## Security Best Practices

### For Production Deployment:

1. **Generate a Strong Encryption Key:**
   ```bash
   # Use this command to generate a secure key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Store Encryption Key Securely:**
   - Use environment variables (never commit to git)
   - Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Rotate keys periodically

3. **Email Configuration:**
   - Replace `receipts@resend.dev` with your verified domain
   - Example: `receipts@yourdomain.com`
   - Verify your domain in Resend dashboard

4. **Database Backups:**
   - Ensure database backups are also encrypted
   - Store encryption keys separately from database backups

5. **HTTPS Only:**
   - Always use HTTPS in production
   - Paystack webhooks require HTTPS

---

## Migration Notes

### For Existing Stores with Unencrypted Keys:

The system is **backward compatible**. When you deploy this update:

1. Existing unencrypted keys will still work
2. When a seller updates their keys, they'll be encrypted automatically
3. The system detects unencrypted data and logs a warning

**Optional: Encrypt Existing Keys**

You can create a migration script to encrypt all existing keys:

```typescript
// migration-script.ts
import { PrismaClient } from '@prisma/client';
import { EncryptionUtil } from './src/common/encryption.util';

const prisma = new PrismaClient();

async function migrateKeys() {
    const stores = await prisma.store.findMany({
        where: {
            paystackSecretKey: { not: null }
        }
    });

    for (const store of stores) {
        if (store.paystackSecretKey && !store.paystackSecretKey.includes(':')) {
            // Key is not encrypted (doesn't have : separator)
            const encrypted = await EncryptionUtil.encrypt(store.paystackSecretKey);
            await prisma.store.update({
                where: { id: store.id },
                data: { paystackSecretKey: encrypted }
            });
            console.log(`✅ Encrypted keys for store: ${store.name}`);
        }
    }
}

migrateKeys();
```

---

## Files Modified

### Frontend
- `apps/web/src/store/useAuthStore.ts` - Added Paystack keys to Store interface

### Backend
- `apps/api/src/auth/auth.service.ts` - Include Paystack keys in auth responses
- `apps/api/src/payments/payments.service.ts` - Encrypt/decrypt secret keys
- `apps/api/src/orders/orders.service.ts` - Send email receipts
- `apps/api/src/orders/orders.module.ts` - Add EmailService provider

### New Files
- `apps/api/src/common/email.service.ts` - Email receipt service
- `apps/api/src/common/encryption.util.ts` - Encryption utility

---

## Troubleshooting

### Settings Still Disappearing?
1. Clear browser localStorage: `localStorage.clear()`
2. Log out and log back in
3. Check browser console for errors

### Email Not Sending?
1. Check `RESEND_API_KEY` is set correctly
2. Check server logs for email errors
3. Verify email address is valid
4. Check Resend dashboard for delivery status

### Encryption Errors?
1. Ensure `ENCRYPTION_KEY` is set in environment
2. Key must be at least 32 characters
3. Check server logs for encryption warnings

---

## Support & Next Steps

### Recommended Enhancements:
1. **Webhook Implementation** - Set up Paystack webhooks for automated order updates
2. **Email Templates** - Create different templates for different order statuses
3. **SMS Notifications** - Add SMS receipts using Twilio or similar
4. **Admin Notifications** - Notify store owners of new orders
5. **Key Rotation** - Implement encryption key rotation strategy

### Questions?
- Check server logs for detailed error messages
- Review Paystack documentation: https://paystack.com/docs
- Review Resend documentation: https://resend.com/docs

---

**Last Updated:** February 11, 2026
**Version:** 1.0.0
