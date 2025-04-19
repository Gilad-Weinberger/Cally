import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isUserAdmin } from "@/lib/firestore";

const FeedbackItem = ({
  feedback,
  user,
  onToggleVote,
  onToggleHandled,
  inOwnPage = false,
}) => {
  const router = useRouter();
  const hasVoted = feedback.voters && feedback.voters.includes(user?.uid);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.uid) {
        const adminStatus = await isUserAdmin(user.uid);
        setIsAdmin(adminStatus);
      }
    };

    checkAdminStatus();
  }, [user]);

  // If the feedback is handled and the user is not an admin, don't render the component
  if (feedback.handled && !isAdmin) {
    return null;
  }

  if (!inOwnPage) {
    return (
      <div className="border rounded-lg px-6 py-6 bg-white shadow-sm w-full">
        <div className="flex items-start gap-10">
          <div className="flex-1">
            <Link href={`/feedback/${feedback.id}`} className="block">
              <h2 className="text-xl font-medium text-black mb-1">
                {feedback.title}
              </h2>
              <p className="text-gray-700 mb-2">{feedback.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="ml-1">
                  {feedback.commentCount || 0} Comments •{" "}
                </span>
                <span className="ml-1">
                  {feedback.createdAt
                    ? new Date(
                        feedback.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "Just now"}
                </span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            {isAdmin && (
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  feedback.handled ? "bg-blue-600" : "bg-gray-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHandled(feedback);
                }}
                title={
                  feedback.handled ? "Mark as unhandled" : "Mark as handled"
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    feedback.handled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            )}
            <button
              className={`flex flex-col items-center py-1 px-2 cursor-pointer rounded-2xl ${
                hasVoted
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => onToggleVote(feedback)}
            >
              <div className="p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              <span className="pb-1 leading-2">{feedback.votes}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg px-4 py-6 bg-white shadow-sm">
      <div className="flex items-start gap-0.5">
        <button
          className={`flex flex-col items-center mr-4 py-1 px-2 cursor-pointer rounded-2xl ${
            hasVoted
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          onClick={() => onToggleVote(feedback)}
        >
          <div className="p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
          <span className="pb-1 leading-2">{feedback.votes}</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-medium text-black">
              {feedback.title}
            </h2>
            {isAdmin && (
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  feedback.handled ? "bg-blue-600" : "bg-gray-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHandled(feedback);
                }}
                title={
                  feedback.handled ? "Mark as unhandled" : "Mark as handled"
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    feedback.handled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            )}
          </div>
          <p className="text-gray-700 mb-2">{feedback.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>By {feedback.userName} • </span>
            <span className="ml-1">
              {feedback.commentCount || 0} Comments •{" "}
            </span>
            <span className="ml-1">
              {feedback.createdAt
                ? new Date(
                    feedback.createdAt.seconds * 1000
                  ).toLocaleDateString()
                : "Just now"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackItem;
