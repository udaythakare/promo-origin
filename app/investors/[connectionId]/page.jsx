import { getMessages } from "@/app/actions/messages/getMessages";
import { getUserId } from "@/helpers/userHelper";
import ChatWindow from "@/app/components/chat/ChatWindow";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function InvestorChatPage({ params }) {
  const { connectionId } = await params;

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    redirect("/login");
  }

  const result = await getMessages(connectionId);

  if (!result.success) {
    return (
      <div className="p-6 text-red-500 font-bold">
        {result.message}
      </div>
    );
  }

  // Get the vendor's name to show in chat header
  const { data: vendorUser } = await supabaseAdmin
    .from("users")
    .select("full_name")
    .eq("id", result.connection.vendor_id)
    .single();

  return (
    <ChatWindow
      connectionId={connectionId}
      initialMessages={result.messages}
      currentUserId={result.currentUserId}
      otherPersonName={vendorUser?.full_name || "Vendor"}
      backUrl="/investors/vendors"
    />
  );
}