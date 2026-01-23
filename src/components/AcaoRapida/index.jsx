import { HiOutlineUserAdd } from "react-icons/hi";
import { IoLockClosed } from "react-icons/io5";

export function AcaoRapida(props) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      className={`
           flex flex-col items-center justify-center text-center
           rounded-xl font-semibold text-xs sm:text-sm md:text-base min-h-25 sm:min-h-24 md:min-h-28 px-2 sm:px-3 md:px-4 w-full sm:w-36 md:w-40 lg:w-36
           shadow-md border border-primary-200 bg-gradient-to-br
           transform scale-100 transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
           active:scale-95 touch-manipulation
           ${
             props.disabled
               ? "from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed opacity-60 border-gray-300"
               : "from-primary-800 to-primary-500 text-white hover:from-primary-700 hover:to-primary-400 hover:shadow-lg hover:scale-105 cursor-pointer active:from-primary-900"
           }
         `}
      onClick={props.onClick}
      title={props.disabled ? "Treinadores não podem realizar esta ação" : ""}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        {props.disabled ? (
          <IoLockClosed className="text-lg sm:text-xl md:text-2xl mb-1" />
        ) : props.icon ? (
          <span className="text-lg sm:text-xl md:text-2xl mb-1">
            {props.icon}
          </span>
        ) : (
          <HiOutlineUserAdd className="text-lg sm:text-xl md:text-2xl mb-1" />
        )}
        <span className="text-[9px] sm:text-[11px] md:text-xs text-center line-clamp-2">
          {props.subTitle}
        </span>
      </div>
    </button>
  );
}
