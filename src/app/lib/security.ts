// /lib/security.ts
// Security utilities for input validation and sanitization

import crypto from 'crypto';

export function validateInput(
  userId: string, 
  departmentId: string, 
  messageText: string, 
  tenantId: string
): boolean {
  // UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!userId || !uuidRegex.test(userId)) return false;
  if (!tenantId || !uuidRegex.test(tenantId)) return false;
  if (!departmentId || typeof departmentId !== 'string') return false;
  if (!messageText || typeof messageText !== 'string') return false;
  if (messageText.length > 10000) return false; // Max message length
  
  return true;
}

export function sanitizeText(text: string): string {
  // Remove potential XSS vectors and clean quotes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .trim();
}

export async function hashUserId(userId: string): Promise<string> {
  const salt = process.env.ANONYMIZATION_SALT;
  if (!salt) {
    throw new Error('ANONYMIZATION_SALT environment variable is required');
  }
  
  // Hash user ID for anonymization (GCC compliance)
  return crypto
    .createHash('sha256')
    .update(userId + salt)
    .digest('hex');
}
