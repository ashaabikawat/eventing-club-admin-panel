import React from "react";
import { useNavigate } from "react-router-dom";

const CustomToast = ({ setIsModalOpen, message, url, heading }) => {
  const navigate = useNavigate();
  const handleToggle = () => {
    setIsModalOpen(false);
    if (url) {
      return navigate(url);
    } else {
      return;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        aria-hidden="true"
      ></div>

      <div
        id="static-modal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex justify-center items-center"
      >
        <div className="relative p-4 w-full max-w-2xl">
          <div className="relative bg-white rounded-lg shadow  text-center">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900 ">
                {heading ? heading : null}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
              >
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <pre className="text-center">{message}</pre>
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={handleToggle}
                type="submit"
                data-modal-hide="static-modal"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomToast;
