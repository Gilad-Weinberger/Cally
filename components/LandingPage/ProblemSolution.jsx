"use client";

import PrimaryButton from "@/components/shared/ui/ButtonPrimary";
import { useAuth } from "@/context/AuthContext";

const ProblemSolution = () => {
  const { user } = useAuth();

  return (
    <section
      className="bg-to-blue-50 py-12 sm:py-16 md:py-24"
      id="problem-solution"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Traditional Calendars vs. AI-Powered Scheduling
          </h2>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-red-50 p-4 sm:p-6">
            <div className="mb-4 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 sm:h-6 w-5 sm:w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
              The Problem
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Manual scheduling is time-consuming and error-prone</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Difficulty prioritizing tasks and managing time effectively
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  No intelligent suggestions or optimization of your schedule
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-green-50 p-4 sm:p-6">
            <div className="mb-4 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 sm:h-6 w-5 sm:w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
              The Solution
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>AI-powered scheduling that learns your preferences</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Intelligent task prioritization and time blocking</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Smart suggestions that optimize your productivity</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          {!user && (
            <PrimaryButton href="/auth/signup">
              Start Optimizing Your Schedule
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
