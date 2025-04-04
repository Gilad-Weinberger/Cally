'use client';

import Link from 'next/link';

const SecondaryButton = ({ children, href, onClick, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors';
  const classes = `${baseClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default SecondaryButton;