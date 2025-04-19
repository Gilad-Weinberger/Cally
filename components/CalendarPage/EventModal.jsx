import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

export default function EventModal({
  event,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
  isGoogleEvent = false,
}) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(event);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(event.id, formData);
    setEditMode(false);
  };

  const handleClose = () => {
    setEditMode(false);
    onClose();
  };

  const formatDateTime = (date, time) => {
    return `${date}T${time}`;
  };

  const formatDisplayDateTime = (date, time) => {
    const datetime = new Date(formatDateTime(date, time));
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return datetime.toLocaleString(undefined, options);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md p-6 bg-white rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          ✕
        </button>
        {editMode && !isGoogleEvent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter event description"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold">
                Event Color
              </label>
              <div className="flex items-center space-x-4">
                <div
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  style={{ backgroundColor: formData.color || "#3b82f6" }}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      showColorPicker: !formData.showColorPicker,
                    })
                  }
                  aria-label="Toggle color picker"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFormData({
                        ...formData,
                        showColorPicker: !formData.showColorPicker,
                      });
                    }
                  }}
                />
                <input
                  type="text"
                  value={formData.color || "#3b82f6"}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Enter color hex code"
                  aria-label="Color hex code"
                />
              </div>
              {formData.showColorPicker && (
                <div className="mt-2">
                  <HexColorPicker
                    color={formData.color || "#3b82f6"}
                    onChange={(color) =>
                      setFormData({ ...formData, color: color })
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setFormData(event);
                  setEditMode(false);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: event.color || "#3b82f6" }}
              />
              <h2 className="text-2xl font-bold">{event.title}</h2>
              {isGoogleEvent && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Google Calendar
                </span>
              )}
            </div>
            <div className="mb-4 text-gray-600">
              <p>
                Start: {formatDisplayDateTime(event.startDate, event.startTime)}
              </p>
              <p>End: {formatDisplayDateTime(event.endDate, event.endTime)}</p>
              {event.location && (
                <p className="mt-2">
                  <span className="font-medium">Location:</span>{" "}
                  {event.location}
                </p>
              )}
            </div>
            {event.description && <p className="mb-4">{event.description}</p>}

            <div className="flex justify-end space-x-2">
              {!isGoogleEvent && (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(event.id);
                      handleClose();
                    }}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
              {isGoogleEvent && (
                <button
                  onClick={() =>
                    window.open(
                      `https://calendar.google.com/calendar/event?eid=${event.id}`,
                      "_blank"
                    )
                  }
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Open in Google Calendar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
