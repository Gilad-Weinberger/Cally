import React from "react";

const FeedbackForm = ({
  title,
  description,
  setTitle,
  setDescription,
  onSubmit,
}) => {
  return (
    <div className="bg-white border rounded-lg p-6 w-full max-w-sm sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Suggest a feature</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Short, descriptive title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-md w-full hover:bg-blue-700"
          >
            Suggest feature
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
