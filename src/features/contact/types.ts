export type ContactSubmitResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
