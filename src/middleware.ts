import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin');

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return null;
        }

        if (!isAuth) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        const isDashboard = req.nextUrl.pathname === '/dashboard';
        const role = token.role;

        // Admin visiting user dashboard
        if (isDashboard && role === 'admin') {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        // User visiting admin pages
        if (isAdminPage && role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token || true,
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/admin",
        "/dashboard/:path*",
        "/dashboard",
        "/complaints/:path*",
        "/complaints",
        "/profile/:path*",
        "/profile",
        "/auth/:path*",
        "/auth"
    ],
};
