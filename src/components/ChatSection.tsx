import { fetchChat } from "@/lib/api";
import { Chat } from "@/components/Chat";

export async function ChatSection() {
  const items = await fetchChat();

  return <Chat initialItems={items} />;
}
