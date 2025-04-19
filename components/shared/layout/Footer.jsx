"use client";

import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    social: {
      twitter: process.env.NEXT_PUBLIC_X_URL || "/",
      linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "/",
      github: process.env.NEXT_PUBLIC_GITHUB_URL || "/",
    },
  };

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Cally
            </h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              Your AI-powered calendar assistant that helps you organize your
              schedule efficiently.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a
                href={footerLinks.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaXTwitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href={footerLinks.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href={footerLinks.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {currentYear} Cally. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
