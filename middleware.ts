import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value, ...options });
          } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value: '', ...options, maxAge: 0 });
          } catch (e) {}
        },
      },
    }
  );

  // ✅ Correct destructuring: getUser() returns { data: { user }, error }
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Public paths that don't require auth
  const publicPaths = ['/', '/login', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);

  // If not logged in and trying to access protected route
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in, handle role-based redirects
  if (user) {
    // Fetch profile with correct destructuring
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role;

    // Redirect logged-in users away from auth pages
    if (pathname === '/login' || pathname === '/signup') {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Block traders from accessing admin
    if (role === 'trader' && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect admins trying to access trader dashboard to admin panel
    if (role === 'admin' && pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
