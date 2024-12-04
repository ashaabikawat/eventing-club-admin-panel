import Breadcrumb from "../../../../superAdmin/components/common/Breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import {
  promoterEndpoint,
  promoterEndPointPannel,
} from "../../../../../services/apis";
import { useSelector } from "react-redux";
import { transformEventDateTime } from "../../../../common/transformEventDateTime";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";
import { formatDate3 } from "../../../../common/formatDate2";
import { bookingStatus } from "../../../../common/helper/Enum";

const PromoterEventReport = () => {
  const promoterUser = useSelector((store) => store.promoterauth);

  const [searchTermEvent, setSearchTermEvent] = useState("");
  const [selectedDateEvent, setSelectedDateEvent] = useState("");
  const [eventData, setEventData] = useState({});
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");

  const [nameDropDownVisible, setNameDropDownVisible] = useState(false);
  const [selectedNameIndex, setSelectedNameIndex] = useState(null);

  const [ticketNameFilterData, setTicketNameFilterData] = useState([]);
  const [storeFilterDates, setStoreFilterDates] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisibleBooking, setDropdownVisibleBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTicketsData, setEventTicketsData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [allTransactionBookingData, setAllTransactionBookingData] = useState(
    []
  );
  const [selectedBookingType, setSelectedBookingType] = useState(0);

  const [storeFilterdDatePayload, setFilterdDatePayload] = useState({});

  const [filters, setFilters] = useState({
    eventDateTime_id: "",
    ticketName: "",
  });

  const handleSearch = async () => {
    if (!searchTermEvent || !selectedDateEvent) {
      toast.error("Both search term and date must be selected.");
      return;
    }

    setSelectedReportType("");

    const formattedDate = new Date(selectedDateEvent).toISOString();

    const payload = {
      AdminRole: promoterUser.promoterSignupData.AdminRole,
      user_id: promoterUser.promoterSignupData.user_id,
      EventName: searchTermEvent,
      DateTime: formattedDate,
    };

    console.log({ payload });

    try {
      const responseData = await axios.post(
        `${promoterEndpoint.EVENT_REPORT_BY_DATE_AND_SEARCH}`,
        payload
      );

      console.log("responseData", responseData.data);
      toast.success(responseData.data.message);

      // Hide the search button and show the dropdown after successful response
      if (responseData.status === 200) {
        setShowReportTypeDropdown(true);
      }

      setEventData(responseData.data.data);
      setSelectedBookingType(0);
      setShowResetButton(true);
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

  const handleReset = () => {
    setSearchTermEvent("");
    setSelectedDateEvent("");
    setEventData({});
    setShowReportTypeDropdown(false);
    setShowResetButton(false);
    setSelectedBookingType(0);
    setTicketNameFilterData([]);
    setNameDropDownVisible(false);
    setDropdownVisible(false);
    setStoreFilterDates([]);
    setEventTicketsData([]);
    setOriginalData([]);
    setFilters({
      eventDateTime_id: "",
      ticketName: "",
    });
  };

  const handleReportTypeChange = async (e) => {
    const reportType = e.target.value;
    setSelectedReportType(reportType);
    if (reportType === "summary") {
      getAllEventReportDataByEventID();
      setSelectedBookingType(1);
    } else if (reportType === "transaction") {
      getAllTransactionBookingData();
      setSelectedBookingType(2);
    }
  };

  const getAllEventReportDataByEventID = async () => {
    try {
      const Payload = {
        promoter_id: promoterUser.promoterSignupData.user_id,
        event_id: eventData._id,
      };

      const FetchEventTicketsReport = await axios.post(
        `${promoterEndPointPannel.GET_ALL_PROMOTER_EVENT_BOOKING_DATA_BY_EVENT_ID}`,
        Payload
      );

      console.log(FetchEventTicketsReport.data);
      setTicketNameFilterData(
        FetchEventTicketsReport.data.data.TicketNamesArray
      );

      const EventDateFormatting =
        FetchEventTicketsReport.data.data.EventDateTimeData;
      const formattedEventData = await transformEventDateTime(
        EventDateFormatting
      );

      setStoreFilterDates(formattedEventData);
      setEventTicketsData(FetchEventTicketsReport.data.data.TicketsData);
      setOriginalData(FetchEventTicketsReport.data.data.TicketsData);

      setEventTicketsData(FetchEventTickets.data.data);
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
          toast.error(data.message);
        }
      }
    }
  };

  const getAllTransactionBookingData = async () => {
    try {
      const Payload = {
        promoter_id: promoterUser.promoterSignupData.user_id,
        event_id: eventData._id,
      };

      console.log({ Payload });

      const FetchEventTransactionReport = await axios.post(
        `${promoterEndPointPannel.GET_ALL_TRANSACTION_BOOKING_DATA_BY_EVENY_AND_PROMOTER_ID}`,
        Payload
      );

      console.log(FetchEventTransactionReport.data);
      setAllTransactionBookingData(FetchEventTransactionReport.data.data);
      setOriginalData(FetchEventTransactionReport.data.data);

      setEventTicketsData(FetchEventTickets.data.data);
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
          toast.error(data.message);
        }
      }
    }
  };

  const toggleDropdownName = () => {
    setNameDropDownVisible((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const toggleDropdownByBooking = () => {
    setDropdownVisibleBooking((prev) => !prev);
  };

  const handleNameFilter = (ticketName, index) => {
    setSelectedNameIndex(index);

    const newFilters = { ...filters, ticketName: ticketName };

    if (ticketName === "resetAllNames") {
      setEventTicketsData(originalData);
      setFilters({ eventDateTime_id: "", ticketName: "" });
      setFilterdDatePayload({});
    } else {
      setFilters(newFilters);
      fetchFilteredData(newFilters);
    }
  };

  // filltered data by dates
  const handleDateFilter = (eventDateId, eventDate) => {
    setSelectedDate(eventDateId);
    setSelectedNameIndex(null);
    setNameDropDownVisible(false);

    const newFilters = { ...filters, eventDateTime_id: eventDateId };

    if (eventDate === "reset") {
      setEventTicketsData(originalData);
      setFilters({ eventDateTime_id: "", ticketName: "" });
      setFilterdDatePayload({});
      // setNameDropDownVisible(false);
    } else {
      setFilters(newFilters);
      fetchFilteredData(newFilters);
    }
  };

  const fetchFilteredData = async (filterParams) => {
    console.log({ filterParams });
    const filteredParams = Object.keys(filterParams).reduce((acc, key) => {
      if (filterParams[key]) {
        acc[key] = filterParams[key];
      }
      return acc;
    }, {});

    const payload = {
      event_id: eventData._id,
      promoter_id: promoterUser.promoterSignupData.user_id,
      ...filteredParams, // Use the filteredParams object
    };

    try {
      let response = await axios.post(
        `${promoterEndPointPannel.FILTER_EVENT_BOOKING_DATA_BY_NAME_AND_DATE_IN_PROMOTER}`,
        payload
      );

      console.log(response.data);
      setEventTicketsData(response.data.data);
      toast.success(response.data.message);
      setFilterdDatePayload(payload);
      // setDropdownVisible(false);
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
          setEventTicketsData([]);
        }
      }
    }
  };

  const handleBookingFilter = (value, index) => {
    setSelectedBookingType(value);
    setDropdownVisibleBooking(false);
  };

  const DownloadReportHandler = async () => {
    try {
      let response;

      if (selectedBookingType === 1) {
        // Prepare the payload for Summary Booking

        if (eventTicketsData.length === 0) {
          toast.error("No Summary Booking data found for this event.");
          return;
        }

        const payload = {
          promoter_id: promoterUser.promoterSignupData.user_id,
          event_id: eventData._id,
        };

        // Conditionally add `ticketName` if it exists
        if (storeFilterdDatePayload.ticketName) {
          payload.ticketName = storeFilterdDatePayload.ticketName;
        }

        // Conditionally add `eventDateTime_id` if it exists
        if (storeFilterdDatePayload.eventDateTime_id) {
          payload.eventDateTime_id = storeFilterdDatePayload.eventDateTime_id;
        }

        console.log({ payload });

        // Call the API for Summary Booking
        response = await axios.post(
          promoterEndPointPannel.DOWNLOAD_EXECEL_REPORT_OF_SUMMARY_BOOKING,
          payload,
          { responseType: "blob" } // Ensure the response is treated as a Blob
        );
      } else if (selectedBookingType === 2) {
        // Prepare the payload for Transaction Booking

        if (allTransactionBookingData.length === 0) {
          toast.error("No transaction data found for this event.");
          return;
        }

        const payload = {
          promoter_id: promoterUser.promoterSignupData.user_id,
          event_id: eventData._id,
        };

        // Add searchKeyword if searchTerm is not empty
        if (searchTerm && searchTerm.length >= 3) {
          payload.searchKeyword = searchTerm;
        }

        // Call the API for Transaction Booking
        response = await axios.post(
          promoterEndPointPannel.DOWNLOAD_EXECEL_REPORT_OF_TRANSACTION_BOOKING,
          payload,
          { responseType: "blob" } // Ensure the response is treated as a Blob
        );
      }

      // Handle the response, which should be a Blob for the XLSX file
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${
          selectedBookingType === 1 ? "Summary Report" : "Transaction Report"
        }_Report.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
          toast.error(data.message);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedSearchTerm.length < 3) {
          toast.error("Search keyword must be at least 3 characters long.");
          return;
        }

        const payload = {
          promoter_id: promoterUser.promoterSignupData.user_id,
          event_id: eventData._id,
          searchKeyword: debouncedSearchTerm,
        };

        let response = await axios.post(
          `${`${promoterEndPointPannel.GET_ALL_TRANSACTION_BOOKING_DATA_BY_EVENY_AND_PROMOTER_ID}`}`,
          payload
        );

        console.log(response.data);
        setAllTransactionBookingData(response.data.data);
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
    if (debouncedSearchTerm !== "") {
      fetchData();
    } else {
      setAllTransactionBookingData(originalData);
    }
  }, [debouncedSearchTerm, originalData]);

  return (
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Report"} />
      <h1 className="text-3xl font-semibold mt-6">Report</h1>

      <div className="mt-6 flex justify-between">
        <div className="md:flex">
          <input
            type="text"
            value={searchTermEvent}
            onChange={(e) => setSearchTermEvent(e.target.value)}
            placeholder="Search..."
            className="border p-2 mr-4"
          />

          <input
            type="date"
            value={selectedDateEvent}
            onChange={(e) => setSelectedDateEvent(e.target.value)}
            className="border p-2 mr-4"
          />

          {showResetButton ? (
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-4 py-2 md:mt-0  mt-4  rounded"
            >
              Reset
            </button>
          ) : (
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 md:mt-0  mt-4 rounded"
            >
              Search
            </button>
          )}

          {showReportTypeDropdown && (
            <div className="md:ml-4 w-full md:mt-0 mt-4">
              <select
                id="reportType"
                value={selectedReportType}
                onChange={handleReportTypeChange}
                className="border p-2 w-full"
              >
                <option disabled value="">
                  --Select Report--
                </option>
                <option value="summary">Summary Report</option>
                <option value="transaction">Transaction Report</option>
              </select>
            </div>
          )}
        </div>

        {selectedBookingType !== 0 && (
          <div>
            <button
              onClick={() => DownloadReportHandler()}
              disabled={allTransactionBookingData?.length === 0}
              className={`${
                allTransactionBookingData?.length === 0
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } bg-[#666666]  md:w-56 text-white py-2 px-4 rounded`}
            >
              Download
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {selectedBookingType === 1 ? (
          <div className="md:w-[50%] gap-x-4   flex ">
            <div className="relative text-center mt-[2%]">
              <button
                id="dropdownDelayButton"
                onClick={toggleDropdownName}
                className="text-Gray40 w-full md:px-14  px-4 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
                type="button"
              >
                <span>
                  <CiFilter size={22} />
                </span>
                Name Filter
              </button>

              <ul
                id="dropdownDelay"
                className={`absolute -right-16 md:right-0 mt-2 z-10 ${
                  nameDropDownVisible ? "" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-56 dark:bg-gray-700`}
              >
                <div
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDelayButton"
                >
                  {ticketNameFilterData.map((dates, index) => (
                    <div onClick={() => handleNameFilter(dates, index)}>
                      <li>
                        <p
                          className={`block cursor-pointer text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                            selectedNameIndex === index
                              ? "bg-gray-200 dark:bg-gray-500"
                              : ""
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
                    <Link
                      onClick={() => handleNameFilter("resetAllNames", null)}
                      className="block px-4 py-2 hover:bg-gray-100 text-start dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Reset Filter
                    </Link>
                  </li>
                </div>
              </ul>
            </div>

            <div className="relative text-center mt-[2%]">
              <button
                id="dropdownDelayButton"
                onClick={toggleDropdown}
                className="text-Gray40 w-full md:px-14  px-4 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
                type="button"
              >
                <span>
                  <CiFilter size={22} />
                </span>
                Date Filter
              </button>

              <ul
                id="dropdownDelay"
                className={`absolute -right-16  md:right-0 mt-2 z-10 ${
                  dropdownVisible ? "" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700`}
              >
                <div
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDelayButton"
                >
                  {storeFilterDates.map((dates) => (
                    <div
                      onClick={() =>
                        handleDateFilter(dates._id, dates.EventStartDate)
                      }
                    >
                      <li>
                        <p
                          className={`block px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                            selectedDate === dates._id
                              ? "bg-gray-200 dark:bg-gray-500"
                              : ""
                          }`}
                        >
                          {formatDate3(dates.EventStartDate)}
                        </p>
                      </li>
                    </div>
                  ))}
                </div>
                <div>
                  <li>
                    <Link
                      onClick={() => handleDateFilter(null, "reset")}
                      className="block px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Reset Filter
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        ) : selectedBookingType === 2 ? (
          <div className="md:w-[35%] mt-2">
            <div className=" ">
              <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
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
                  placeholder="Search By Booking Id and Customer Name"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          {selectedBookingType === 1 ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Ticket Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Quantity
                    </th>
                    <th scope="col" className=" py-3">
                      Ticket Price
                    </th>

                    <th scope="col" className="px-12 py-3">
                      Ticket Date
                    </th>
                    <th scope="col" className="-px-10 py-3">
                      Total amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventTicketsData.length > 0 ? (
                    eventTicketsData.map((ticketData, index) => (
                      <tr
                        key={ticketData._id}
                        className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 
                }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {ticketData?.TicketName}
                        </th>
                        <td className="pl-4 py-4">{ticketData?.Quantity}</td>
                        <td className="pl-4 py-4">{ticketData?.TicketPrice}</td>

                        <td className="w-20 py-4">
                          {ticketData?.TicketDate
                            ? new Date(
                                ticketData.TicketDate
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                timeZone: "UTC",
                              })
                            : "N/A"}
                        </td>

                        <td className="pl-10 py-4">
                          {ticketData?.TotalAmount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={16} className="text-center py-4">
                        <p className="font-bold">No Bookings Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : selectedBookingType === 2 ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {/* <th scope="col" className="p-4"></th> */}
                    <th scope="col" className="px-6 py-3">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Phone No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Booking Date & time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Event Name
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Ticket date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ticket Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ticket Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ticket Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total amount
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactionBookingData?.length > 0 ? (
                    allTransactionBookingData?.map((transactionData, index) => (
                      <tr
                        key={index}
                        className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700   ${
                          transactionData.Status == "2"
                            ? "bg-red-900"
                            : "bg-white"
                        }`}
                      >
                        <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          {transactionData.CustomerName}
                        </td>
                        <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          {transactionData.Booking_id}
                        </td>
                        <td className="pl-4 py-4">
                          {transactionData?.PhoneNumber}
                        </td>
                        <td className="pl-4 py-4">{transactionData?.Email}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          {transactionData?.BookingDateTime}
                        </td>
                        <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          {transactionData.EventName}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          {transactionData?.TicketDate
                            ? new Date(
                                transactionData.TicketDate
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                timeZone: "UTC",
                              })
                            : "N/A"}
                        </td>
                        <td className="pl-10 py-4">
                          {transactionData?.TicketQuantity}
                        </td>

                        <td className="pl-6 px-2 py-2">
                          {transactionData?.TicketName}
                        </td>
                        <td className="pl-6 py-4">
                          {transactionData?.EventTicketType}
                        </td>
                        <td className="pl-6 py-4">
                          {transactionData?.TicketPrice}
                        </td>
                        <td className="pl-6 py-4">
                          {transactionData?.TotalAmount}
                        </td>
                        <td className="pl-2 pr-14 py-4">
                          {transactionData.status !== bookingStatus.Booked
                            ? "Cancelled"
                            : "Booked"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={16} className="text-center py-4">
                        <p className="font-bold">No Bookings Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PromoterEventReport;
