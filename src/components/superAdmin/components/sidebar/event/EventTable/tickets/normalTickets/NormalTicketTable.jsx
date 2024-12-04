import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate2 } from "../../../../../../../common/formatDate2";
import { GrMoreVertical } from "react-icons/gr";
import { normalEventTickets } from "../../../../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  TicketAvailability,
  ticketEnabledDisabledStatus,
  TicketStatus,
  TicketType,
} from "../../../../../../../common/helper/Enum";
import { transformEventDateTime } from "../../../../../../../common/transformEventDateTime";

const NormalTicketTable = ({ eventTicketsData: initialEventTicketsData }) => {
  // console.log({ initialEventTicketsData });

  const { _id } = useParams();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Enable disabled modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Toggle Modal for available and sold out modal
  const [statusModalForTickets, setStatusModalForTickets] = useState(false);
  const [selectedActionForAvailable, setSelectedActionForAvailable] =
    useState(null);
  const [
    selectedTicketIDForTicketAvailable,
    setSelectedTicketIDForTicketAvailable,
  ] = useState(null);

  const [eventTicketsData, setEventTicketsData] = useState(
    initialEventTicketsData
  );

  const navigate = useNavigate();

  const getTicketTypeName = (value) => {
    for (const [key, val] of Object.entries(TicketType)) {
      if (val === value) {
        return key;
      }
    }
    return "Unknown"; // Return a default value if not found
  };

  useEffect(() => {
    // Copy the props data to the local state
    if (initialEventTicketsData) {
      const transformedData = initialEventTicketsData?.map((eventTicket) => ({
        ...eventTicket,
        // MultiplePassDates: transformEventDateTime(
        //   eventTicket.MultiplePassDates
        // ),
      }));
      setEventTicketsData(transformedData);
    }
  }, [initialEventTicketsData]);

  // console.log({ eventTicketsData });

  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const handleViewEdit = (eventId, ticketId) => {
    navigate(
      `/superAdmin/dashboard/event/edit-booking/edit-ticket/${eventId}/${ticketId}`
    );
  };

  const handleAction = (ticketId, action) => {
    console.log({ action });
    setSelectedTicketId(ticketId);
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      const payload = {
        eventTicket_id: selectedTicketId,
      };

      let response;
      if (selectedAction === "disable") {
        response = await axios.post(
          `${normalEventTickets.DISABLE_ENABLE_EVENT_TICKET_BY_TICKET_ID}`,
          payload
        );
      } else if (selectedAction === "enable") {
        response = await axios.post(
          `${normalEventTickets.ENABLE_EVENT_TICKET_BY_TICKET_ID}`,
          payload
        );
      }

      console.log(response.data);
      toast.success(response.data.message);
      setIsModalOpen(false);
      setOpenDropdownId(null);
      // Update the eventTicketsData state
      setEventTicketsData((prevData) =>
        prevData.map((ticket) =>
          ticket._id === selectedTicketId
            ? {
                ...ticket,
                EventTicketStatus: selectedAction === "disable" ? 2 : 1,
              }
            : ticket
        )
      );
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicketId(null);
    setSelectedAction(null);
    setOpenDropdownId(null);
  };

  const handleToggleChange = (ticketId, currentAvailability, currentStatus) => {
    if (currentStatus === TicketStatus.Disable) {
      toast.error(
        "You can't mark as available or sold out if the ticket is disabled."
      );
      return;
    }

    setSelectedTicketIDForTicketAvailable(ticketId);
    setSelectedActionForAvailable(
      currentAvailability === TicketAvailability.Available
        ? TicketAvailability.SoldOut
        : TicketAvailability.Available
    );
    setStatusModalForTickets(true);
  };

  const handleCloseTicketStatusModal = () => {
    setStatusModalForTickets(false);
    setSelectedTicketIDForTicketAvailable(null);
    setSelectedActionForAvailable(null);
  };

  const handleConfirmActionForStatus = async () => {
    try {
      const payload = {
        eventTicket_id: selectedTicketIDForTicketAvailable,
      };

      let response;
      if (selectedActionForAvailable === TicketAvailability.SoldOut) {
        response = await axios.post(
          `${normalEventTickets.AVAILABLE_TICKET_TO_SOLD_OUT_EVENT_TICKET}`,
          payload
        );
      } else if (selectedActionForAvailable === TicketAvailability.Available) {
        response = await axios.post(
          `${normalEventTickets.SOLD_OUT_EVENT_TICKET_TO_AVAILABLE_TICKET}`,
          payload
        );
      }

      // console.log(response.data);
      toast.success(response.data.message);
      setStatusModalForTickets(false);
      setOpenDropdownId(null);
      // Update the eventTicketsData state
      setEventTicketsData((prevData) =>
        prevData.map((ticket) =>
          ticket._id === selectedTicketIDForTicketAvailable
            ? {
                ...ticket,
                EventTicketAvailability: selectedActionForAvailable,
              }
            : ticket
        )
      );
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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {/* <th scope="col" className="p-4"></th> */}
              <th scope="col" className="px-6 py-3">
                Ticket Name
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Ticket Price
              </th>
              <th scope="col" className="px-6 py-3">
                Ticket Type
              </th>
              <th scope="col" className="px-6 py-3">
                Ticket Date
              </th>
              <th scope="col" className="px-6 py-3">
                Pending Quantity
              </th>
              <th scope="col" className="px-12 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {eventTicketsData.map((ticketData, index) => {
              const isLastTwoRows =
                eventTicketsData.length > 2 &&
                index >= eventTicketsData.length - 2;
              return (
                <tr
                  key={ticketData._id}
                  className={` border-b dark:bg-gray-800 dark:border-gray-700 ${
                    ticketData.EventTicketStatus !=
                    ticketEnabledDisabledStatus.Enable
                      ? "bg-red-200"
                      : ""
                  }`}
                >
                  {/* <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${index + 1}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-${index + 1}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td> */}
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {ticketData?.Name}
                  </th>
                  <td className="pl-4 py-4">{ticketData?.Quantity}</td>
                  <td className="pl-4 py-4">{ticketData?.Price}</td>
                  <td className="pl-1 py-4">
                    {getTicketTypeName(ticketData.TicketType)}
                  </td>
                  <td className="w-20 py-4 md:pl-0 pl-6">
                    {ticketData?.TicketDate
                      ? new Date(ticketData.TicketDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "UTC",
                          }
                        )
                      : "N/A"}
                  </td>

                  <td className="pl-10 py-4">{ticketData.PendingQuantity}</td>

                  <td className="py-4">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={
                            ticketData.EventTicketAvailability ===
                            TicketAvailability.Available
                          }
                          onChange={() =>
                            handleToggleChange(
                              ticketData._id,
                              ticketData.EventTicketAvailability,
                              ticketData.EventTicketStatus
                            )
                          }
                        />
                        <div
                          className={`toggle-switch w-10 h-6 bg-gray-300 rounded-full p-1 ${
                            ticketData.EventTicketAvailability ===
                            TicketAvailability.Available
                              ? "bg-green-700"
                              : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`toggle-thumb w-4 h-4 bg-white rounded-full shadow-md transform ${
                              ticketData.EventTicketAvailability !==
                              TicketAvailability.Available
                                ? "translate-x-full"
                                : ""
                            }`}
                          ></div>
                        </div>
                      </div>
                      <p className="pl-2">
                        {ticketData.EventTicketAvailability ===
                        TicketAvailability.Available
                          ? "Available"
                          : "Sold Out"}
                      </p>
                    </label>
                  </td>

                  <td className="w-20 py-4">
                    {formatDate2(ticketData?.createdAt)}
                  </td>
                  <td className="px-6 py-4 relative">
                    <p
                      onClick={() => toggleDropdown(ticketData._id)}
                      className="font-medium text-blue-600  dark:text-blue-500 hover:underline cursor-pointer"
                    >
                      <GrMoreVertical size={25} />
                    </p>
                    {openDropdownId === ticketData._id && (
                      <div
                        className={`absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ${
                          isLastTwoRows ? "bottom-full mb-2" : "top-full mt-2"
                        }`}
                        style={{
                          right: isLastTwoRows ? "70%" : "78%",
                          top: isLastTwoRows ? "auto" : "10%", // 'auto' for last two rows to align above
                          bottom: isLastTwoRows ? "10%" : "auto", // set bottom when one of the last two rows
                        }}
                      >
                        {/* className="absolute w-48 right-[78%] top-[10%] bg-white border border-gray-300 rounded-md shadow-lg" */}

                        <div className="py-1">
                          <button
                            onClick={() => handleViewEdit(_id, ticketData._id)}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            View & Edit
                          </button>
                          {ticketData.EventTicketStatus !=
                          ticketEnabledDisabledStatus.Enable ? (
                            <button
                              onClick={() =>
                                handleAction(ticketData._id, "enable")
                              }
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                            >
                              Enable
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleAction(ticketData._id, "disable")
                              }
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                            >
                              Disable
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
      </div>

      {/* Enable and Disable Ticket  */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">
              {selectedAction === "disable"
                ? "Disable Ticket"
                : "Enable Ticket"}
            </h2>
            <p>
              Are you sure you want to{" "}
              {selectedAction === "disable" ? "disable" : "enable"} this ticket?
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

      {/* Sold out Available Ticket  */}
      {statusModalForTickets && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">
              {selectedActionForAvailable === TicketAvailability.Available
                ? "Mark as Available"
                : "Mark as Sold Out"}
            </h2>
            <p>
              Are you sure you want to{" "}
              {selectedActionForAvailable === TicketAvailability.Available
                ? "mark as available"
                : "mark as sold out"}{" "}
              this ticket?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmActionForStatus}
                className="px-4 py-2 bg-red-600 text-white rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={handleCloseTicketStatusModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NormalTicketTable;
