import { HiOutlineUserAdd } from "react-icons/hi";

export function AcaoRapida(props) {
  return (
    <>
      <button
        type="button"
        className=" 
        flex flex-row items-center justify-center p-4
        sm:p-5 bg-primary-900 rounded-lg hover:bg-primary-400
       text-primary-50 font-semibold transform scale-100 hover:scale-102
       transition-all duration-200 cursor-pointer
  "
      >
        <HiOutlineUserAdd className="text-4xl text-primary-50 mr-2" />
        {props.subTitle}
      </button>
    </>
  );
}
