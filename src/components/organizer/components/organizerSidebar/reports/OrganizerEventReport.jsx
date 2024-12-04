import Breadcrumb from "../../../../superAdmin/components/common/Breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import {
  eventbulktickets,
  organizerEndpoint,
  promoterEndpoint,
  promoterEndPointPannel,
} from "../../../../../services/apis";
import { useSelector } from "react-redux";
import { transformEventDateTime } from "../../../../common/transformEventDateTime";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";
import { formatDate3 } from "../../../../common/formatDate2";
import Summary from "./Summary";
import All from "./All";
import Promoter from "./Promoter";
import Online from "./Online";
import Bulk from "./Bulk";
import formatAmount from "../../../../common/formatAmount";

const OrganizerEventReport = () => {
  const adminuser = useSelector((store) => store.auth);

  const organizerId = useSelector((store) => store.organizerauth);

  const [searchTermEvent, setSearchTermEvent] = useState("");
  const [selectedDateEvent, setSelectedDateEvent] = useState("");
  const [eventData, setEventData] = useState({});
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedBookingType, setSelectedBookingType] = useState(0);

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
  const [activeBooking, setActiveBooking] = useState(null);
  const [storeFilterdDatePayload, setFilterdDatePayload] = useState({});

  const [filters, setFilters] = useState({
    eventDateTime_id: "",
    ticketName: "",
  });
  const [allBookingData, setAllBookingData] = useState([]);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCheckin, setTotalCheckin] = useState(0);

  const handleSearch = async () => {
    if (!searchTermEvent || !selectedDateEvent) {
      toast.error("Both search term and date must be selected.");
      return;
    }

    setSelectedReportType("");

    const formattedDate = new Date(selectedDateEvent).toISOString();

    const payload = {
      AdminRole: organizerId.organizerSignupData.AdminRole,
      user_id: organizerId.organizerSignupData.user_id,
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
    setStoreFilterDates([]);
    setEventTicketsData([]);
    setOriginalData([]);
    setActiveBooking(null);
    setFilterdDatePayload({});
    setFilters({
      eventDateTime_id: "",
      ticketName: "",
    });
    setNameDropDownVisible(false);
    setDropdownVisible(false);
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
        AdminRole: organizerId.organizerSignupData.AdminRole,
        user_id: organizerId.organizerSignupData.user_id,
        event_id: eventData._id,
      };

      const FetchEventTicketsReport = await axios.post(
        `${organizerEndpoint.GET_ALL_SUMMARY_BOOKING_DATA_BY_EVENT_AND_ORGANIZER_ID}`,
        Payload
      );

      console.log(FetchEventTicketsReport.data.data.totalQuantity);
      setTicketNameFilterData(
        FetchEventTicketsReport.data.data.TicketNamesArray
      );
      setTotalQuantity(FetchEventTicketsReport.data.data.totalQuantity);
      setTotalCheckin(FetchEventTicketsReport.data.data.totalCheckInCount);
      setTotalPrice(FetchEventTicketsReport.data.data.totalPrice);

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
    handleBookingClick(3);
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
    // console.log({ filterParams });
    const filteredParams = Object.keys(filterParams).reduce((acc, key) => {
      if (filterParams[key]) {
        acc[key] = filterParams[key];
      }
      return acc;
    }, {});

    const payload = {
      AdminRole: organizerId.organizerSignupData.AdminRole,
      user_id: organizerId.organizerSignupData.user_id,
      event_id: eventData._id,
      ...filteredParams, // Use the filteredParams object
    };

    console.log(payload);

    try {
      let response = await axios.post(
        `${organizerEndpoint.FILTER_EVENT_BOOKING_DATA_BY_NAME_AND_DATE_IN_PROMOTER}`,
        payload
      );

      console.log(response.data);
      setEventTicketsData(response.data.data.processedTicketsData);
      toast.success(response.data.message);
      setFilterdDatePayload(payload);
      setNameDropDownVisible(false);
      setDropdownVisible(false);
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
          AdminRole: organizerId.organizerSignupData.AdminRole,
          user_id: organizerId.organizerSignupData.user_id,
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
          organizerEndpoint.DOWNLOAD_EXECEL_REPORT_OF_SUMMARY_BOOKING_FOR_ORGANIZER_ID,
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
          AdminRole: organizerId.organizerSignupData.AdminRole,
          user_id: organizerId.organizerSignupData.user_id,
          event_id: eventData._id,
        };

        // Add searchKeyword if searchTerm is not empty
        if (searchTerm && searchTerm.length >= 3) {
          payload.searchKeyword = searchTerm;
        }

        // Call the API for Transaction Booking
        response = await axios.post(
          organizerEndpoint.DOWNLOAD_EXECEL_REPORT_OF_TRANSACTION_BOOKING_FOR_ORGANIZER_ID,
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
          AdminRole: organizerId.organizerSignupData.AdminRole,
          user_id: organizerId.organizerSignupData.user_id,
          event_id: eventData._id,
          searchKeyword: debouncedSearchTerm,
        };

        let response = await axios.post(
          `${`${organizerEndpoint.GET_ALL_TRANSACTION_BOOKING_DATA_BY_EVENT_AND_ORGANIZER_ID}`}`,
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

  const bookingData = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Online",
    },
    {
      id: 3,
      title: "Promoter",
    },
    {
      id: 4,
      title: "Bulk Ticket",
    },
  ];

  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
        toast.error(data.message);
      }
    }
  };

  const [selectedEventType, setSelectedEventType] = useState("All");

  const renderComponent = () => {
    switch (selectedEventType) {
      case "All":
        return (
          <All
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
            id={eventData._id}
          />
        );

      case "Promoter":
        return (
          <Promoter
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
            id={eventData._id}
          />
        );
      case "Online":
        return (
          <Online
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
            id={eventData._id}
          />
        );

      case "Bulk":
        return (
          <Bulk
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
            id={eventData._id}
          />
        );

      default:
        return (
          <All
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
          />
        );
    }
  };

  return (
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Report"} />
      <h1 className="text-3xl font-semibold mt-6">Report</h1>

      <div className="mt-6 flex justify-between">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={searchTermEvent}
            onChange={(e) => setSearchTermEvent(e.target.value)}
            placeholder="Search..."
            className="border first: p-2 mr-4"
          />

          <input
            type="date"
            value={selectedDateEvent}
            onChange={(e) => setSelectedDateEvent(e.target.value)}
            className="border  p-2 mr-4"
          />

          {showResetButton ? (
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          ) : (
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          )}

          {showReportTypeDropdown && (
            <div className="ml-4">
              <select
                id="reportType"
                value={selectedReportType}
                onChange={handleReportTypeChange}
                className="border p-2"
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
        {selectedBookingType === 1 && (
          <div>
            <button
              onClick={() => DownloadReportHandler()}
              className="bg-[#666666] md:w-56 text-white py-2 px-4 rounded"
            >
              Download Report{" "}
            </button>
          </div>
        )}
      </div>

      {/* <div className="mt-5">
        {selectedBookingType === 1 ? (
          <div className="w-[50%] gap-x-4   flex justify-end">
            <div className="relative text-center mt-[2%]">
              <button
                id="dropdownDelayButton"
                onClick={toggleDropdownName}
                className="text-Gray40 w-full px-14  focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
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
                className="text-Gray40 w-full px-14  focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
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
        ) : activeBooking != 4 && selectedBookingType === 2 ? (
          <div className="w-[35%] mt-2">
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
      </div> */}

      {/* {selectedBookingType === 2 && (
        <div className="flex gap-x-[3%] my-5 pl-3">
          {bookingData.map((bookingTitle, index) => (
            <div
              key={index}
              onClick={() => handleBookingClick(bookingTitle.id)}
            >
              <h1
                className={`cursor-pointer ${
                  activeBooking === bookingTitle.id ? "text-blue-600" : ""
                }`}
              >
                {bookingTitle.title}
              </h1>
            </div>
          ))}
        </div>
      )} */}

      {/* <div className="mt-6">
        {selectedBookingType === 1 ? (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Ticket Name
                  </th>
                  <th scope="col" className="py-3">
                    Quantity
                  </th>
                  <th scope="col" className=" py-3">
                    Ticket Price
                  </th>

                  <th scope="col" className="px-12 py-3">
                    Ticket Date
                  </th>
                  <th scope="col" className="-px-3 py-3">
                    Total amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventTicketsData.map((ticketData, index) => (
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
                        ? new Date(ticketData.TicketDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>

                    <td className="pl-10 py-4">{ticketData?.TotalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeBooking == 3 ? (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4"></th>
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
                    Booking Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Event Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Check In
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
                </tr>
              </thead>
              <tbody>
                {allTransactionBookingData?.map((transactionData, index) => (
                  <tr
                    key={index}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700   ${
                      transactionData.Status == "2" ? "bg-red-900" : "bg-white"
                    }`}
                  >
                    <td className="w-4 p-4">
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
                    </td>
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
                          })
                        : "N/A"}
                    </td>
                    <td className="pl-10 py-4">
                      {transactionData?.TicketQuantity}
                    </td>
                    <td className="pl-10 py-4">{transactionData?.Check_In}</td>
                    <td className=" py-2">{transactionData?.TicketName}</td>
                    <td className="pl-5 py-4">
                      {transactionData?.EventTicketType}
                    </td>
                    <td className="pl-5 py-4">
                      {transactionData?.TicketPrice}
                    </td>
                    <td className="pl-5 py-4">
                      {transactionData?.TotalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeBooking == 4 ? (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4"></th>
                  <th scope="col" className="px-6 py-3">
                    Booking ID
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
                </tr>
              </thead>
              <tbody>
                {allTransactionBookingData?.map((transactionData, index) => (
                  <tr
                    key={transactionData.BatchId}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700   ${
                      transactionData.Status == "2" ? "bg-red-900" : "bg-white"
                    }`}
                  >
                    <td className="w-4 p-4">
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
                    </td>
                    <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                      {transactionData.BatchId}
                    </td>
                    <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                      {transactionData.EventName}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                      {transactionData?.EventStartDateTime
                        ? new Date(
                            transactionData.EventStartDateTime
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                      {transactionData.TicketName}
                    </td>
                    <th scope="row" className="pl-4 py-4">
                      {transactionData?.CustomerName}
                    </th>
                    <td className="pl-4 py-4">{transactionData?.Email}</td>
                    <td className="pl-4 py-4">
                      {transactionData?.PhoneNumber}
                    </td>

                    <td className="w-28 pl-4 py-4">
                      {transactionData?.CreatedAt}
                    </td>
                    <td className="pl-10 py-4">{transactionData?.Quantity}</td>
                    <td className="pl-10 py-4">0</td>
                    <td className="pl-5 py-4">{transactionData?.Price}</td>
                    <td className="pl-5 py-4">
                      {transactionData?.TotalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeBooking == 1 ? (
          <div>All Data</div>
        ) : activeBooking == 2 ? (
          <div>Online</div>
        ) : null}
      </div> */}

      <div>
        {selectedBookingType === 1 && (
          <div className="w-full flex md:flex-row flex-col  md:items-center mt-12 ">
            <div className=" flex gap-4 md:w-[50%]">
              <div className="relative md:w-[40%] text-center mt-[3%]">
                <button
                  id="dropdownDelayButton"
                  onClick={toggleDropdownName}
                  className="text-Gray40 w-full px-2 md:px-6 py-2  focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg  text-center inline-flex items-center border border-Gray40"
                  type="button"
                >
                  <span>
                    <CiFilter size={22} />
                  </span>
                  Name Filter
                </button>
                <ul
                  id="dropdownDelay"
                  className={`absolute left-0 mt-2 z-10 ${
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

              <div className="relative md:w-[40%] text-center mt-[3%]">
                <button
                  id="dropdownDelayButton"
                  onClick={toggleDropdown}
                  className="text-Gray40 w-full px-2 md:px-6 py-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg  text-center inline-flex items-center border border-Gray40"
                  type="button"
                >
                  <span>
                    <CiFilter size={22} />
                  </span>
                  Date Filter
                </button>

                <ul
                  id="dropdownDelay"
                  className={`absolute left-0 mt-2 z-10 ${
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
            <div className="flex md:gap-4 gap-2 md:mt-0 mt-6 md:w-[50%]">
              <div className="h-32  w-full bg-gray-100 flex flex-col justify-center px-4 ">
                <p className="capitalize md:text-xl ">total quantity</p>
                <p className="capitalize text-xl font-semibold">
                  {totalQuantity}
                </p>
              </div>
              <div className="h-32  w-full bg-gray-100 flex flex-col justify-center px-4 ">
                <p className="capitalize md:text-xl ">total checkin</p>
                <p className="capitalize text-xl font-semibold">
                  {totalCheckin}
                </p>
              </div>
              <div className="h-32  w-full bg-gray-100 flex flex-col justify-center px-4 ">
                <p className="capitalize md:text-xl ">total price</p>
                <p className="capitalize text-xl font-semibold">
                  Rs.{formatAmount(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedBookingType === 2 && renderComponent()}
      {selectedBookingType === 1 && (
        <Summary eventTicketsData={eventTicketsData} />
      )}
    </div>
  );
};

export default OrganizerEventReport;
