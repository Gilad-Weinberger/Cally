import Link from "next/link";

export default function ButtonSecondary({ href, children, fullWidth = false }) {
  return (
    <Link
      href={href}
      className={`${
        fullWidth ? "w-full" : "inline-flex"
      } items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex`}
    >
      {children}
    </Link>
  );
}
