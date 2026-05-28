import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (url && key) {
    return createBrowserClient(url, key);
  }
  return createMockClient();
}

function createMockClient() {
  return {
    from: (_table: string) => ({
      insert: async (_data: unknown) => ({ data: null, error: null }),
      select: async (_cols?: string) => ({ data: [], error: null }),
      upsert: async (_data: unknown) => ({ data: null, error: null }),
      eq: function (_col: string, _val: unknown) { return this; },
      single: async () => ({ data: null, error: null }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}
