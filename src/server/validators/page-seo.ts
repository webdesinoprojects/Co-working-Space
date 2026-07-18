import { z } from "zod";
import { PUBLIC_PAGE_ROUTES } from "@/lib/seo-defaults";

const optionalText = (max: number) =>
  z.string().max(max).trim().optional().nullable();

export const pageSeoSchema = z.object({
  route_path: z.enum(PUBLIC_PAGE_ROUTES),
  meta_title: optionalText(200),
  meta_description: optionalText(400),
});
