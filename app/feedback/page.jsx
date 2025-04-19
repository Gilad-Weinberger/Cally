"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { isUserAdmin } from "@/lib/firestore";
import FeedbackItem from "@/components/feedback/FeedbackItem";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Navbar from "@/components/shared/layout/Navbar";

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Cache admin status
  const [sortOption, setSortOption] = useState("votes"); // New state for sorting
  const [showHandled, setShowHandled] = useState(false); // New state for filter
  const { user } = useAuth();
  const router = useRouter();

  // Ref to store unsubscribe function
  const unsubscribeFeedbackRef = useRef(null);

  useEffect(() => {
    if (user) {
      setupFeedbackListener();
      checkAdminStatus();
    } else {
      setLoading(true);
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribeFeedbackRef.current) {
        unsubscribeFeedbackRef.current();
      }
    };
  }, [user]);

  const checkAdminStatus = async () => {
    if (user?.uid) {
      const adminStatus = await isUserAdmin(user.uid);
      setIsAdmin(adminStatus);
    }
  };

  const setupFeedbackListener = () => {
    try {
      setLoading(true);
      setError(null);

      const collectionRef = collection(db, "feedback");
      const feedbackQuery = query(collectionRef, orderBy("createdAt", "desc"));

      // Set up real-time listener for feedback collection
      unsubscribeFeedbackRef.current = onSnapshot(
        feedbackQuery,
        (snapshot) => {
          const feedbackData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            votes: doc.data().votes || 0,
            voters: doc.data().voters || [],
            commentCount: doc.data().commentCount || 0,
            handled: doc.data().handled || false,
            createdAt: doc.data().createdAt || {
              seconds: Date.now() / 1000,
              nanoseconds: 0,
            },
          }));

          // Sort the data based on the selected sort option
          const sortedData = sortFeedbackList(feedbackData, sortOption);
          setFeedbackList(sortedData);
          setLoading(false);
        },
        (err) => {
          console.error("Error listening to feedback:", err);
          if (err.code === "permission-denied") {
            setError(
              "You don't have permission to view feedback. Please sign in."
            );
          } else if (err.code === "resource-exhausted") {
            setError("Too many requests. Please try again later.");
          } else {
            setError("Failed to load feedback. Please try again later.");
          }
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error setting up feedback listener:", err);
      setError("Failed to load feedback. Please try again later.");
      setLoading(false);
    }
  };

  // New sort function
  const sortFeedbackList = (list, option) => {
    const newList = [...list];

    switch (option) {
      case "votes":
        return newList.sort((a, b) => {
          if (b.votes !== a.votes) return b.votes - a.votes;
          return b.createdAt.seconds - a.createdAt.seconds;
        });
      case "newest":
        return newList.sort(
          (a, b) => b.createdAt.seconds - a.createdAt.seconds
        );
    }
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedList = sortFeedbackList([...feedbackList], option);
    setFeedbackList(sortedList);
  };

  const handleCreateFeedback = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/signin");
      return;
    }

    try {
      const newFeedback = {
        title,
        description,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        votes: 0,
        voters: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
        handled: false,
      };

      await addDoc(collection(db, "feedback"), newFeedback);
      setTitle("");
      setDescription("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating feedback:", err);
      setError("Failed to create feedback. Please try again.");
    }
  };

  const handleToggleVote = async (feedback) => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    try {
      const hasVoted = feedback.voters && feedback.voters.includes(user.uid);

      const updatedFeedbackList = feedbackList.map((item) =>
        item.id === feedback.id
          ? {
              ...item,
              votes: hasVoted ? item.votes - 1 : item.votes + 1,
              voters: hasVoted
                ? item.voters.filter((id) => id !== user.uid)
                : [...(item.voters || []), user.uid],
            }
          : item
      );

      const sortedList = sortFeedbackList([...updatedFeedbackList], sortOption);
      setFeedbackList(sortedList);

      const feedbackRef = doc(db, "feedback", feedback.id);

      if (hasVoted) {
        await updateDoc(feedbackRef, {
          votes: increment(-1),
          voters: feedback.voters.filter((id) => id !== user.uid),
        });
      } else {
        await updateDoc(feedbackRef, {
          votes: increment(1),
          voters: [...(feedback.voters || []), user.uid],
        });
      }
    } catch (err) {
      console.error("Error toggling vote:", err);
      setError("Failed to update vote. Please try again.");
    }
  };

  const handleToggleHandled = async (feedback) => {
    try {
      // Check admin status using our new function
      if (!isAdmin) {
        const adminStatus = await isUserAdmin(user?.uid);
        setIsAdmin(adminStatus);
        if (!adminStatus) {
          return;
        }
      }

      const newHandledStatus = !feedback.handled;

      // Optimistic update - update local state immediately
      const updatedFeedbackList = feedbackList.map((item) =>
        item.id === feedback.id
          ? {
              ...item,
              handled: newHandledStatus,
            }
          : item
      );

      const sortedList = sortFeedbackList([...updatedFeedbackList], sortOption);
      setFeedbackList(sortedList);

      // Then update Firestore in the background
      const feedbackRef = doc(db, "feedback", feedback.id);
      await updateDoc(feedbackRef, {
        handled: newHandledStatus,
      });
    } catch (err) {
      console.error("Error updating handled status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start justify-between px-2 sm:px-[5%] pt-8 md:pt-14 pb-8">
            <div className="w-full md:w-1/3 lg:w-2/5 md:sticky top-0 md:top-14 md:self-start md:mr-6 mb-6 md:mb-0">
              <FeedbackForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                onSubmit={handleCreateFeedback}
              />
            </div>
            <div className="flex flex-col gap-5 w-full md:w-2/3 lg:w-3/5 mt-0">
              {/* Sorting and filtering form */}
              <div className="flex items-center w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {isAdmin && (
                      <div className="flex items-center gap-2 mr-5">
                        <label className="text-sm text-gray-600">Show Handled</label>
                        <input
                          type="checkbox"
                          checked={showHandled}
                          onChange={(e) => setShowHandled(e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSortChange("votes")}
                      className={`px-3 py-1.5 rounded-md text-sm flex items-center justify-center ${
                        sortOption === "votes"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1.5"
                      >
                        <path 
                          d="M12.8324 21.8013C15.9583 21.1747 20 18.926 20 13.1112C20 7.8196 16.1267 4.29593 13.3415 2.67685C12.7235 2.31757 12 2.79006 12 3.50492V5.3334C12 6.77526 11.3938 9.40711 9.70932 10.5018C8.84932 11.0607 7.92052 10.2242 7.816 9.20388L7.73017 8.36604C7.6304 7.39203 6.63841 6.80075 5.85996 7.3946C4.46147 8.46144 3 10.3296 3 13.1112C3 20.2223 8.28889 22.0001 10.9333 22.0001C11.0871 22.0001 11.2488 21.9955 11.4171 21.9858C10.1113 21.8742 8 21.064 8 18.4442C8 16.3949 9.49507 15.0085 10.631 14.3346C10.9365 14.1533 11.2941 14.3887 11.2941 14.7439V15.3331C11.2941 15.784 11.4685 16.4889 11.8836 16.9714C12.3534 17.5174 13.0429 16.9454 13.0985 16.2273C13.1161 16.0008 13.3439 15.8564 13.5401 15.9711C14.1814 16.3459 15 17.1465 15 18.4442C15 20.4922 13.871 21.4343 12.8324 21.8013Z" 
                          fill={sortOption === "votes" ? "white" : "#2563eb"}
                        />
                      </svg>
                      Wanted
                    </button>
                    <button
                      onClick={() => handleSortChange("newest")}
                      className={`px-3 py-1.5 rounded-md text-sm flex items-center justify-center ${
                        sortOption === "newest"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-1.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Recent
                    </button>
                  </div>
                </div>
              </div>
              {feedbackList.length > 0 ? (
                <div className="flex flex-col gap-5 w-full">
                  {feedbackList
                    .filter((feedback) => (showHandled ? true : !feedback.handled))
                    .map((feedback) => (
                      <FeedbackItem
                        key={feedback.id}
                        feedback={feedback}
                        user={user}
                        onToggleVote={handleToggleVote}
                        onToggleHandled={handleToggleHandled}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No feedback yet. Be the first to add one!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
