import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

interface OrderEmailData {
  // Customer info
  customerEmail: string;
  customerName: string;

  // Seller info
  sellerEmail: string;
  sellerName: string;

  // Order info
  orderId: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;

  // Store info
  storeName: string;
  storeSubdomain: string;

  // Payment info
  paymentReference: string;
}

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Send order confirmation emails to both buyer and seller
   */
  async sendOrderEmails(data: OrderEmailData) {
    const results = await Promise.allSettled([
      this.sendBuyerReceipt(data),
      this.sendSellerNotification(data),
    ]);

    const [buyerResult, sellerResult] = results;

    return {
      buyer:
        buyerResult.status === 'fulfilled'
          ? buyerResult.value
          : { success: false, error: buyerResult.reason },
      seller:
        sellerResult.status === 'fulfilled'
          ? sellerResult.value
          : { success: false, error: sellerResult.reason },
    };
  }

  /**
   * Send beautiful branded receipt to the buyer
   */
  private async sendBuyerReceipt(data: OrderEmailData) {
    const itemsHtml = data.items
      .map(
        (item) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #111827;">${item.name}</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: 600;">
                    ₦${(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
            </tr>
        `,
      )
      .join('');

    const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Receipt - ${data.storeName}</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Store Header -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                        <div style="background-color: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                        </div>
                        <h1 style="color: white; margin: 0 0 8px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Thank You!</h1>
                        <p style="color: rgba(255, 255, 255, 0.95); margin: 0; font-size: 18px; font-weight: 500;">Your order from ${data.storeName} is confirmed</p>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 40px 32px;">
                        
                        <!-- Personal Message -->
                        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #10b981; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
                            <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.6;">
                                <strong>Hi ${data.customerName}!</strong><br><br>
                                We're excited to let you know that your order has been successfully placed and payment confirmed. 
                                We'll start processing your items right away and keep you updated every step of the way.
                            </p>
                        </div>

                        <!-- Order Summary Box -->
                        <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
                            <h2 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280;">Order Summary</h2>
                            <div style="display: grid; gap: 14px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Order Number</span>
                                    <strong style="color: #111827; font-size: 14px; font-family: 'Courier New', monospace;">#${data.orderId.substring(0, 8).toUpperCase()}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Order Date</span>
                                    <strong style="color: #111827; font-size: 14px;">${data.orderDate}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Payment Reference</span>
                                    <strong style="color: #111827; font-size: 14px; font-family: 'Courier New', monospace;">${data.paymentReference}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Store</span>
                                    <strong style="color: #10b981; font-size: 14px;">${data.storeName}</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Items Table -->
                        <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280;">Your Items</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background-color: #f9fafb;">
                                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Item</th>
                                    <th style="padding: 14px 12px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Qty</th>
                                    <th style="padding: 14px 12px; text-align: right; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <!-- Total Amount -->
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 28px; text-align: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
                            <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Total Amount Paid</p>
                            <p style="margin: 0; color: white; font-size: 42px; font-weight: 700; letter-spacing: -1px;">₦${data.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                            <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">Payment Successful ✓</p>
                        </div>

                        <!-- What's Next -->
                        <div style="margin-top: 32px; padding: 24px; background-color: #fffbeb; border-radius: 12px; border-left: 4px solid #f59e0b;">
                            <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 700;">What's Next?</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                                <li>We're preparing your order for shipment</li>
                                <li>You'll receive a shipping confirmation soon</li>
                                <li>Track your order status via email updates</li>
                            </ul>
                        </div>

                        <!-- Footer Message -->
                        <div style="margin-top: 40px; padding-top: 32px; border-top: 2px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 700;">Thank you for choosing ${data.storeName}!</p>
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                We truly appreciate your business. If you have any questions about your order,<br>
                                please don't hesitate to contact us.
                            </p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                            This receipt was sent from <strong>${data.storeName}</strong> via OPNMRT
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                            Please do not reply to this email. For support, contact the store directly.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

    try {
      const { data: emailData, error } = await this.resend.emails.send({
        from: `${data.storeName} <orders@resend.dev>`,
        to: [data.customerEmail],
        subject: `🎉 Order Confirmed - ${data.storeName} (#${data.orderId.substring(0, 8).toUpperCase()})`,
        html: emailHtml,
      });

      if (error) {
        console.error('❌ Failed to send buyer receipt:', error);
        return { success: false, error };
      }

      console.log('✅ Buyer receipt sent successfully to:', data.customerEmail);
      return { success: true, data: emailData };
    } catch (error) {
      console.error('❌ Error sending buyer receipt:', error);
      return { success: false, error };
    }
  }

  /**
   * Send payment notification to the seller
   */
  private async sendSellerNotification(data: OrderEmailData) {
    const itemsHtml = data.items
      .map(
        (item) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                    <strong>${item.name}</strong>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: 600;">
                    ₦${(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
            </tr>
        `,
      )
      .join('');

    const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Order Alert - ${data.storeName}</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Alert Header -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 48px 32px; text-align: center;">
                        <div style="background-color: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <h1 style="color: white; margin: 0 0 8px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">New Order Received!</h1>
                        <p style="color: rgba(255, 255, 255, 0.95); margin: 0; font-size: 18px; font-weight: 500;">Payment Confirmed</p>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 40px 32px;">
                        
                        <!-- Alert Message -->
                        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 4px solid #3b82f6; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
                            <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
                                <strong>Great news, ${data.sellerName}!</strong><br><br>
                                You've received a new order and payment has been successfully processed. 
                                Please prepare the items for shipment and update the customer on the delivery timeline.
                            </p>
                        </div>

                        <!-- Order Details -->
                        <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
                            <h2 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280;">Order Details</h2>
                            <div style="display: grid; gap: 14px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Order Number</span>
                                    <strong style="color: #111827; font-size: 14px; font-family: 'Courier New', monospace;">#${data.orderId.substring(0, 8).toUpperCase()}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Order Date</span>
                                    <strong style="color: #111827; font-size: 14px;">${data.orderDate}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Customer</span>
                                    <strong style="color: #111827; font-size: 14px;">${data.customerName}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Customer Email</span>
                                    <strong style="color: #3b82f6; font-size: 14px;">${data.customerEmail}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #6b7280; font-size: 14px;">Payment Reference</span>
                                    <strong style="color: #111827; font-size: 14px; font-family: 'Courier New', monospace;">${data.paymentReference}</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Items Table -->
                        <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280;">Order Items</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background-color: #f9fafb;">
                                    <th style="padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Product</th>
                                    <th style="padding: 14px 12px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Qty</th>
                                    <th style="padding: 14px 12px; text-align: right; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <!-- Payment Amount -->
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 28px; text-align: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
                            <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Total Payment Received</p>
                            <p style="margin: 0; color: white; font-size: 42px; font-weight: 700; letter-spacing: -1px;">₦${data.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                            <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">Funds will be settled to your Paystack account</p>
                        </div>

                        <!-- Action Items -->
                        <div style="margin-top: 32px; padding: 24px; background-color: #fef3c7; border-radius: 12px; border-left: 4px solid #f59e0b;">
                            <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 700;">Next Steps</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                                <li>Verify inventory and prepare items for shipment</li>
                                <li>Contact customer if you need additional information</li>
                                <li>Update order status in your dashboard</li>
                                <li>Provide tracking information once shipped</li>
                            </ul>
                        </div>

                        <!-- Dashboard Link -->
                        <div style="margin-top: 32px; text-align: center;">
                            <a href="http://localhost:3000/dashboard/seller/orders" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                                View Order in Dashboard →
                            </a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                            This is an automated notification from <strong>OPNMRT</strong>
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                            Manage your orders at ${data.storeSubdomain}.localhost:3000/dashboard
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

    try {
      const { data: emailData, error } = await this.resend.emails.send({
        from: 'OPNMRT Orders <notifications@resend.dev>',
        to: [data.sellerEmail],
        subject: `💰 New Order & Payment - ${data.storeName} (#${data.orderId.substring(0, 8).toUpperCase()})`,
        html: emailHtml,
      });

      if (error) {
        console.error('❌ Failed to send seller notification:', error);
        return { success: false, error };
      }

      console.log(
        '✅ Seller notification sent successfully to:',
        data.sellerEmail,
      );
      return { success: true, data: emailData };
    } catch (error) {
      console.error('❌ Error sending seller notification:', error);
      return { success: false, error };
    }
  }
}
