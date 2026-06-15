import { listMessagesAction } from "@/features/admin/messages/actions";
import { ContactInbox } from "./ContactInbox";

export default async function MessagesPage() {
  const initial = await listMessagesAction({ pageSize: 100 });
  return <ContactInbox initial={initial} />;
}
