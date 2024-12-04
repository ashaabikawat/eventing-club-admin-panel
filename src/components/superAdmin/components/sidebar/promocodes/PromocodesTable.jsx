import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GrMoreVertical } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { PromocodeStatus } from "../../../../common/helper/Enum";
import axios from "axios";
import { promocode } from "../../../../../services/apis";

const PromocodesTable = ({ promocodes }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // Enable disabled modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(1);
  const [selectedPromocodeId, setSelectedPromocodeId] = useState(null);

  const navigate = useNavigate();

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return "Inactive";

      case 1:
        return "Active";

      case 2:
        return "Expired";

      default:
        break;
    }
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const handleViewEdit = (promoId) => {
    // console.log(promoId);
    navigate(`/superAdmin/dashboard/promocodes/edit-promocode/${promoId}`);
  };

  const handleAction = (id, action) => {
    // console.log(id, action);
    setSelectedPromocodeId(id);
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromocodeId(null);
    setSelectedAction(null);
    setOpenDropdownId(null);
  };

  const handleConfirmAction = () => {
    // console.log(selectedAction);
    // console.log(selectedPromocodeId);

    switch (selectedAction) {
      case "active":
        handleEnable(selectedPromocodeId);
        break;

      case "inactive":
        handleDisable(selectedPromocodeId);
        break;
    }
  };

  const handleEnable = async (id) => {
    const payload = {
      Promocode_id: id,
    };
    try {
      const response = await axios.post(
        `${promocode.ENABLE_PROMOCODE}`,
        payload
      );
      toast.success(response.data.message);
      setIsModalOpen(false);

      setOpenDropdownId(null);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (
          status === 404 ||
          status === 403 ||
          status === 500 ||
          status === 302 ||
          status === 409 ||
          status === 401 ||
          status === 400
        ) {
          console.log(error.response);
          toast.error(data.message);
        }
      }
    }
  };

  const handleDisable = async (id) => {
    const payload = {
      Promocode_id: id,
    };
    try {
      const response = await axios.post(
        `${promocode.DISABLE_PROMOCODE}`,
        payload
      );
      toast.success(response.data.message);
      setIsModalOpen(false);

      setOpenDropdownId(null);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (
          status === 404 ||
          status === 403 ||
          status === 500 ||
          status === 302 ||
          status === 409 ||
          status === 401 ||
          status === 400
        ) {
          console.log(error.response);
          toast.error(data.message);
        }
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 md:mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                Code Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date created
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {promocodes.map((promocode, index) => {
              const isLastTwoRows = index >= promocodes.length - 2;
              return (
                <tr
                  key={promocode._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {promocode.PromoCodeName}
                  </th>

                  <td className="px-6 py-4">
                    {promocode.createdAt.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4">{getStatus(promocode.status)}</td>

                  <td className="px-6 py-4 relative">
                    <p
                      onClick={() => toggleDropdown(promocode._id)}
                      className="font-medium text-blue-600  dark:text-blue-500 hover:underline cursor-pointer"
                    >
                      <GrMoreVertical size={25} />
                    </p>
                    {openDropdownId === promocode._id && (
                      <div
                        className={`absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ${
                          isLastTwoRows ? "bottom-full mb-2" : "top-full mt-2"
                        }`}
                        style={{
                          right: isLastTwoRows ? "90%" : "78%",
                          top: isLastTwoRows ? "auto" : "10%", // 'auto' for last two rows to align above
                          bottom: isLastTwoRows ? "10%" : "auto", // set bottom when one of the last two rows
                        }}
                      >
                        <div className="py-1 ">
                          <button
                            onClick={() => handleViewEdit(promocode._id)}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            View & Edit
                          </button>
                          {promocode.status !== 2 &&
                            (promocode.status !== PromocodeStatus.Active ? (
                              <button
                                onClick={() =>
                                  handleAction(promocode._id, "active")
                                }
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Active
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAction(promocode._id, "inactive")
                                }
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Inactive
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Enable and Disable promocode  */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">
                {selectedAction === "inactive"
                  ? "inactive promocode"
                  : "active promocode"}
              </h2>
              <p>
                Are you sure you want to{" "}
                {selectedAction === "inactive" ? "inactive" : "active"} this
                promocode?
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleConfirmAction(selectedAction)}
                  className="px-4 py-2 bg-red-600 text-white rounded mr-2"
                >
                  Yes
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PromocodesTable;
