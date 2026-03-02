import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-[#0047AB] mb-4">Vornix</h1>
        <p className="text-gray-600 mb-8">
          Next-generation proprietary trading firm. Trade with our capital, keep your profits.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-[#0047AB] text-white rounded-lg font-medium hover:bg-[#003580]"
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="px-6 py-3 border border-[#0047AB] text-[#0047AB] rounded-lg font-medium hover:bg-[#0047AB] hover:text-white"
          >
            Sign Up
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-[#0047AB] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
