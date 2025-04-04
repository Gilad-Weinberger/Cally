'use client';

import Link from 'next/link';
import { FaXTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();
    const footerLinks = {
    social: {
        twitter: process.env.NEXT_PUBLIC_X_URL || '/',
        linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '/',
        github: process.env.NEXT_PUBLIC_GITHUB_URL || '/'
    }
    };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Caly</h3>
            <p className="text-gray-400 mb-4">
              Your AI-powered calendar assistant that helps you organize your schedule efficiently.
            </p>
            <div className="flex space-x-4">
              <a href={footerLinks.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaXTwitter className="h-6 w-6" />
              </a>
              <a href={footerLinks.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href={footerLinks.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Caly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;