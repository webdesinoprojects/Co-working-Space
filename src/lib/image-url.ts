const IMAGEKIT_HOST_SUFFIX = ".imagekit.io";

function isImageKitHost(hostname: string): boolean {
  return hostname === "ik.imagekit.io" || hostname.endsWith(IMAGEKIT_HOST_SUFFIX);
}

export function withImageKitWebp(url: string): string {
  try {
    const parsed = new URL(url);
    if (!isImageKitHost(parsed.hostname)) return url;

    const existingTransform = parsed.searchParams.get("tr");
    if (existingTransform?.split(",").some((part) => part.trim().startsWith("f-"))) {
      return parsed.toString();
    }

    parsed.searchParams.set(
      "tr",
      existingTransform ? `${existingTransform},f-webp` : "f-webp"
    );
    return parsed.toString();
  } catch {
    return url;
  }
}
