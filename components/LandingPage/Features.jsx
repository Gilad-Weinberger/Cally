"use client";

import SecondaryButton from "@/components/shared/ui/ButtonSecondary";
import { useAuth } from "@/context/AuthContext";

const Features = () => {
  const { user } = useAuth();

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Intelligent Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Discover how Caly's AI-powered features can transform your
            scheduling experience
          </p>
        </div>
        <div className="mt-8 sm:mt-12 md:mt-16 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-3 sm:mb-4 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-indigo-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 sm:h-6 w-5 sm:w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
              Smart Scheduling
            </h3>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
              Our AI analyzes your patterns and preferences to suggest optimal
              times for meetings, tasks, and breaks.
            </p>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Intelligent time slot recommendations</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Automatic conflict resolution</span>
              </li>
            </ul>
          </div>
          {/* Feature 2 */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-3 sm:mb-4 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
              Intelligent Task Prioritization
            </h3>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
              Let AI help you prioritize tasks based on deadlines, importance,
              and your productivity patterns.
            </p>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Smart task ordering suggestions</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Deadline-aware scheduling</span>
              </li>
            </ul>
          </div>
          {/* Feature 3 */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-3 sm:mb-4 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-purple-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
              Seamless Integrations
            </h3>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
              Connect with your favorite tools and services for a unified
              productivity experience.
            </p>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Works with popular productivity tools</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Automated data synchronization</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          {!user && (
            <SecondaryButton
              href="#testimonials"
              className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              See What Users Say
            </SecondaryButton>
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;
