import { useState } from "react";

const PromptInput = ({ onEventCreate }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // TODO: Process the prompt and create event data
    const eventData = {
      title: prompt,
      // Add more event properties as needed
    };

    onEventCreate(eventData);
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter event details..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Event
        </button>
      </div>
    </form>
  );
};

export default PromptInput;
