'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function signIn(formData: FormData) {
  const cookieStore = cookies();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookie setting failed on server
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch (error) {
            // Cookie removal failed on server
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    // Return the REAL Supabase error for debugging
    return { error: `Supabase Error: ${error.message}` };
  }
  
  return { success: true };
}

export async function signUp(formData: FormData) {
  const cookieStore = cookies();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookie setting failed on server
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch (error) {
            // Cookie removal failed on server
          }
        },
      },
    }
  );

  const { error, data } = await supabase.auth.signUp({ email, password });
  
  if (error) {
    // Return the REAL Supabase error for debugging
    return { error: `Supabase Error: ${error.message}` };
  }
  
  // Log the response for debugging (check Vercel logs if needed)
  console.log('SignUp Response:', { user: data?.user, identity: data?.identity });
  
  return { success: true };
}
