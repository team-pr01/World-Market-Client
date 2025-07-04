import { NextRequest, NextResponse } from "next/server";

const PUBLIC_AUTH_ROUTES = [
     "/app/(authLayout)/signin",
     "/app/(authLayout)/signup",
     "/app/(authLayout)/forgot-password",
     "/app/(authLayout)/reset-password",
     "/app/(authLayout)/verify-email",
];

const PUBLIC_ADMIN_ROUTES = ["/app/(adminLayout)/login"];

export function middleware(request: NextRequest) {
     const pathname = request.nextUrl.pathname;
     const token = request.cookies.get("accessToken")?.value;

     const isAdminRoute = pathname.startsWith("/app/(adminLayout)");
     const isAuthRoute = pathname.startsWith("/app/(authLayout)");

     const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(pathname);
     const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.includes(pathname);

     const isProtectedAdminRoute = isAdminRoute && !isPublicAdminRoute;
     const isProtectedAuthRoute = isAuthRoute && !isPublicAuthRoute;

     if ((isProtectedAdminRoute || isProtectedAuthRoute) && !token) {
          const loginUrl = new URL(
               isAdminRoute ? "/app/(adminLayout)/login" : "/app/(authLayout)/signin",
               request.url
          );
          loginUrl.searchParams.set("from", pathname);
          return NextResponse.redirect(loginUrl);
     }

     return NextResponse.next();
}

export const config = {
     matcher: ["/app/(adminLayout)/:path*", "/app/(authLayout)/:path*"],
};
