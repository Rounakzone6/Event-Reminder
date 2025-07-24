import { faEdit, faPhone, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({ name, phone, date, event, relation, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="border flex flex-col cursor-pointer md:w-[24vw] w-full border-gray-300 py-4 px-2 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-stone-800">{name}</h3>
        <p className="font-medium">
          <FontAwesomeIcon className="text-sm pr-1" icon={faPhone} />
          {phone}
        </p>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-stone-600">🎉 {event}</p>
          <p className="text-sm text-stone-500">📅 {formatDate(date)}</p>
          <p className="text-sm text-stone-400">🤝 {relation}</p>
        </div>
        <div className="text-white flex justify-center items-center gap-2 ">
          <FontAwesomeIcon
            className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
            icon={faTrash}
            onClick={onDelete}
          />
          <FontAwesomeIcon
            className="p-2 bg-green-500 rounded-lg hover:bg-green-600"
            icon={faEdit}
            onClick={onEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
