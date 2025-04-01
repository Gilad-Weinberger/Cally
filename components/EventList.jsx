const EventList = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No events scheduled</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border-b pb-2">
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.date}</p>
              {event.description && (
                <p className="text-sm text-gray-500">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
