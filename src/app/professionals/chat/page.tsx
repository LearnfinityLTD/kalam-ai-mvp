// Server Component
import { Suspense } from "react";
import ChatSession from "@/components/shared/chat/ChatSession";

export const dynamic = "force-dynamic";
export default function ProfessionalsChatPage() {
  return (
    <Suspense
      fallback={
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      }
    >
      <ChatSession segment="professional" />
    </Suspense>
  );
}
