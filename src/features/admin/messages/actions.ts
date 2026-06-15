"use server";

import { requireAdmin } from "@/server/auth/guards";
import {
  listContactMessages,
  getContactMessage,
  updateContactMessageStatus,
  updateContactMessageNotes,
  type MessagesFilter,
} from "@/server/repositories/messages";
import {
  messageStatusSchema,
  messageNotesSchema,
} from "@/server/validators/homepage";
import type {
  MessagesListVM,
  ContactMessageDetailVM,
  ActionResult,
} from "@/features/admin/types";

export async function listMessagesAction(
  filter: MessagesFilter = {}
): Promise<MessagesListVM> {
  await requireAdmin();
  return listContactMessages(filter);
}

export async function getMessageAction(
  id: string
): Promise<ContactMessageDetailVM | null> {
  await requireAdmin();
  return getContactMessage(id);
}

export async function updateMessageStatusAction(
  raw: unknown
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = messageStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const ok = await updateContactMessageStatus(parsed.data.id, parsed.data.status);
  return ok ? { success: true } : { success: false, error: "Update failed" };
}

export async function updateMessageNotesAction(
  raw: unknown
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = messageNotesSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const ok = await updateContactMessageNotes(
    parsed.data.id,
    parsed.data.admin_notes
  );
  return ok ? { success: true } : { success: false, error: "Update failed" };
}
