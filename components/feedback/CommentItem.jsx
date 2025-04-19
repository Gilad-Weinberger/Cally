import React from "react";

const CommentItem = ({ comment }) => {
  return (
    <div className="pb-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="mb-2 text-gray-800">{comment.text}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h3 className="text-sm font-medium text-gray-700">
            {comment.userName}
          </h3>
          <span className="text-xs text-gray-500">
            {comment.createdAt
              ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
              : "Just now"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
