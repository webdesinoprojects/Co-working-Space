const DEFAULT_SITE_URL = "https://www.alleywork.com";

export const SITE_NAME = "Alley Workspace";

export const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_SITE_URL)
).replace(/\/$/, "");

export const SITE_METADATA_BASE = new URL(SITE_URL);
