// lib/calculations.ts
export function calculateGrade(totalScore: number): string {
  if (totalScore >= 90) return "A+";
  if (totalScore >= 80) return "A";
  if (totalScore >= 70) return "B";
  if (totalScore >= 60) return "C";
  if (totalScore >= 50) return "D";
  return "F";
}

export function generateBadgeCode(): string {
  // Generate unique 8-character verification code
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function sendVerificationEmail(
  creatorEmail: string,
  courseTitle: string,
  score: number,
  badgeCode: string
) {
  // Use Resend or similar
  // Include badge embed code for their course page
}
