import { useContext } from "react";
import { Context } from "../context/Context";
import Card from "../components/Card";

const Events = () => {
  const { events, handleDelete, handleEdit } = useContext(Context);

  return (
    <div className="flex md:max-w-[80%] bg-gray-100 rounded-2xl px-5 py-6 mx-auto mt-6 flex-wrap gap-4">
      {events.length > 0 ? (
        events.map((event, index) => (
          <Card
            key={event._id || index}
            name={event.name}
            phone={event.phone}
            event={event.event}
            date={event.date}
            relation={event.relation}
            onEdit={() => handleEdit(event)}
            onDelete={() => handleDelete(event._id)}
          />
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default Events;
