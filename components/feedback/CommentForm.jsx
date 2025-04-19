import React from "react";
import Link from "next/link";

const CommentForm = ({
  user,
  commentText,
  setCommentText,
  handleAddComment,
  commentLoading,
}) => {
  if (!user) {
    return (
      <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-8">
        <p>
          Please{" "}
          <Link href="/auth/signin" className="underline font-medium">
            sign in
          </Link>{" "}
          to add a comment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleAddComment} className="mb-8">
      <div className="flex items-center space-x-2">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add your comment..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="1"
          required
        ></textarea>
        <button
          type="submit"
          disabled={commentLoading || !commentText.trim()}
          className={`px-4 py-2 rounded-md whitespace-nowrap ${
            commentLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {commentLoading ? "Adding..." : "Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
