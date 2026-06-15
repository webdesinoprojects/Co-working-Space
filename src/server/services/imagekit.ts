import "server-only";
import crypto from "crypto";
import { createMediaAsset } from "@/server/repositories/media";
import { MAX_FILE_SIZE_BYTES, mediaAssetSchema } from "@/server/validators/media";
import type { IkAuthParamsVM, ActionResult } from "@/features/admin/types";
import type { MediaAssetVM } from "@/features/admin/types";

function isFromConfiguredImageKitEndpoint(url: string, endpoint: string): boolean {
  try {
    const assetUrl = new URL(url);
    const endpointUrl = new URL(endpoint);
    const endpointPath = endpointUrl.pathname.endsWith("/")
      ? endpointUrl.pathname
      : `${endpointUrl.pathname}/`;

    return (
      assetUrl.protocol === endpointUrl.protocol &&
      assetUrl.hostname === endpointUrl.hostname &&
      (assetUrl.pathname === endpointUrl.pathname ||
        assetUrl.pathname.startsWith(endpointPath))
    );
  } catch {
    return false;
  }
}

// Generates short-lived authentication parameters for direct client-side
// ImageKit uploads. The private key NEVER leaves this server module.
// Reference: https://imagekit.io/docs/api-reference/upload-file/client-side-file-upload#authentication
export function getImageKitAuthParams(): IkAuthParamsVM {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!privateKey || !publicKey || !urlEndpoint) {
    throw new Error(
      "ImageKit env vars are not configured. Set IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT."
    );
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2700; // 45 min — ImageKit requires strictly less than 1 hour
  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return {
    token,
    expire,
    signature,
    publicKey,
    urlEndpoint,
  };
}

// Called after a successful client-side upload to persist the asset metadata
// in the media_assets table. Never exposes the private key.
export async function persistImageKitAsset(
  uploadResult: {
    fileId: string;
    filePath: string;
    url: string;
    name: string;
    width?: number;
    height?: number;
    fileType?: string;
    size?: number;
  },
  options: {
    alt_text?: string;
    folder?: string;
    created_by?: string;
  } = {}
): Promise<ActionResult<MediaAssetVM>> {
  const mimeFromType = (fileType: string | undefined): string | undefined => {
    if (!fileType) return undefined;
    if (fileType.startsWith("image/")) return fileType;
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
    };
    return map[fileType.toLowerCase()];
  };

  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (
    !urlEndpoint ||
    !isFromConfiguredImageKitEndpoint(uploadResult.url, urlEndpoint)
  ) {
    return {
      success: false,
      error: "Upload did not come from the configured ImageKit endpoint",
    };
  }

  if (uploadResult.size && uploadResult.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "Image is larger than the allowed upload size",
    };
  }

  const mime_type = mimeFromType(uploadResult.fileType);
  if (!mime_type) {
    return {
      success: false,
      error: "Unsupported image type",
    };
  }

  const input = {
    provider_file_id: uploadResult.fileId,
    file_key: uploadResult.filePath,
    file_url: uploadResult.url,
    file_name: uploadResult.name,
    alt_text: options.alt_text ?? undefined,
    width: uploadResult.width && uploadResult.width > 0 ? uploadResult.width : undefined,
    height: uploadResult.height && uploadResult.height > 0 ? uploadResult.height : undefined,
    mime_type: mime_type as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/avif"
      | undefined,
    folder: options.folder ?? undefined,
    is_published: true,
    created_by: options.created_by,
  };

  const parsed = mediaAssetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid asset data from upload result",
    };
  }

  const asset = await createMediaAsset({
    ...parsed.data,
    created_by: options.created_by,
  });

  if (!asset) {
    return {
      success: false,
      error: "Failed to save asset metadata",
    };
  }

  return { success: true, data: asset };
}
