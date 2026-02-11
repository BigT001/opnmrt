import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
  CipherGCM,
  DecipherGCM,
} from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Encryption utility for sensitive data like API keys
 * Uses AES-256-GCM encryption
 */
export class EncryptionUtil {
  private static algorithm = 'aes-256-gcm';

  /**
   * Get encryption key from environment or generate a warning
   */
  private static async getKey(): Promise<Buffer> {
    const secret =
      process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-production';

    if (!process.env.ENCRYPTION_KEY) {
      console.warn(
        '⚠️  WARNING: ENCRYPTION_KEY not set in environment. Using default key. Set ENCRYPTION_KEY in production!',
      );
    }

    // Derive a 32-byte key from the secret
    return (await scryptAsync(secret, 'salt', 32)) as Buffer;
  }

  /**
   * Encrypt sensitive data
   * @param text - Plain text to encrypt
   * @returns Encrypted string in format: iv:authTag:encryptedData
   */
  static async encrypt(text: string): Promise<string> {
    if (!text) return text;

    const key = await this.getKey();
    const iv = randomBytes(16);

    const cipher = createCipheriv(this.algorithm, key, iv) as CipherGCM;

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   * @param encryptedText - Encrypted string in format: iv:authTag:encryptedData
   * @returns Decrypted plain text
   */
  static async decrypt(encryptedText: string): Promise<string> {
    if (!encryptedText) return encryptedText;

    // If it doesn't contain colons, it might be unencrypted (legacy data)
    if (!encryptedText.includes(':')) {
      console.warn(
        '⚠️  Attempting to decrypt unencrypted data. Returning as-is.',
      );
      return encryptedText;
    }

    const key = await this.getKey();
    const parts = encryptedText.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipheriv(this.algorithm, key, iv) as DecipherGCM;
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
