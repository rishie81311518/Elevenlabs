import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // 1. Define public route patterns using Regex
  const publicRoutePatterns = [
    /^\/sign-in(.*)/,
    /^\/sign-up(.*)/,
    /^\/$/,
  ];

  const isPublicRoute = publicRoutePatterns.some((pattern) => pattern.test(pathname));
  const isOrgSelectionRoute = pathname.startsWith('/select-org') || pathname.startsWith('/create-organization');

  // Allow public routes
  if (isPublicRoute) {
    return;
  }

  // Get auth details for the current user
  const { userId, orgId } = await auth();

  // 2. Ensure user is logged in for ANY non-public route
  if (!userId) {
    await auth.protect(); // Redirects to sign-in page if not logged in
    return;
  }

  // 3. Allow access to org-selection routes (userId exists, orgId not required yet)
  if (isOrgSelectionRoute) {
    return;
  }

  // 4. Require orgId for all remaining protected routes
  if (!orgId) {
    // If authenticated but no active organization selected, redirect to org selection
    const orgSelectionUrl = new URL('/select-org', req.url);
    return NextResponse.redirect(orgSelectionUrl);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};