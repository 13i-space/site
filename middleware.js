import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If auth isn't configured yet, don't touch anything - let every
  // request through untouched rather than crashing the whole site over
  // an optional feature that hasn't been wired up.
  if (!url || !anonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  // Belt-and-suspenders: env vars can be *present* but malformed (stray
  // whitespace, wrong value pasted into the wrong field, etc). That still
  // throws inside createServerClient / getUser() and previously took the
  // whole site down. Catch it here too and just pass the request through -
  // worst case, auth silently doesn't refresh for that request, instead of
  // every page on the site 500ing.
  try {
    const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Touching getUser() is what actually triggers a token refresh if needed.
    await supabase.auth.getUser();
  } catch (err) {
    console.error("Middleware: Supabase auth check failed, passing request through:", err);
    return NextResponse.next({ request });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|mp3)$).*)",
  ],
};
