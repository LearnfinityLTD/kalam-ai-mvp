// /lib/security.ts
// Security utilities for input validation and sanitization

import crypto from "crypto";

export function validateInput(
  userId: string,
  departmentId: string,
  messageText: string,
  tenantId: string
): boolean {
  // More flexible UUID validation regex that accepts UUID v1, v3, v4, and v5
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  console.log("UUID validation check:");
  console.log("userId:", userId, "matches:", uuidRegex.test(userId));
  console.log("tenantId:", tenantId, "matches:", uuidRegex.test(tenantId));

  if (!userId || !uuidRegex.test(userId)) {
    console.log("userId validation failed");
    return false;
  }
  if (!tenantId || !uuidRegex.test(tenantId)) {
    console.log("tenantId validation failed");
    return false;
  }
  if (!departmentId || typeof departmentId !== "string") {
    console.log("departmentId validation failed");
    return false;
  }
  if (!messageText || typeof messageText !== "string") {
    console.log("messageText validation failed");
    return false;
  }
  if (messageText.length > 10000) {
    console.log("messageText too long");
    return false;
  }

  console.log("All validation passed");
  return true;
}

export function sanitizeText(text: string): string {
  // Remove potential XSS vectors and clean quotes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;")
    .trim();
}

export async function hashUserId(userId: string): Promise<string> {
  const salt = process.env.ANONYMIZATION_SALT;
  if (!salt) {
    throw new Error("ANONYMIZATION_SALT environment variable is required");
  }

  // Hash user ID for anonymization (GCC compliance)
  return crypto
    .createHash("sha256")
    .update(userId + salt)
    .digest("hex");
}
