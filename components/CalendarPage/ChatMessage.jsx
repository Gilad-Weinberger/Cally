import { FaUser, FaRobot } from "react-icons/fa";

export default function ChatMessage({ message, isError, isUser }) {
  return (
    <div
      className={`flex items-start gap-2 ${
        isUser ? "justify-start" : "justify-end"
      }`}
    >
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <FaUser className="text-blue-500" />
        </div>
      )}
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isUser ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
        } ${isError ? "bg-red-100 text-red-900" : ""}`}
      >
        {message}
      </div>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <FaRobot className="text-gray-500" />
        </div>
      )}
    </div>
  );
}
