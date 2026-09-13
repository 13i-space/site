// Server-side Supabase client using the service role key, which has full
// database access and must NEVER be exposed to the browser. Only import
// this file from API routes (app/api/**/route.js), never from a
// "use client" component.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return null;
  }
  return {
    url,
    serviceKey,
    async query(path, options = {}) {
      const res = await fetch(`${url}/rest/v1/${path}`, {
        ...options,
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
      return res;
    },
  };
}
