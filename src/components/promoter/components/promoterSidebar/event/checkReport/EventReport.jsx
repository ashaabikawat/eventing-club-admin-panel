import React, { useEffect, useState } from "react";
import { promoterEndPointPannel } from "../../../../../../services/apis";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { formatDate2, formatDate3 } from "../../../../../common/formatDate2";
import { transformEventDateTime } from "../../../../../common/transformEventDateTime";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BookingTypeOption } from "../../../../../common/helper/Enum";

const EventReport = () => {
  const promoterUser = useSelector((store) => store.promoterauth);
  const { _id } = useParams();

  const navigate = useNavigate();

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
  const [selectedBookingType, setSelectedBookingType] = useState(2);

  const [storeFilterdDatePayload, setFilterdDatePayload] = useState({});

  const [filters, setFilters] = useState({
    eventDateTime_id: "",
    ticketName: "",
  });

  useEffect(() => {
    if (selectedBookingType === 1) {
      getAllEventReportDataByEventID();
    } else {
      getAllTransactionBookingData();
    }
  }, [selectedBookingType]);

  const getAllEventReportDataByEventID = async () => {
    try {
      const Payload = {
        promoter_id: promoterUser.promoterSignupData.user_id,
        event_id: _id,
      };

      const FetchEventTicketsReport = await axios.post(
        `${promoterEndPointPannel.GET_ALL_PROMOTER_EVENT_BOOKING_DATA_BY_EVENT_ID}`,
        Payload
      );

      // console.log(FetchEventTicketsReport.data);
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

      // setEventTicketsData(FetchEventTickets.data.data);
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
        event_id: _id,
      };

      const FetchEventTransactionReport = await axios.post(
        `${promoterEndPointPannel.GET_ALL_TRANSACTION_BOOKING_DATA_BY_EVENY_AND_PROMOTER_ID}`,
        Payload
      );

      console.log(FetchEventTransactionReport.data);
      setAllTransactionBookingData(FetchEventTransactionReport.data.data);
      setOriginalData(FetchEventTransactionReport.data.data);

      // setEventTicketsData(FetchEventTickets.data.data);
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
  // console.log("events data", eventTicketsData);

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
      event_id: _id,
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
          event_id: _id,
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
          event_id: _id,
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
          event_id: _id,
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
    <div className="md:mt-4">
      <Toaster />
      <div className="flex md:flex-row flex-col justify-between w-[96%] mx-auto">
        <div className="w-[40%]">
          <h1 className="text-4xl mt-5 font-bold text-black">Booking</h1>
        </div>

        <div className="mt-5 flex gap-x-4">
          <button
            onClick={() => navigate("/promoter/dashboard/event")}
            className="border border-[#666666] md:w-32 w-full text-[#666666] py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            onClick={() => DownloadReportHandler()}
            className="bg-[#666666] md:w-56 w-full text-white py-2 px-4 rounded"
          >
            Download Report{" "}
          </button>
        </div>
      </div>

      <div className="flex justify-between  w-[98%]">
        <div
          className={`relative mt-10 mr-4  w-[100%] flex flex-col md:flex-row gap-x-4 ${
            selectedBookingType === 1 ? "justify-between" : ""
          }`}
        >
          <div className="md:w-[30%] w-full mt-2">
            <button
              id="dropdownDelayButton"
              onClick={toggleDropdownByBooking}
              className="text-Gray40 w-[100%] justify-between pl-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
              type="button"
            >
              {selectedBookingType === 1
                ? "Summary Booking "
                : "Transaction Booking"}
              <span className="pr-3">
                {dropdownVisibleBooking ? (
                  <IoIosArrowUp size={22} />
                ) : (
                  <IoIosArrowDown size={22} />
                )}
              </span>
            </button>

            <ul
              id="dropdownDelay"
              className={`w-[100%] right-0 mt-2  z-10  ${
                dropdownVisibleBooking ? "" : "hidden"
              } bg-white divide-y divide-gray-100 rounded-lg shadow w-56 `}
            >
              <div
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDelayButton"
              >
                {BookingTypeOption.map((data, index) => (
                  <div
                    key={data.id}
                    onClick={() => handleBookingFilter(data.value, index)}
                  >
                    <li>
                      <p
                        className={`block cursor-pointer text-start px-4 py-2 hover:bg-gray-100  ${
                          selectedBookingType === data.value
                            ? "bg-gray-200 "
                            : ""
                        }`}
                      >
                        {data.text}
                      </p>
                    </li>
                  </div>
                ))}
              </div>
            </ul>
          </div>

          {selectedBookingType === 1 ? (
            <div className="md:w-[50%] w-full gap-x-4  mt-4 flex  justify-end">
              <div className="relative text-center mt-[2%]">
                <button
                  id="dropdownDelayButton"
                  onClick={toggleDropdownName}
                  className="text-Gray40 w-full md:px-14 px-2  focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg md:py-2.5 py-1 text-center inline-flex items-center border border-Gray40"
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
                    {ticketNameFilterData.map((dates, index) => (
                      <div onClick={() => handleNameFilter(dates, index)}>
                        <li>
                          <p
                            className={`block cursor-pointer text-start px-4 py-2 hover:bg-gray-100 ${
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
                      <Link
                        onClick={() => handleNameFilter("resetAllNames", null)}
                        className="block px-4 py-2 hover:bg-gray-100 text-start "
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
                  className="text-Gray40 w-full md:px-14 px-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-1 md:py-2.5 text-center inline-flex items-center border border-Gray40"
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
                          handleDateFilter(dates._id, dates.EventStartDate)
                        }
                      >
                        <li>
                          <p
                            className={`block px-4 py-2 text-start hover:bg-gray-100  ${
                              selectedDate === dates._id ? "bg-gray-200 " : ""
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
                        className="block px-4 py-2 text-start hover:bg-gray-100 "
                      >
                        Reset Filter
                      </Link>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          ) : (
            <div className="md:w-[35%] w-full mt-2">
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
          )}
        </div>
      </div>

      {/* Table Data */}
      {selectedBookingType === 1 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:mt-[2%] mt-8">
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

                <th scope="col" className="px-12  py-3">
                  Ticket Date
                </th>
                <th scope="col" className="md:-px-3 px-8 py-3">
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
                  <td className="md:pl-4 pl-12 py-4">{ticketData?.Quantity}</td>
                  <td className="pl-2 py-4">{ticketData?.TicketPrice}</td>

                  <td className="w-20 py-4 md:pl-0 pl-8">
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
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:mt-[2%] mt-8 ">
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
                {/* <th scope="col" className="px-6 py-3">
                  Check In
                </th> */}
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
                    {transactionData.CustomerName}
                  </td>
                  <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {transactionData.Booking_id}
                  </td>
                  <td className="pl-4 py-4">{transactionData?.PhoneNumber}</td>
                  <td className="pl-4 py-4">{transactionData?.Email}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {transactionData?.BookingDateTime}
                  </td>
                  <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {transactionData.EventName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                    {transactionData?.TicketDate
                      ? new Date(transactionData.TicketDate).toLocaleDateString(
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
                  <td className="pl-10 py-4">
                    {transactionData?.TicketQuantity}
                  </td>
                  {/* <td className="pl-10 py-4">{transactionData?.Check_In}</td> */}
                  <td className=" py-2">{transactionData?.TicketName}</td>
                  <td className="pl-5 py-4">
                    {transactionData?.EventTicketType}
                  </td>
                  <td className="pl-5 py-4">{transactionData?.TicketPrice}</td>
                  <td className="pl-5 py-4">{transactionData?.TotalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventReport;
