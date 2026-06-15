import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  ContactMessageSummaryVM,
  ContactMessageDetailVM,
  MessagesListVM,
  MessageStatus,
} from "@/features/admin/types";

export type MessagesFilter = {
  status?: MessageStatus;
  page?: number;
  pageSize?: number;
};

export async function listContactMessages(
  filter: MessagesFilter = {}
): Promise<MessagesListVM> {
  const { status, page = 1, pageSize = 25 } = filter;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("contact_messages")
    .select(
      "id, full_name, email, phone, interest, status, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) return { items: [], total: 0 };

  return {
    items: (data ?? []) as ContactMessageSummaryVM[],
    total: count ?? 0,
  };
}

export async function getContactMessage(
  id: string
): Promise<ContactMessageDetailVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      "id, full_name, email, phone, interest, message, source_path, status, admin_notes, viewed_at, resolved_at, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data as ContactMessageDetailVM;
}

export async function updateContactMessageStatus(
  id: string,
  status: MessageStatus
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const updates: Record<string, unknown> = { status };
  if (status === "viewed") updates.viewed_at = new Date().toISOString();
  if (status === "resolved") updates.resolved_at = new Date().toISOString();

  const { error } = await supabase
    .from("contact_messages")
    .update(updates)
    .eq("id", id);

  return !error;
}

export async function updateContactMessageNotes(
  id: string,
  admin_notes: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ admin_notes })
    .eq("id", id);

  return !error;
}
