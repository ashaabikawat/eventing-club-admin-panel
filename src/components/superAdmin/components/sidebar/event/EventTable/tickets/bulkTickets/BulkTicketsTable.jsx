import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventbulktickets } from "../../../../../../../../services/apis";
import { GrMoreVertical } from "react-icons/gr";
import {
  formatDate2,
  formatDate3,
} from "../../../../../../../common/formatDate2";
import toast, { Toaster } from "react-hot-toast";
import { BulkCancelStatus } from "../../../../../../../common/helper/Enum";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { CiFilter } from "react-icons/ci";
import formatAmount from "../../../../../../../common/formatAmount";

const BulkTicketsTable = () => {
  const { _id } = useParams();

  const [bulkTicketTableData, setBulkTicketTableData] = useState([]);
  console.log("bulktickets", bulkTicketTableData);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [bulkNameFilter, setBulkNameFilter] = useState([]);
  const [storeFilterDates, setStoreFilterDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [nameDropDownVisible, setNameDropDownVisible] = useState(false);
  const [selectedNameIndex, setSelectedNameIndex] = useState(null);

  const [originalData, setOriginalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [bulkCancelID, setBulkCancelID] = useState(null);
  const [bulkCancelModal, setBulkCancelModal] = useState(false);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCheckin, setTotalCheckin] = useState(0);

  // Filtered By Name and Date
  const [filters, setFilters] = useState({ eventDateTime: "", TicketName: "" });

  useEffect(() => {
    getAllNormalTicketData();
  }, []);

  const getAllNormalTicketData = async () => {
    const payload = {
      event_id: _id,
    };

    try {
      let response = await axios.post(
        `${eventbulktickets.GET_ALL_EVENT_BULK_TICKETS}`,
        payload
      );

      // console.log("response check ===>", response.data.data);
      setBulkTicketTableData(response.data.data.EventBulkTicketsData);
      setOriginalData(response.data.data.EventBulkTicketsData);
      setBulkNameFilter(response.data.data.TicketNamesArray);
      setStoreFilterDates(response.data.data.EventDatesTime);
      setTotalQuantity(response.data.data.totalQuantity);
      setTotalCheckin(response.data.data.totalCheckInCount);
      setTotalPrice(response.data.data.totalPrice);
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

  // Serarch Api integration

  // const handleChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 400);

  //   return () => clearTimeout(delay);
  // }, [searchTerm]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (debouncedSearchTerm.length < 2) {
  //         toast.error("Search keyword must be at least 2 characters long.");
  //         return;
  //       }

  //       const payload = {
  //         event_id: _id,
  //         search_keyword: debouncedSearchTerm,
  //       };

  //       let response = await axios.post(
  //         `${`${eventbulktickets.SEARCH_BULK_EVENT_TICKETS}`}`,
  //         payload
  //       );

  //       // console.log(response.data);
  //       setBulkTicketTableData(response.data.data);
  //     } catch (error) {
  //       if (error.response) {
  //         const { status, data } = error.response;

  //         if (
  //           status === 404 ||
  //           status === 403 ||
  //           status === 500 ||
  //           status === 302 ||
  //           status === 409 ||
  //           status === 401 ||
  //           status === 400
  //         ) {
  //           console.log(error.response);
  //           toast.error(data.message);
  //         }
  //       }
  //     }
  //   };
  //   if (debouncedSearchTerm !== "") {
  //     fetchData();
  //   } else {
  //     setBulkTicketTableData(originalData);
  //   }
  // }, [debouncedSearchTerm, originalData]);

  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const handlerOpenBulkTicketModal = (bulkID, bulkStatus) => {
    if (bulkStatus === BulkCancelStatus.Inactive) {
      setOpenDropdownId(null);
      return toast.error("This Bulk Ticket is Already Cancelled ");
    }

    setBulkCancelID(bulkID);
    setBulkCancelModal(true);
  };

  const handlerCloseBulkTicketModal = () => {
    setBulkCancelID(null);
    setBulkCancelModal(false);
    setOpenDropdownId(null);
  };

  // Cancel Bulk Tickets
  const handlerCancelBulkTicketModal = async () => {
    try {
      const payload = {
        BulkTicketBatch_Id: bulkCancelID,
      };

      let response = await axios.post(
        `${eventbulktickets.CANCEL_BULK_EVENT_TICKETS}`,
        payload
      );

      // console.log(response.data);
      toast.success(response.data.message);
      handlerCloseBulkTicketModal();
      // Update the eventTicketsData state
      setBulkTicketTableData((prevData) =>
        prevData.map((ticket) =>
          ticket.BatchId === bulkCancelID
            ? {
                ...ticket,
                Status: 2,
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

  // Download Reports
  const handlerDownloadReport = async (BatchId) => {
    try {
      const payload = {
        BulkTicketBatch_Id: BatchId,
      };

      let response = await axios.post(
        `${eventbulktickets.DOWNLOAD_BULK_EVENT_TICKETS}`,
        payload,
        { responseType: "blob" }
      );

      console.log(response.data);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a URL for the Blob object
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute("download", "report.xlsx");
      tempLink.style.display = "none"; // Hide the link
      document.body.appendChild(tempLink);
      tempLink.click();

      // Clean up
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);

      resetForm();
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

  const toggleDropdownName = () => {
    setNameDropDownVisible((prev) => !prev);
  };

  const handleDateFilter = (eventDateId, eventDate) => {
    setSelectedDate(eventDateId);
    // setSelectedNameIndex(null);
    // setNameDropDownVisible(false);

    const newFilters = { ...filters, eventDateTime: eventDateId };

    if (eventDate === "reset") {
      setBulkTicketTableData(originalData);
      setFilters({ eventDateTime: "", TicketName: "" });
      setDropdownVisible(false);
      setNameDropDownVisible(false);
      setSelectedDate(null);
      setSelectedNameIndex(null);
    } else {
      setFilters(newFilters);
      fetchFilteredData(newFilters);
    }
  };

  const handleNameFilter = (ticketName, index) => {
    // setSelectedDate(null);
    setSelectedNameIndex(index);
    // setDropdownVisible(false);

    const newFilters = { ...filters, TicketName: ticketName };

    if (ticketName === "resetAllNames") {
      setBulkTicketTableData(originalData);
      setFilters({ eventDateTime: "", TicketName: "" });
      setDropdownVisible(false);
      setNameDropDownVisible(false);
      setSelectedDate(null);
      setSelectedNameIndex(null);
    } else {
      setFilters(newFilters);
      fetchFilteredData(newFilters);
    }
  };

  const fetchFilteredData = async (filterParams) => {
    const payload = {
      event_id: _id,
      ...filterParams,
    };

    console.log({ payload });

    try {
      let response = await axios.post(
        `${eventbulktickets.FILTER_EVENT_BULK_TICKET_BY_DATE_AND_NAME}`,
        payload
      );

      console.log(response.data);
      setBulkTicketTableData(response.data.data);
      toast.success(response.data.message);
      // setDropdownVisible(false);
      // setNameDropDownVisible(false);
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

  const toggleDropdownDate = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div>
      <Toaster />
      <div className=" mt-[2%] w-full justify-end ">
        {/* <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search Ticket name here"
          />
        </div> */}

        <div className="flex md:flex-row flex-col mb-6 gap-4 w-[100%]">
          <div className="h-32  w-full bg-gray-100 flex flex-col justify-center px-4 ">
            <p className="capitalize md:text-xl ">total quantity</p>
            <p className="capitalize text-xl font-semibold">{totalQuantity}</p>
          </div>
          <div className="h-32  w-full bg-gray-100 flex flex-col justify-center px-4 ">
            <p className="capitalize md:text-xl ">total checkin</p>
            <p className="capitalize text-xl font-semibold">{totalCheckin}</p>
          </div>
          <div className="h-32  w-full bg-gray-100 flex flex-col justify-center px-4 ">
            <p className="capitalize md:text-xl ">total price</p>
            <p className="capitalize text-xl font-semibold">
              Rs.{formatAmount(totalPrice)}
            </p>
          </div>
        </div>

        <div className="w-full  flex justify-end">
          <div className="relative text-center mr-4 mt-[2%]">
            <button
              id="dropdownDelayButton"
              onClick={toggleDropdownName}
              className="text-Gray40 w-full md:px-14 px-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
              type="button"
            >
              <span>
                <CiFilter size={22} />
              </span>
              Name Filter
            </button>

            <ul
              id="dropdownDelay"
              className={`absolute right-0 mt-2 z-10 ${
                nameDropDownVisible ? "" : "hidden"
              } bg-white divide-y divide-gray-100 rounded-lg shadow w-56 `}
            >
              <div
                className="py-2 text-sm text-gray-700 "
                aria-labelledby="dropdownDelayButton"
              >
                {bulkNameFilter.map((dates, index) => (
                  <div onClick={() => handleNameFilter(dates, index)}>
                    <li>
                      <p
                        className={`block cursor-pointer text-start px-4 py-2 hover:bg-gray-100  ${
                          selectedNameIndex === index ? "bg-gray-200 " : ""
                        }`}
                      >
                        {dates}
                      </p>
                    </li>
                  </div>
                ))}
              </div>
              <div>
                <li>
                  <span
                    onClick={() => handleNameFilter("resetAllNames", null)}
                    className="block px-4 py-2 cursor-pointer hover:bg-gray-100 text-start "
                  >
                    Reset Filter
                  </span>
                </li>
              </div>
            </ul>
          </div>

          <div className="relative text-center mt-[2%]">
            <button
              id="dropdownDelayButton"
              onClick={toggleDropdownDate}
              className="text-Gray40 w-full md:px-14 px-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
              type="button"
            >
              <span>
                <CiFilter size={22} />
              </span>
              Date Filter
            </button>

            <ul
              id="dropdownDelay"
              className={`absolute right-0 mt-2 z-10 ${
                dropdownVisible ? "" : "hidden"
              } bg-white divide-y divide-gray-100 rounded-lg shadow w-52 `}
            >
              <div
                className="py-2 text-sm text-gray-700 "
                aria-labelledby="dropdownDelayButton"
              >
                {storeFilterDates.map((dates) => (
                  <div
                    onClick={() =>
                      handleDateFilter(dates._id, dates.EventStartDateTime)
                    }
                  >
                    <li>
                      <p
                        className={`block px-4 py-2 text-start hover:bg-gray-100  ${
                          selectedDate === dates._id ? "bg-gray-200 " : ""
                        }`}
                      >
                        {formatDate3(dates.EventStartDateTime)}
                      </p>
                    </li>
                  </div>
                ))}
              </div>
              <div>
                <li>
                  <span
                    onClick={() => handleDateFilter(null, "reset")}
                    className="block px-4 py-2 text-start hover:bg-gray-100 cursor-pointer "
                  >
                    Reset Filter
                  </span>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
      {!loading && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 md:mt-[2%]">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {/* <th scope="col" className="p-4"></th> */}
                <th scope="col" className="px-6 py-3">
                  Batch ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Event Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Ticket Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone No.
                </th>

                <th scope="col" className="px-6 py-3">
                  Ticket Created
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Check In
                </th>
                <th scope="col" className="px-6 py-3">
                  Ticket Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Total amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bulkTicketTableData?.map((bulkData, index) => (
                <tr
                  key={bulkData.BatchId}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700   ${
                    bulkData.Status == "2" ? "bg-red-900" : "bg-white"
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
                  <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {bulkData.BatchId}
                  </td>
                  <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {bulkData.EventName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {bulkData?.EventStartDateTime
                      ? new Date(
                          bulkData.EventStartDateTime
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          timeZone: "UTC",
                        })
                      : "N/A"}
                  </td>
                  <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {bulkData.TicketName}
                  </td>
                  <th scope="row" className="pl-4 py-4">
                    {bulkData?.CustomerName}
                  </th>
                  <td className="pl-4 py-4">{bulkData?.Email}</td>
                  <td className="pl-4 py-4">{bulkData?.PhoneNumber}</td>

                  <td className="w-28 pl-4 py-4">
                    {formatDate2(bulkData?.CreatedAt)}
                  </td>
                  <td className="pl-10 py-4">{bulkData?.Quantity}</td>
                  <td className="pl-10 py-4">{bulkData?.CheckIn}</td>
                  <td className="pl-5 py-4">{bulkData?.Price}</td>
                  <td className="pl-5 py-4">{bulkData?.TotalAmount}</td>

                  <td className="px-6 py-4 relative flex">
                    {bulkData.Status !== BulkCancelStatus.Inactive && (
                      <p
                        onClick={() =>
                          handlerOpenBulkTicketModal(
                            bulkData.BatchId,
                            bulkData.Status
                          )
                        }
                        className="font-medium cursor-pointer text-blue-600  dark:text-blue-500 hover:underline "
                      >
                        Cancel
                      </p>
                    )}

                    <p
                      onClick={() => handlerDownloadReport(bulkData.BatchId)}
                      className="pl-2 cursor-pointer"
                    >
                      <span>
                        <LiaFileDownloadSolid size={25} />
                      </span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {bulkCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Cancel Bulk Tickets</h2>
            <p>Are you sure you want to Cancel Bulk ticket?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlerCancelBulkTicketModal}
                className="px-4 py-2 bg-red-600 text-white rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={handlerCloseBulkTicketModal}
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

export default BulkTicketsTable;
