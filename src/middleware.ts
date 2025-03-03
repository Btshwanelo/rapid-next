import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes with exact matching
const publicRoutes = ["/", "/login", "/register", "/about", "/contact"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Log exactly what path we're processing
  console.log(`Middleware processing: "${pathname}" with token: ${token ? "yes" : "no"}`);

  // Check if this is a static asset that should be accessible without auth
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js)$/)) {
    console.log(`✅ Static asset: ${pathname} - allowing access`);
    return NextResponse.next();
  }

  // Simple exact matching for public routes
  let isPublicRoute = publicRoutes.includes(pathname);
  
  // Handle sub-paths of public routes (except for root '/')
  if (!isPublicRoute) {
    for (const route of publicRoutes) {
      if (route !== "/" && pathname.startsWith(route + "/")) {
        isPublicRoute = true;
        break;
      }
    }
  }
  
  console.log(`Route "${pathname}" is ${isPublicRoute ? "public" : "protected"}`);

  // 🔹 Redirect unauthenticated users away from protected pages
  if (!isPublicRoute && !token) {
    console.log(`🔄 Redirecting to login from: ${pathname}`);
    return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
  }

  // 🔹 Prevent authenticated users from accessing login/register
  if ((pathname === "/login" || pathname === "/register" || pathname === "/") && token) {
    console.log("🔄 Redirecting to dashboard - Already authenticated");
    return NextResponse.redirect(new URL("/dashboard", req.url), { status: 302 });
  }

  console.log(`✅ Proceeding normally with: ${pathname}`);
  return NextResponse.next();
}

// Improved matcher to exclude static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static file extensions (.svg, .jpg, etc)
     * 4. favicon.ico, sitemap.xml (common static files)
     */
    '/((?!api|_next|fonts|images|favicon.ico|sitemap.xml).*)',
  ],
};