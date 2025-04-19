import Link from "next/link";

export default function ButtonPrimary({
  href,
  children,
  fullWidth = false,
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`${
        fullWidth ? "w-full" : "inline-flex"
      } items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg transition-all hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium
      text-xs xs:text-sm md:text-base 
      px-3 xs:px-4 sm:px-5 md:px-6
      py-1.5 xs:py-2 sm:py-2.5 md:py-3
      ${className}`}
    >
      {children}
    </Link>
  );
}
