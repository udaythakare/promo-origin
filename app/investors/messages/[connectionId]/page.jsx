import { Suspense } from "react";
import { getMessages } from "@/app/actions/messages/getMessages";
import { getUserId } from "@/helpers/userHelper";
import ChatWindow from "@/app/components/chat/ChatWindow";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function ChatPageContent({ connectionId }) {
  const userId = await getUserId();
  if (!userId || userId?.msg) redirect("/login");

  const result = await getMessages(connectionId);

  if (!result.success) {
    return (
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "center", height: "100vh",
        color: "#ef4444", fontWeight: 700, fontSize: 16,
      }}>
        {result.message}
      </div>
    );
  }

  const { data: currentUser } = await supabaseAdmin
    .from("users")
    .select("full_name")
    .eq("id", userId)
    .single();

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
      currentUserName={currentUser?.full_name || "You"}
      otherPersonName={vendorUser?.full_name || "Vendor"}
      backUrl="/investors/vendors"
      theme="investor"
    />
  );
}

export default async function InvestorChatPage({ params }) {
  const { connectionId } = await params;

  return (
    <Suspense fallback={
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "center", height: "100vh",
        background: "#0d1117", color: "#f5c518",
        fontWeight: 700, fontSize: 16,
      }}>
        Loading chat...
      </div>
    }>
      <ChatPageContent connectionId={connectionId} />
    </Suspense>
  );
}