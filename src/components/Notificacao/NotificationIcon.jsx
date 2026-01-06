import { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function NotificationIcon({ count }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative cursor-pointer ml-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      <IoIosNotificationsOutline size={24} className="text-primary-50" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{count}</span>
      )}
      {isHovered && count > 0 && (
        <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-2 w-48 z-10">
          Você tem {count} nova{count > 1 ? 's' : ''} notificaçã{count > 1 ? 'ões' : 'ão'}.
        </div>
      )}
    </div>
  );
}