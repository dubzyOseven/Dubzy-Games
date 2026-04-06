import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Must match lib/auth.ts pages.signIn — default middleware sign-in is /api/auth/signin,
  // which breaks the custom credentials login UX and redirects.
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname === "/admin/login") return true;
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};