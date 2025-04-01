const CalendarOverview = ({ calendars }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Calendars</h2>
      {calendars.length === 0 ? (
        <p className="text-gray-500">No calendars found</p>
      ) : (
        <ul className="space-y-2">
          {calendars.map((calendar) => (
            <li
              key={calendar.id}
              className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium">{calendar.name}</h3>
              {calendar.description && (
                <p className="text-sm text-gray-600">{calendar.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarOverview;
