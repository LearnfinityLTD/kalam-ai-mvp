// ---- Shared types & constants ----
export const USER_TYPES = [
  "guard",
  "professional",
  "enterprise",
  "general",
  "guide",
] as const;

export type BaseProps = {
  userType?: UserType;
  source?: string;
  className?: string;
};

export type UserType = (typeof USER_TYPES)[number];
