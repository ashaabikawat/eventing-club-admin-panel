import React, { useEffect, useState } from "react";
import {
  booking,
  eventbulktickets,
  getallcityDataEndPoint,
  organizerEndpoint,
  promoterEndpoint,
  venueEndPoint,
} from "../../../../../../services/apis";
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
import { TbFilter } from "react-icons/tb";
import { dropdownOptions } from "../modalCrationData/modalOpen";
import { BsChevronDown } from "react-icons/bs";
import { dateFilter } from "../../../../../common/datefilter";
import Select from "react-select";
import Promoter from "./Promoter";
import Summary from "./Summary";
import Online from "./Online";
import All from "./All";
import Bulk from "./Bulk";

const EventBookingAdmin = () => {
  const tabs = [
    { id: 1, value: 1, EventType: "All" },
    { id: 2, value: 2, EventType: "Promoter" },
    { id: 3, value: 3, EventType: "Online" },
  ];

  const { _id } = useParams();

  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);

  const [downloadExcel, setDownloadExcel] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTicketsData, setEventTicketsData] = useState([]);

  const [allBookingData, setAllBookingData] = useState([]);
  const [nameDropDownVisible, setNameDropDownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilteredPop, setOpenFilteredPop] = useState(false);
  const [storeFilterdDatePayload, setFilterdDatePayload] = useState({});

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedNameIndex, setSelectedNameIndex] = useState(null);
  const [ticketNameFilterData, setTicketNameFilterData] = useState([]);
  const [storeFilterDates, setStoreFilterDates] = useState([]);

  const [selectedCity, setSelectedCity] = useState();
  const [selectedEventNames, setSelectedEventNames] = useState();
  const [selectedVenue, setSelectedVenue] = useState();
  const [selectedPromoter, setSelectedPromoter] = useState();
  const [selectedOrganizer, setSelectedOrganizer] = useState();
  const [dropdownVisibleBooking, setDropdownVisibleBooking] = useState(false);
  const [selectedBookingType, setSelectedBookingType] = useState(2);

  const toggleDropdownName = () => {
    setNameDropDownVisible((prev) => !prev);
  };
  const [filters, setFilters] = useState({
    eventDateTime_id: "",
    ticketName: "",
  });

  const handleBookingFilter = (value, index) => {
    setSelectedBookingType(value);
    setDropdownVisibleBooking(false);
  };

  const adminuser = useSelector((store) => store.auth);
  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (selectedBookingType === 1) {
      getAllEventReportDataByEventID();
    } else {
      getBookingData();
    }
  }, [selectedBookingType]);

  const toggleDropdownByBooking = () => {
    setDropdownVisibleBooking((prev) => !prev);
  };

  // console.log("selectedDate", selectedDate);

  const handleDateFilter = (eventDateId, eventDate) => {
    // console.log(eventDateId, eventDate);
    setSelectedDate(eventDateId);
    setSelectedNameIndex(null);
    setNameDropDownVisible(false);

    const newFilters = { ...filters, eventDateTime_id: eventDateId };

    if (eventDate === "reset") {
      setEventTicketsData(originalData);
      setFilters({ eventDateTime_id: "", ticketName: "" });
      setFilterdDatePayload({});
      setNameDropDownVisible(false);
    } else {
      setFilters(newFilters);
      fetchFilteredData(newFilters);
    }
  };
  console.log(eventTicketsData);

  const fetchFilteredData = async (filterParams) => {
    // console.log({ filterParams });
    // console.log("hi");
    const filteredParams = Object.keys(filterParams).reduce((acc, key) => {
      if (filterParams[key]) {
        acc[key] = filterParams[key];
      }
      return acc;
    }, {});

    const payload = {
      AdminRole: adminuser.adminSignupData.AdminRole,
      user_id: adminuser.adminSignupData.user_id,
      event_id: _id,
      ...filteredParams, // Use the filteredParams object
    };

    console.log("payload", payload);

    try {
      let response = await axios.post(
        `${organizerEndpoint.FILTER_EVENT_BOOKING_DATA_BY_NAME_AND_DATE_IN_PROMOTER}`,
        payload
      );

      // console.log(response.data);
      setEventTicketsData(response.data.data.processedTicketsData);
      toast.success(response.data.message);
      setNameDropDownVisible(false);
      setDropdownVisible(false);
      setFilterdDatePayload(payload);
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
          // console.log(error.response);
          toast.error(data.message);
          setEventTicketsData([]);
        }
      }
    }
  };

  const getBookingData = async () => {
    const payload = {
      AdminRole: adminuser.adminSignupData.AdminRole,
      user_id: adminuser.adminSignupData.user_id,
      page: String(page),
      limit: "10",
      event_id: _id,
    };
    console.log(payload);
    try {
      const fetchBooking = await axios.post(
        `${booking.GET_PROMOTER_BOOKINGS}`,
        payload
      );
      console.log(fetchBooking.data.data);
      setAllBookingData(fetchBooking.data.data.latestBookingData);
      setOriginalData(fetchBooking.data.data.latestBookingData);
      setTotalPages(fetchBooking.data.data.totalPages);
    } catch (error) {
      console.log(error);
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
  const openEventFilterPopUp = () => {
    setOpenFilteredPop(true);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };
  console.log("name", selectedNameIndex);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleNameFilter = (ticketName, index) => {
    console.log(ticketName, index);
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

  useEffect(() => {
    if (openFilteredPop) {
      getAllVenueData();
      getAllOrganizerData();
      getAllPromoterData();
      getAllCityData();
    }
  }, [openFilteredPop]);

  const getAllVenueData = async () => {
    try {
      const FetchVenueData = await axios.get(
        `${venueEndPoint.ALL_VENUE_DATA_LIST}`
      );
      setVenues(FetchVenueData.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const getAllOrganizerData = async () => {
    try {
      const FetchOrganizerData = await axios.get(
        `${organizerEndpoint.GET_ALL_ORGANIZERS_DATA_URL}`
      );
      setOrganizer(FetchOrganizerData.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const getAllPromoterData = async () => {
    try {
      const FetchPromoterData = await axios.get(
        `${promoterEndpoint.GET_ALL_PROMOTER_DATA_URL}`
      );
      setPromoters(FetchPromoterData.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const getAllCityData = async () => {
    try {
      const FetchCityData = await axios.post(
        `${getallcityDataEndPoint.GET_ALL_EVENT_CITY_DATA}`
      );
      setCities(FetchCityData.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if ([400, 401, 403, 404, 409, 500].includes(status)) {
        toast.error(data.message);
      }
    }
  };
  const handleSearch = async () => {
    const payload = {
      AdminRole: adminuser.adminSignupData.AdminRole,
      user_id: adminuser.adminSignupData.user_id,
      page: String(page),
      limit: "10",
      event_id: _id,
    };
    if (selectedVenue) payload.venue_id = selectedVenue.value;
    if (selectedOrganizer) payload.organizer_id = selectedOrganizer.value;
    if (selectedPromoter) payload.promoter_id = selectedPromoter.value;
    if (selectedCity) payload.cityname = selectedCity.value;

    if (
      selectedVenue === null &&
      selectedOrganizer === null &&
      selectedPromoter === null &&
      selectedCity === null
    ) {
      return toast.error("Please select at least one filter");
    }

    //  setLoading(true);
    console.log(payload);
    try {
      const FetchEventData = await axios.post(
        `${booking.GET_PROMOTER_BOOKINGS}`,
        payload
      );
      console.log(FetchEventData.data.data);
      setAllBookingData(FetchEventData.data.data.latestBookingData);
      setTotalPages(FetchEventData.data.data.totalPages);
      toast.success(FetchEventData.data.message);
      setOpenFilteredPop(false);
      setSearchTerm("");
      // setLoading(false);
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
          // setLoading(false);
        }
      }
    }
  };

  const toggleDropdownFiltered = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelection = (option) => {
    setIsManual(option === "Manual");
    setIsOpen(false);
    console.log({ option });
    if (option === "Reset") {
      handleReset();
    }

    if (option !== "Manual" && option !== "Reset") {
      const currentDate = new Date();
      let TodayStartDateTimeStr, TodayEndDatetimeStr;

      switch (option) {
        case "Today":
          ({ TodayStartDateTimeStr, TodayEndDatetimeStr } =
            dateFilter("Today"));

          break;

        case "Yesterday":
          ({ TodayStartDateTimeStr, TodayEndDatetimeStr } =
            dateFilter("Yesterday"));
          break;

        case "Last 7 Days":
          ({ TodayStartDateTimeStr, TodayEndDatetimeStr } =
            dateFilter("Last 7 Days"));
          break;

        case "Last 1 Month":
          ({ TodayStartDateTimeStr, TodayEndDatetimeStr } =
            dateFilter("Last 1 Month"));
          break;

        default:
          TodayStartDateTimeStr = null;
          TodayEndDatetimeStr = null;
      }

      DateFilterApiCall(TodayStartDateTimeStr, TodayEndDatetimeStr);
      // console.log(TodayStartDateTimeStr, TodayEndDatetimeStr);
    }
  };

  const DateFilterApiCall = async (startDate, endDate) => {
    console.log(startDate, endDate);
    if (
      startDate === "Invalid date+00:00" ||
      endDate === "Invalid date+00:00"
    ) {
      toast.error("Please select date range");
      return;
    }

    try {
      const payload = {
        startDate: startDate,
        endDate: endDate,
        AdminRole: adminuser.adminSignupData.AdminRole,
        user_id: adminuser.adminSignupData.user_id,
        page: String(page),
        limit: "10",
        event_id: _id,
      };

      console.log({ payload });

      const FetchEventData = await axios.post(
        `${booking.GET_PROMOTER_BOOKINGS}`,
        payload
      );

      setAllBookingData(FetchEventData.data.data.latestBookingData);
      setTotalPages(FetchEventData.data.data.totalPages);
      toast.success(FetchEventData.data.message);
      setIsOpen(false);
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
          SetallEventsData([]);
        }
      }
    }
  };

  const handleManualDateChange = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const DownloadReportHandler = async () => {
    let response;
    try {
      if (selectedBookingType === 1) {
        // Change this condition to 1
        // Prepare the payload for Summary Booking
        if (allBookingData.length === 0) {
          toast.error("No Booking data found for this event.");
          return;
        }

        const payload = {
          AdminRole: adminuser.adminSignupData.AdminRole,
          user_id: adminuser.adminSignupData.user_id,
          event_id: _id,
          ...filters,
        };

        if (searchTerm && searchTerm.length >= 3) {
          payload.searchKeyword = searchTerm;
        }

        // console.log("payload", payload);
        response = await axios.post(
          `${organizerEndpoint.DOWNLOAD_EXECEL_REPORT_OF_SUMMARY_BOOKING_FOR_ORGANIZER_ID}`,
          payload,
          { responseType: "blob" } // Ensure the response is treated as a Blob
        );
        console.log("1", response);
        //   console.log(response);
      } else if (selectedBookingType === 2) {
        // Keep this for type 2
        // Prepare the payload for Transaction Booking
        if (allBookingData.length === 0) {
          toast.error("No transaction data found for this event.");
          return;
        }

        const payload = {
          AdminRole: adminuser.adminSignupData.AdminRole,
          user_id: adminuser.adminSignupData.user_id,
          event_id: _id,
        };
        if (searchTerm && searchTerm.length >= 3) {
          payload.searchKeyword = searchTerm;
        }
        //   console.log(payload);

        response = await axios.post(
          `${booking.DOWNLOAD_PROMOTER_EXCEL}`,
          payload,
          { responseType: "blob" }
        );
        console.log("2", response);
      }

      // Handle the response, check if response exists before accessing data
      if (response && response.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "summary_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to download the report.");
      }
    } catch (error) {
      console.log(error);
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

  //   const DownloadReportHandler = async () => {
  //     try {
  //       let response;

  //       if (selectedBookingType === 1) {
  //         // Prepare the payload for Summary Booking

  //         if (eventTicketsData.length === 0) {
  //           toast.error("No Summary Booking data found for this event.");
  //           return;
  //         }

  //         const payload = {
  //           AdminRole: adminuser.adminSignupData.AdminRole,
  //           user_id: adminuser.adminSignupData.user_id,
  //           event_id: _id,
  //         };

  //         // Conditionally add `ticketName` if it exists
  //         if (storeFilterdDatePayload.ticketName) {
  //           payload.ticketName = storeFilterdDatePayload.ticketName;
  //         }

  //         // Conditionally add `eventDateTime_id` if it exists
  //         if (storeFilterdDatePayload.eventDateTime_id) {
  //           payload.eventDateTime_id = storeFilterdDatePayload.eventDateTime_id;
  //         }

  //         // console.log({ payload });

  //         // Call the API for Summary Booking
  //         response = await axios.post(
  //           organizerEndpoint.DOWNLOAD_EXECEL_REPORT_OF_SUMMARY_BOOKING_FOR_ORGANIZER_ID,
  //           payload,
  //           { responseType: "blob" } // Ensure the response is treated as a Blob
  //         );
  //       } else if (selectedBookingType === 2) {
  //         // Prepare the payload for Transaction Booking

  //         if (allTransactionBookingData.length === 0) {
  //           toast.error("No transaction data found for this event.");
  //           return;
  //         }

  //         const payload = {
  //           AdminRole: adminuser.adminSignupData.AdminRole,
  //           user_id: adminuser.adminSignupData.user_id,
  //           event_id: _id,
  //         };

  //         // Add searchKeyword if searchTerm is not empty
  //         if (searchTerm && searchTerm.length >= 3) {
  //           payload.searchKeyword = searchTerm;
  //         }

  //         // Call the API for Transaction Booking
  //         response = await axios.post(
  //           `${booking.DOWNLOAD_PROMOTER_EXCEL}`,
  //           payload,
  //           { responseType: "blob" } // Ensure the response is treated as a Blob
  //         );
  //       }

  //       // Handle the response, which should be a Blob for the XLSX file
  //       const blob = new Blob([response.data], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute(
  //         "download",
  //         `${
  //           selectedBookingType === 1 ? "Summary Report" : "Transaction Report"
  //         }_Report.xlsx`
  //       );
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);
  //     } catch (error) {
  //       if (error.response) {
  //         const { status, data } = error.response;
  //         if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
  //           toast.error(data.message);
  //         }
  //       } else {
  //         toast.error("An unexpected error occurred.");
  //       }
  //     }
  //   };

  const handleManualSubmit = () => {
    const startdate = `${moment(startDate)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss")}+00:00`;
    const enddate = `${moment(endDate)
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss")}+00:00`;
    console.log(startdate, enddate);
    DateFilterApiCall(startdate, enddate);
  };

  const handleReset = () => {
    setSelectedVenue(null);
    setSelectedOrganizer(null);
    setSelectedPromoter(null);
    setSelectedCity(null);
    setOpenFilteredPop(false);
    setAllBookingData(originalData);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

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
          searchkeyword: debouncedSearchTerm,
          page: String(page),
          limit: "10",
          AdminRole: adminuser.adminSignupData.AdminRole,
          user_id: adminuser.adminSignupData.user_id,
          event_id: _id,
        };
        console.log(payload);

        let response = await axios.post(
          `${booking.GET_PROMOTER_BOOKINGS}`,
          payload
        );
        console.log(response.data.data);
        setAllBookingData(response.data.data.latestBookingData);
        setTotalPages(response.data.data.totalPages);
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
      setAllBookingData(originalData);
    }
  }, [debouncedSearchTerm, originalData]);

  const getAllEventReportDataByEventID = async () => {
    //  console.log("hello summary ");

    try {
      const Payload = {
        AdminRole: adminuser.adminSignupData.AdminRole,
        user_id: adminuser.adminSignupData.user_id,
        event_id: _id,
      };

      const FetchEventTicketsReport = await axios.post(
        `${organizerEndpoint.GET_ALL_SUMMARY_BOOKING_DATA_BY_EVENT_AND_ORGANIZER_ID}`,
        Payload
      );

      // console.log(FetchEventTicketsReport.data.data.TicketsData);
      console.log(FetchEventTicketsReport.data.data);
      setEventTicketsData(FetchEventTicketsReport.data.data.TicketsData);
      setTicketNameFilterData(
        FetchEventTicketsReport.data.data.TicketNamesArray
      );

      const EventDateFormatting =
        FetchEventTicketsReport.data.data.EventDateTimeData;
      const formattedEventData = await transformEventDateTime(
        EventDateFormatting
      );

      setStoreFilterDates(formattedEventData);

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

  const [selectedEventType, setSelectedEventType] = useState("All");
  console.log(selectedEventType);
  const renderComponent = () => {
    switch (selectedEventType) {
      case "All":
        return (
          <All
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
          />
        );

      case "Promoter":
        return (
          <Promoter
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
          />
        );
      case "Online":
        return (
          <Online
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
          />
        );

      case "Bulk":
        return (
          <Bulk
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
            allBookingData={allBookingData}
            selectedBookingType={selectedBookingType}
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
    <>
      <div>
        <Toaster />
        <div className="w-[94%] md:ml-6">
          <div className="flex md:flex-row flex-col justify-between">
            <h1 className="md:text-4xl  text-2xl mt-5 mb-6 font-bold text-black">
              Bookings
            </h1>
            {selectedBookingType === 1 && (
              <div className="flex gap-4 md:mt-5 mb-6">
                <button
                  onClick={() => navigate("/superAdmin/dashboard/event")}
                  className="border border-[#666666] w-32 text-[#666666] py-2 px-4 rounded"
                >
                  Back
                </button>
                <button
                  onClick={DownloadReportHandler}
                  className="bg-[#666666]  md:w-56 text-white py-2 px-4 rounded"
                >
                  Download Report{" "}
                </button>
              </div>
            )}
          </div>

          <div className="w-[100%]  flex  justify-between">
            <div className="flex md:flex-row flex-col gap-4 w-[100%]">
              <div className="md:w-[30%] mt-2">
                <buttonborder
                  border-Gray40
                  rounded-lg
                  id="dropdownDelayButton"
                  onClick={toggleDropdownByBooking}
                  className="text-Gray40 w-[100%] justify-between pl-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40 "
                  type="button"
                >
                  {selectedBookingType === 1
                    ? "Summary Booking "
                    : "Transaction Booking"}
                  <span className="pr-3">
                    {dropdownVisibleBooking ? (
                      <IoIosArrowUp size={16} />
                    ) : (
                      <IoIosArrowDown size={16} />
                    )}
                  </span>
                </buttonborder>

                <ul
                  id="dropdownDelay"
                  className={`w-[100%] right-0 mt-2 z-10 ${
                    dropdownVisibleBooking ? "" : "hidden"
                  } bg-white divide-y divide-gray-100 rounded-lg shadow w-56 dark:bg-gray-700`}
                >
                  <div
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDelayButton"
                  >
                    {BookingTypeOption.map((data, index) => (
                      <div
                        key={data.id}
                        onClick={() => handleBookingFilter(data.value, index)}
                      >
                        <li>
                          <p
                            className={`block cursor-pointer text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                              selectedBookingType === data.value
                                ? "bg-gray-200 dark:bg-gray-500"
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

              {selectedBookingType === 1 && (
                <div className=" gap-x-4   flex md:justify-end">
                  <div className="relative text-center mt-[3%]">
                    <button
                      id="dropdownDelayButton"
                      onClick={toggleDropdownName}
                      className="text-Gray40 w-full px-2 py-2  focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg  text-center inline-flex items-center border border-Gray40"
                      type="button"
                    >
                      <span>
                        <CiFilter size={22} />
                      </span>
                      Name Filter
                    </button>
                    <ul
                      id="dropdownDelay"
                      className={`absolute md:right-0   -right-24z mt-2 z-10 ${
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
                            onClick={() =>
                              handleNameFilter("resetAllNames", null)
                            }
                            className="block px-4 py-2 hover:bg-gray-100 text-start dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Reset Filter
                          </Link>
                        </li>
                      </div>
                    </ul>
                  </div>

                  <div className="relative text-center mt-[3%]">
                    <button
                      id="dropdownDelayButton"
                      onClick={toggleDropdown}
                      className="text-Gray40 w-full px-2 py-2 focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg  text-center inline-flex items-center border border-Gray40"
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
              )}
            </div>

            {/* <div className="flex gap-x-4 mt-2">
              <div onClick={openEventFilterPopUp} className=" px-3 py-1 ">
                <button className=" border-[2px] border-Gray40 p-2">
                  <TbFilter size={30} color="gray" />
                </button>
              </div>

              {isManual && (
                <div className="flex">
                  <input
                    type="date"
                    className="mr-3 h-12 px-2 border border-gray-300 rounded-lg"
                    value={startDate}
                    onChange={(e) => handleManualDateChange(e, "start")}
                  />
                  <input
                    type="date"
                    className="border  h-12 px-2 border-gray-300 rounded-lg"
                    value={endDate}
                    onChange={(e) => handleManualDateChange(e, "end")}
                  />
                  <button
                    onClick={handleManualSubmit}
                    className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}

              <div className="relative inline-block text-left">
                <button
                  id="dropdownDefaultButton"
                  onClick={toggleDropdownFiltered}
                  className="text-semiBlack  border-[2px] border-semiBlack   font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center "
                  type="button"
                >
               Select Date
                  <BsChevronDown
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id="dropdown"
                    className="z-10 absolute right-0 mt-2 w-44  bg-white  divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {dropdownOptions.map((option, index) => (
                        <>
                          <li
                            onClick={() => handleDateSelection(option.Value)}
                            key={index}
                          >
                            <span className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                              {option.Value}
                            </span>
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>

        {/* <Promoter  /> */}
      </div>

      {selectedBookingType === 2 && renderComponent()}
      {selectedBookingType === 1 && (
        <Summary eventTicketsData={eventTicketsData} />
      )}
    </>
  );
};

export default EventBookingAdmin;
