'use client';

import { signUp } from '@/utils/auth/actions';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    setMessage('');
    
    const result = await signUp(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setMessage('Account created! Please check your email to confirm your account.');
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/login';
      }, 4000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0047AB]">Vornix</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>
        
        <form className="mt-8 space-y-6" action={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {message}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                disabled={loading}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] sm:text-sm"
                placeholder="Password (min 6 characters)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0047AB] hover:bg-[#003580] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0047AB] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#0047AB] hover:text-[#003580]">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
