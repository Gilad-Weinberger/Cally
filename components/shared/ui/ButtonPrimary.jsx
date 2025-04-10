import Link from "next/link";

export default function ButtonPrimary({ href, children, fullWidth = false }) {
  return (
    <Link
      href={href}
      className={`${
        fullWidth ? "w-full" : "inline-flex"
      } items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex`}
    >
      {children}
    </Link>
  );
}
