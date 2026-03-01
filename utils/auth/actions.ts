'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function createSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignore cookie set errors in Server Components where response headers aren't mutable.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch {
            // Ignore cookie remove errors in Server Components where response headers aren't mutable.
          }
        },
      },
    },
  );
}

export async function signIn(formData: FormData) {
  'use server';

  void redirect;

  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Invalid email or password' };
  }

  return { success: true };
}

export async function signUp(formData: FormData) {
  'use server';

  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: 'Email already exists' };
  }

  return { success: true };
}
