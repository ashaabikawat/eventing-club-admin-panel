import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventTourEndPoint } from "../../../../../services/apis";
import axios from "axios";
import { limit, TicketStatus } from "../../../../common/helper/Enum";
import { GrMoreVertical } from "react-icons/gr";
import toast from "react-hot-toast";

const EventTourTable = ({
  eventTourData,
  setEventTourData,
  setOriginalData,
  page,
  setPage,
  totalPages,
  setTotalPages,
  handlePaginationChange,
  setOriginalTotalPages,
  isSearching,
}) => {
  const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [statusToggle, setstatusToggle] = useState(false);
  const [tourOpenModal, setTourOpenModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const handlerEditArtist = (eventTourId) => {
    navigate(`/superAdmin/dashboard/eventtour/${eventTourId}`);
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  useEffect(() => {
    getAllTourData();
  }, [statusToggle, page]);

  const handleAction = (ticketId, action) => {
    setSelectedTourId(ticketId);
    setSelectedAction(action);
    setTourOpenModal(true);
    console.log(action);
  };

  const handleConfirmAction = async () => {
    try {
      const payload = {
        eventTourId: selectedTourId,
      };

      console.log(payload);
      let response;

      if (selectedAction === "disable") {
        response = await axios.post(
          `${eventTourEndPoint.DISABLE_TOUR}`,
          payload
        );
        console.log("disable");
      } else if (selectedAction === "enable") {
        response = await axios.post(
          `${eventTourEndPoint.ENABLE_TOUR}`,
          payload
        );
        console.log("enable");
      }

      console.log(response.data);
      setstatusToggle((prev) => !prev);
      toast.success(response.data.message);
      setTourOpenModal(false);
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
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setTourOpenModal(false);
    setSelectedTourId(null);
    setSelectedAction(null);
    setOpenDropdownId(null);
  };

  const getAllTourData = async () => {
    const payload = {
      page: page,
      limit: String(limit),
    };
    try {
      const FetchTourData = await axios.post(
        `${eventTourEndPoint.GET_ALL_PAGINATION}`,
        payload
      );

      console.log("FetchTourData", FetchTourData.data.EventToursData);
      setEventTourData(FetchTourData.data.data.EventToursData);
      setOriginalData(FetchTourData.data.data.EventToursData);
      setTotalPages(FetchTourData.data.data.totalPages);
      setOriginalTotalPages(FetchTourData.data.data.totalPages);
      setLoading(false);
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
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8 md:mt-[2%]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {eventTourData?.map((eventTour, index) => {
            const isLastTwoRows =
              eventTourData.length > 2 && index >= eventTourData.length - 2;
            return (
              <tr
                key={eventTour._id}
                className={`${
                  eventTour.status === TicketStatus.Enable
                    ? "bg-white hover:bg-gray-50 dark:hover:bg-gray-600 "
                    : "bg-red-200"
                } border-b dark:bg-gray-800 dark:border-gray-700 `}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`${BASE_URl}/${eventTour?.Images[0]?.image_path}`}
                    alt="Jese image"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {eventTour.Name}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4 relative">
                  <p
                    onClick={() => toggleDropdown(eventTour._id)}
                    className="font-medium text-blue-600  dark:text-blue-500 hover:underline cursor-pointer"
                  >
                    <GrMoreVertical size={25} />
                  </p>
                  {openDropdownId == eventTour._id && (
                    <div
                      div
                      className={`absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ${
                        isLastTwoRows ? "bottom-full mb-2" : "top-full mt-2"
                      }`}
                      style={{
                        right: isLastTwoRows ? "88%" : "88%",
                        top: isLastTwoRows ? "auto" : "10%", // 'auto' for last two rows to align above
                        bottom: isLastTwoRows ? "10%" : "auto", // set bottom when one of the last two rows
                      }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handlerEditArtist(eventTour._id)}
                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        {eventTour.status === TicketStatus.Enable ? (
                          <button
                            onClick={() =>
                              handleAction(eventTour._id, "disable")
                            }
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            Inactive
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleAction(eventTour._id, "enable")
                            }
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            Active
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tourOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">
              {selectedAction === "disable"
                ? "Inactive Event tour"
                : "Active Event tour"}
            </h2>
            <p>
              Are you sure you want to{" "}
              {selectedAction === "disable" ? "Inactive" : "Active"} this Event
              tour?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmAction}
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
  );
};

export default EventTourTable;
