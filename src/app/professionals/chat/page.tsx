// Server Component
import { Suspense } from "react";
import ChatSession from "@/components/shared/chat/ChatSession";

export const dynamic = "force-dynamic";
export default function ProfessionalsChatPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading chat…</div>}>
      <ChatSession segment="professional" />
    </Suspense>
  );
}
