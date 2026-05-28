import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createClient() {
  if (url && serviceKey) {
    return createSupabaseClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return createMockClient();
}

// Fluent mock that supports chaining: .from().insert().select().single()
// and .from().select().eq().single()
function createMockClient() {
  function makeBuilder(resolvedData: { data: unknown; error: null }) {
    const builder: Record<string, unknown> = {
      insert(data: unknown) {
        console.log("[Supabase Mock] insert:", data);
        // Return a new builder that will resolve with a generated id
        return makeBuilder({ data: [{ id: `mock-${Date.now()}` }], error: null });
      },
      select(_cols?: string) { return this; },
      eq(_col: string, _val: unknown) { return this; },
      single() {
        // Return a thenable that resolves with the first item
        const d = Array.isArray(resolvedData.data)
          ? resolvedData.data[0] ?? null
          : resolvedData.data;
        return Promise.resolve({ data: d, error: null });
      },
      update(data: unknown) {
        console.log("[Supabase Mock] update:", data);
        return makeBuilder({ data: null, error: null });
      },
      upsert(data: unknown) {
        console.log("[Supabase Mock] upsert:", data);
        return makeBuilder({ data: null, error: null });
      },
      // Make the builder itself awaitable (returns array result)
      then(resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) {
        return Promise.resolve({ data: resolvedData.data, error: null }).then(resolve, reject);
      },
    };
    return builder;
  }

  return {
    from(_table: string) {
      return makeBuilder({ data: [], error: null });
    },
  };
}
