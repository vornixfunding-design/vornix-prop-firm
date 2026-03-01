'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from '@/utils/auth/actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-[#0047AB]">Sign In</h1>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form action={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/25"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/25"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-[#0047AB] px-4 py-3 font-medium text-white transition hover:brightness-110"
          >
            Sign In
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-[#0047AB] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
