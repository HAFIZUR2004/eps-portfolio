import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isPublicApiRoute = createRouteMatcher(["/api/fiverr-review(.*)"]); // 👈 API Route পাবলিক ঘোষণা

export default clerkMiddleware(async (auth, req) => {
  // ১. পাবলিক API রুটে সরাসরি অ্যাক্সেস অনুমতি দেওয়া হলো
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  // ২. ড্যাশবোর্ড প্রোটেকশন
  if (isDashboardRoute(req)) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const userRole = 
      (sessionClaims?.metadata as { role?: string })?.role || 
      (sessionClaims?.publicMetadata as { role?: string })?.role;

    if (userRole !== "admin") {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};