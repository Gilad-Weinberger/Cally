import Link from 'next/link';

export default function SecondaryButton({ href, children }) {
  return (
    <Link 
      href={href} 
      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {children}
    </Link>
  );
}