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
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options, maxAge: 0 }); } catch (e) {}
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    if (error.message?.includes('Email not confirmed')) {
      return { error: 'Please confirm your email before logging in. Check your inbox.' };
    }
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
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options, maxAge: 0 }); } catch (e) {}
        },
      },
    }
  );

  const { error, data } = await supabase.auth.signUp({ email, password });
  
  if (error) {
    return { error: `Supabase Error: ${error.message}` };
  }
  
  console.log('SignUp Success:', { userId: data?.user?.id });
  return { success: true };
}

export async function signOut() {
  'use server';
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options, maxAge: 0 }); } catch (e) {}
        },
      },
    }
  );

  await supabase.auth.signOut();
  return { success: true };
}
