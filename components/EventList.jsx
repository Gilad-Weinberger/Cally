const EventList = ({ events }) => {
  // Function to determine text color based on background color brightness
  const getContrastColor = (hexColor) => {
    // Default to white if no color is provided
    if (!hexColor) return "#ffffff";

    // Convert hex to RGB
    let hex = hexColor.replace("#", "");

    // Handle shorthand hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness using the perceived brightness formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white for dark colors and black for light colors
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  // Filter and sort upcoming events
  const upcomingEvents = events
    .filter(event => {
      // Create date object from startDate and startTime
      const startDateTime = new Date(`${event.startDate}T${event.startTime || '00:00'}`);
      const now = new Date();
      return startDateTime >= now;
    })
    .sort((a, b) => {
      // Sort by start date and time
      const aDateTime = new Date(`${a.startDate}T${a.startTime || '00:00'}`);
      const bDateTime = new Date(`${b.startDate}T${b.startTime || '00:00'}`);
      return aDateTime - bDateTime;
    })
    .slice(0, 5);  // Show only next 5 events

  console.log(events);
    
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
      {upcomingEvents.length === 0 ? (
        <p className="text-gray-500">No upcoming events scheduled</p>
      ) : (
        <ul className="space-y-4">
          {upcomingEvents.map((event) => (
            <li 
              key={event.id || event.calendarId} 
              className="border-b pb-2 p-2 rounded-md"
              style={{
                backgroundColor: event.color || '#dbeafe',
                color: event.color ? getContrastColor(event.color) : '#1e40af'
              }}
            >
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm" style={{ opacity: 0.9 }}>
                {new Date(`${event.startDate}T${event.startTime || '00:00'}`).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {event.startTime && `, ${event.startTime}`}
                {event.endTime && ` - ${event.endTime}`}
              </p>
              {event.description && (
                <p className="text-sm" style={{ opacity: 0.85 }}>{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
