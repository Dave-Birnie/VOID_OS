import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

// Gates the member area (admin backend + logged-in-only pages) and keeps the
// auth session fresh. Admin role is checked in the /admin layout; here we only
// enforce "signed in". Mirrors the 3amCEO backend pattern.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Pages that require a logged-in account (any member). Community Chat and the
  // Dev Journey portal are member-only; /admin additionally requires admin role.
  const requiresAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/community-chat") ||
    pathname.startsWith("/dev-journey");

  // Backend not wired up yet: keep public pages working, park gated pages.
  if (!isSupabaseConfigured()) {
    if (requiresAuth) {
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

  if (requiresAuth && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/community-chat/:path*",
    "/dev-journey/:path*",
    "/login",
  ],
};
