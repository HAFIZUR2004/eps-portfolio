import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // ১. ইউজার ড্যাশবোর্ডে ঢুকতে চাইলে এবং লগইন না থাকলে Sign-in পেজে পাঠাবে
  if (isDashboardRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // ২. metadata অথবা publicMetadata দুটোই চেক করা হচ্ছে (নিরাপত্তার জন্য)
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