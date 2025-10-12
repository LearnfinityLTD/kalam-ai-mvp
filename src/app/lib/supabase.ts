// // src/lib/supabase.ts
// import { createBrowserClient } from "@supabase/ssr";
// import { Database } from "./database.types";

// // Client (in browser components)
// export const createClient = () =>
//   createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );

// // Helper types
// export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
//   Database["public"]["Tables"][T]["Insert"];
// export type TablesRow<T extends keyof Database["public"]["Tables"]> =
//   Database["public"]["Tables"][T]["Row"];
