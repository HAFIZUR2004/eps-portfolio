import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isPublicApiRoute = createRouteMatcher(["/api/fiverr-review(.*)"]); // 👈 পাবলিক API রুট

export default clerkMiddleware(async (auth, req) => {
  // ১. পাবলিক API রুট চেক
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  // ২. ড্যাশবোর্ড প্রোটেকশন
  if (isDashboardRoute(req)) {
    // Clerk-এর সর্বশেষ ভার্সন অনুযায়ী auth() একটি Promise রিটার্ন করে
    const authData = await auth();
    const { userId, sessionClaims } = authData;

    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Role বের করে আনা
    const userRole =
      (sessionClaims?.metadata as { role?: string })?.role ||
      (sessionClaims?.publicMetadata as { role?: string })?.role;

    // Admin না হলে হোমপেজে রিডাইরেক্ট
    if (userRole !== "admin") {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};