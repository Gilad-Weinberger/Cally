import { useState } from "react";
import ChatMessage from "./ChatMessage";
import { useAuth } from "@/context/AuthContext";

export default function TextPromptInput({
  onAddEvent,
  calendarId,
  onLoadingChange,
}) {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [partialEventData, setPartialEventData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to chat
    setChatHistory((prev) => [
      ...prev,
      { message: prompt, isError: false, isUser: true },
    ]);

    setIsLoading(true);
    // Notify parent component about loading state change
    if (onLoadingChange) onLoadingChange(true);
    try {
      const response = await fetch("/api/analyze-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          partialEventData, // Send existing partial data to maintain context
          calendarId, // Include calendarId in the request
          userId: user?.uid, // Send the user ID for color code lookup
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze event");
      }

      setPrompt("");

      let eventData = await response.json();

      // Process event data and check for missing fields
      const processedEventData = {
        ...partialEventData, // Merge with existing partial data
        ...Object.fromEntries(
          Object.entries(eventData).map(([key, value]) => [
            key,
            value === null ? "" : value,
          ])
        ),
      };

      const requiredFields = [
        "title",
        "startDate",
        "endDate",
        "startTime",
        "endTime",
      ];
      const missingFields = requiredFields.filter(
        (field) => !processedEventData[field]
      );

      if (missingFields.length > 0) {
        // Store partial data
        setPartialEventData(processedEventData);

        // Ask for missing information
        const aiMessage = `Could you please provide the ${missingFields.join(
          ", "
        )} for this event?`;
        setChatHistory((prev) => [
          ...prev,
          { message: aiMessage, isError: false, isUser: false },
        ]);
        return;
      }

      // Format event data
      const formatEventData = (data) => {
        return {
          ...data,
          calendarId,
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          endDate: new Date(data.endDate).toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
        };
      };

      // All data is complete, create the event
      onAddEvent(formatEventData(processedEventData));

      // Add success message without resetting chat history
      setChatHistory((prev) => [
        ...prev,
        { message: "Event added successfully!", isError: false, isUser: false },
      ]);
      setPartialEventData(null);
    } catch (error) {
      console.error("Error analyzing event:", error);
      setChatHistory((prev) => [
        ...prev,
        { message: error.message, isError: true, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
      // Notify parent component about loading state change
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setPartialEventData(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-100px)]">
        <div className="flex justify-center mb-3 w-full">
          <button
            onClick={handleClearChat}
            className="w-9/10 px-3 py-1.5 text-sm cursor-pointer text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            Clear Chat
          </button>
        </div>
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} {...chat} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-300 sticky bottom-0 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Add a new event..."
              className="w-full px-4 py-3 pr-24 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`absolute right-3 px-3 py-1.5 text-sm text-white rounded-md transition-colors duration-200 
                ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
