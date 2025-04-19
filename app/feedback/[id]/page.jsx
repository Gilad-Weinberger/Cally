"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  updateDoc,
  increment,
  serverTimestamp,
  where,
  onSnapshot,
} from "firebase/firestore";
import { isUserAdmin } from "@/lib/firestore";
import FeedbackItem from "@/components/feedback/FeedbackItem";
import CommentForm from "@/components/feedback/CommentForm";
import CommentItem from "@/components/feedback/CommentItem";
import Navbar from "@/components/shared/layout/Navbar";

const FeedbackDetailPage = ({ params }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [feedback, setFeedback] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Cache admin status
  const { user } = useAuth();
  const router = useRouter();

  // Refs for storing unsubscribe functions
  const unsubscribeFeedbackRef = useRef(null);
  const unsubscribeCommentsRef = useRef(null);

  useEffect(() => {
    if (user && id) {
      // Set up real-time listeners for feedback and comments
      setupListeners();
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribeFeedbackRef.current) {
        unsubscribeFeedbackRef.current();
      }
      if (unsubscribeCommentsRef.current) {
        unsubscribeCommentsRef.current();
      }
    };
  }, [id, user]);

  useEffect(() => {
    const checkAccessRights = async () => {
      // If feedback is loaded and is handled
      if (feedback?.handled) {
        // Check if user is admin
        const adminStatus = await isUserAdmin(user?.uid);

        // If not admin, redirect to feedback listing page
        if (!adminStatus) {
          router.push("/feedback");
        }
      }
    };

    if (feedback) {
      checkAccessRights();
    }
  }, [feedback, user, router]);

  const setupListeners = async () => {
    try {
      setLoading(true);
      setError(null);

      // Set up real-time listener for the feedback item
      const feedbackRef = doc(db, "feedback", id);

      // Initial check if feedback exists
      const feedbackSnap = await getDoc(feedbackRef);

      if (!feedbackSnap.exists()) {
        setError("Feedback not found");
        setLoading(false);
        return;
      }

      // Set up real-time listener for feedback document
      unsubscribeFeedbackRef.current = onSnapshot(
        feedbackRef,
        (doc) => {
          if (doc.exists()) {
            const feedbackData = doc.data();
            setFeedback({
              id: doc.id,
              ...feedbackData,
              // Ensure properties exist
              title: feedbackData.title || "Untitled Feedback",
              description: feedbackData.description || "",
              votes: feedbackData.votes || 0,
              voters: feedbackData.voters || [],
              commentCount: feedbackData.commentCount || 0,
              userName: feedbackData.userName || "Anonymous",
              handled: feedbackData.handled || false,
              createdAt: feedbackData.createdAt || {
                seconds: Date.now() / 1000,
                nanoseconds: 0,
              },
            });
            setLoading(false);
          } else {
            setError("Feedback not found");
            setLoading(false);
          }
        },
        (err) => {
          console.error("Error listening to feedback:", err);
          setError("Failed to load feedback details. Please try again later.");
          setLoading(false);
        }
      );

      // Set up real-time listener for comments
      try {
        const commentsQuery = query(
          collection(db, "feedbackComments"),
          where("feedbackId", "==", id)
        );

        unsubscribeCommentsRef.current = onSnapshot(
          commentsQuery,
          (snapshot) => {
            let commentsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              // Ensure properties exist
              text: doc.data().text || "",
              userName: doc.data().userName || "Anonymous",
              createdAt: doc.data().createdAt || {
                seconds: Date.now() / 1000,
                nanoseconds: 0,
              },
            }));

            // Sort comments by createdAt timestamp (newest first)
            commentsData = commentsData.sort(
              (a, b) => b.createdAt.seconds - a.createdAt.seconds
            );

            setComments(commentsData);
          },
          (err) => {
            console.error("Error listening to comments:", err);
            // Don't fail the whole page if comments listener fails
            setComments([]);
          }
        );
      } catch (commentErr) {
        console.error("Error setting up comments listener:", commentErr);
        setComments([]);
      }
    } catch (err) {
      console.error("Error setting up listeners:", err);
      if (err.code === "permission-denied") {
        setError("You don't have permission to view this feedback.");
      } else if (err.code === "not-found") {
        setError("Feedback not found");
      } else {
        setError("Failed to load feedback details. Please try again later.");
      }
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/signin");
      return;
    }

    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);

      // Add comment to Firestore
      const newComment = {
        feedbackId: id,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        text: commentText,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "feedbackComments"), newComment);

      // Update comment count on the feedback document
      const feedbackRef = doc(db, "feedback", id);
      await updateDoc(feedbackRef, {
        commentCount: increment(1),
      });

      // Update local state
      if (feedback) {
        setFeedback({
          ...feedback,
          commentCount: (feedback.commentCount || 0) + 1,
        });
      }

      // Clear input and refresh comments
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleToggleVote = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    try {
      const hasVoted = feedback.voters && feedback.voters.includes(user.uid);

      // Optimistic update - update local state immediately
      setFeedback({
        ...feedback,
        votes: hasVoted ? feedback.votes - 1 : feedback.votes + 1,
        voters: hasVoted
          ? feedback.voters.filter((id) => id !== user.uid)
          : [...(feedback.voters || []), user.uid],
      });

      // Then update Firestore in the background
      const feedbackRef = doc(db, "feedback", feedback.id);

      if (hasVoted) {
        // Remove the vote
        await updateDoc(feedbackRef, {
          votes: increment(-1),
          voters: feedback.voters.filter((id) => id !== user.uid),
        });
      } else {
        // Add the vote
        await updateDoc(feedbackRef, {
          votes: increment(1),
          voters: [...(feedback.voters || []), user.uid],
        });
      }
    } catch (err) {
      console.error("Error toggling vote:", err);

      // Revert to original data if Firestore update fails
      setError("Failed to update vote. Please try again.");
    }
  };

  const handleToggleHandled = async () => {
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
      setFeedback({
        ...feedback,
        handled: newHandledStatus,
      });

      // Then update Firestore in the background
      const feedbackRef = doc(db, "feedback", id);
      await updateDoc(feedbackRef, {
        handled: newHandledStatus,
      });
    } catch (err) {
      console.error("Error updating handled status:", err);
      setError("Failed to update status. Please try again.");

      // Revert to original data if Firestore update fails
      setFeedback({
        ...feedback,
        handled: !feedback.handled,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/feedback" className="text-blue-600 hover:text-blue-800">
          ← Back to Feedback
        </Link>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Feedback not found</p>
        </div>
        <Link href="/feedback" className="text-blue-600 hover:text-blue-800">
          ← Back to Feedback
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/feedback"
          className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Feedback
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Feedback section - left side */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <FeedbackItem
                feedback={feedback}
                user={user}
                onToggleVote={handleToggleVote}
                onToggleHandled={handleToggleHandled}
                inOwnPage={true}
              />
            </div>
          </div>
          {/* Comments section - right side */}
          <div className="lg:col-span-7 mt-4 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm px-4 sm:px-6 pb-6">
              <CommentForm
                user={user}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
                commentLoading={commentLoading}
              />
              {comments.length > 0 ? (
                <div className="space-y-5">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackDetailPage;
