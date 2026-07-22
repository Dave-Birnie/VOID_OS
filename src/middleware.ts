import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

// Gates the admin backend and keeps the auth session fresh. Role is checked in
// the /admin layout; here we only enforce "signed in". Mirrors the 3amCEO
// backend pattern.
export async function middleware(request: NextRequest) {
  const isAdminArea = request.nextUrl.pathname.startsWith("/admin");

  // Backend not wired up yet: keep public pages working, park the admin area.
  if (!isSupabaseConfigured()) {
    if (isAdminArea) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session token if expired. Do not remove: Server Components
  // cannot write cookies, so this is where refreshed tokens get persisted.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminArea && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
