import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { TbFilter } from "react-icons/tb";
import { BsChevronDown } from "react-icons/bs";
import { dropdownOptions } from "../../../../superAdmin/components/sidebar/event/modalCrationData/modalOpen";
import Select from "react-select";
import { dateFilter } from "../../../../common/datefilter";
import moment from "moment-timezone";
import {
  booking,
  eventEndPoint,
  getallcityDataEndPoint,
  organizerEndpoint,
  promoterEndpoint,
  venueEndPoint,
} from "../../../../../services/apis";
import { useSelector } from "react-redux";
import Loading from "../../../../common/Loading";
import { bookingStatus, limit } from "../../../../common/helper/Enum";
import { Pagination } from "@mui/material";

const Promoter = ({ setSelectedEventType, selectedEventType }) => {
  const tabs = [
    { id: 1, value: 1, EventType: "All" },
    { id: 2, value: 2, EventType: "Promoter" },
    { id: 3, value: 3, EventType: "Online" },
  ];

  const { _id } = useParams();

  const [page, setPage] = useState(1);

  const [count, setCount] = useState(1);
  const [originalTotalPage, setOriginalTotalPage] = useState(1);

  const [downloadExcel, setDownloadExcel] = useState(0);

  const [allBookingData, setAllBookingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilteredPop, setOpenFilteredPop] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [completedEventsName, setCompletedEventsName] = useState([]);
  const [venues, setVenues] = useState([]);

  const [selectedReportType, setSelectedReportType] = useState("");

  const [selectedCity, setSelectedCity] = useState();
  const [selectedEventNames, setSelectedEventNames] = useState();
  const [selectedVenue, setSelectedVenue] = useState();
  const [selectedPromoter, setSelectedPromoter] = useState();
  const [selectedOrganizer, setSelectedOrganizer] = useState();

  const [filters, setFilters] = useState({});

  const organizerId = useSelector((store) => store.organizerauth);

  const handlePaginationChange = (_, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getBookingData();
  }, [page]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      getBookingData();
    }
  }, [filters, page]);

  const getBookingData = async () => {
    const payload = {
      AdminRole: organizerId.organizerSignupData.AdminRole,
      user_id: organizerId.organizerSignupData.user_id,
      page: String(page),
      limit: String(limit),
      organizer_id: organizerId.organizerSignupData.user_id,
      ...filters,
    };
    console.log(payload);
    try {
      const fetchBooking = await axios.post(
        `${booking.GET_PROMOTER_BOOKINGS}`,
        payload
      );
      console.log(fetchBooking.data.data);

      setAllBookingData(fetchBooking.data.data.latestBookingData);

      setCount(fetchBooking.data.data.totalPages);

      if (page === 1 && filters && Object.keys(filters).length === 0) {
        setOriginalData(fetchBooking.data.data.latestBookingData); // Store initial booking data
        setOriginalTotalPage(fetchBooking.data.data.totalPages); // Store initial total page count
      }

      setLoading(false);
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
          setLoading(false);
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

  useEffect(() => {
    if (openFilteredPop) {
      // getAllVenueData();
      getAllOrganizerData();
      // getAllPromoterData();
      // getAllCityData();
      getAllPublishedEventNames();
      getAllVenuesCitiesPromotersData();
      getAllCompletedEvents();
    }
  }, [openFilteredPop]);
  const getAllVenuesCitiesPromotersData = async () => {
    const payload = {
      AdminRole: organizerId.organizerSignupData.AdminRole,
      user_id: organizerId.organizerSignupData.user_id,
      organizer_id: organizerId.organizerSignupData.user_id,
    };

    try {
      const fetchData = await axios.post(
        `${organizerEndpoint.GET_ALL_VENUES_CITIES_PROMOTERS}`,
        payload
      );

      setVenues(fetchData.data.data.EventVenues);
      setCities(fetchData.data.data.EventCities);
      setPromoters(fetchData.data.data.EventPromoters);
    } catch (error) {
      handleError(error);
    }
  };

  // const getAllVenueData = async () => {
  //   try {
  //     const FetchVenueData = await axios.get(
  //       `${venueEndPoint.ALL_VENUE_DATA_LIST}`
  //     );
  //     setVenues(FetchVenueData.data.data);
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

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

  // const getAllPromoterData = async () => {
  //   try {
  //     const FetchPromoterData = await axios.get(
  //       `${promoterEndpoint.GET_ALL_PROMOTER_DATA_URL}`
  //     );
  //     setPromoters(FetchPromoterData.data.data);
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  // const getAllCityData = async () => {
  //   try {
  //     const FetchCityData = await axios.post(
  //       `${getallcityDataEndPoint.GET_ALL_EVENT_CITY_DATA}`
  //     );
  //     setCities(FetchCityData.data.data);
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  const getAllPublishedEventNames = async () => {
    const payload = {
      AdminRole: organizerId.organizerSignupData.AdminRole,
      user_id: organizerId.organizerSignupData.user_id,
    };
    console.log(payload);
    try {
      const FetchEventData = await axios.post(
        `${eventEndPoint.GET_ALL_PUBLISHED_EVENTS_DATA}`,
        payload
      );
      console.log(FetchEventData.data.data);
      setEventNames(FetchEventData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCompletedEvents = async () => {
    const payload = {
      AdminRole: organizerId.organizerSignupData.AdminRole,
      user_id: organizerId.organizerSignupData.user_id,
    };
    // console.log(payload);
    try {
      const FetchEventData = await axios.post(
        `${eventEndPoint.COMPLETED_EVENTS}`,
        payload
      );
      // console.log("COMPLETED EVENTS", FetchEventData.data.data);

      setCompletedEventsName(FetchEventData.data.data);
      // console.log(...eventNames, ...FetchEventData.data.data);
      // setEventNames([...eventNames, ...FetchEventData.data.data]);
      // console.log([...eventNames, ...FetchEventData.data.data]);
    } catch (error) {
      console.log(error);
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

  const handleSearch = async (isNewSearch = false) => {
    if (isNewSearch) {
      setPage(1);
    }

    if (
      selectedVenue === null &&
      selectedOrganizer === null &&
      selectedPromoter === null &&
      selectedCity === null &&
      selectedEventNames === null
    ) {
      return toast.error("Please select at least one filter");
    }

    // Initialize a new filters object
    let newFilters = { ...filters };

    // Add filters only if they are selected (not null)
    if (selectedEventNames) {
      newFilters.event_id = selectedEventNames.value;
    }

    if (selectedOrganizer) {
      newFilters.organizer_id = selectedOrganizer.value;
    }

    if (selectedPromoter) {
      newFilters.promoter_id = selectedPromoter.value;
    }

    if (selectedCity) {
      newFilters.cityname = selectedCity.value;
    }

    if (selectedVenue) {
      newFilters.venue_id = selectedVenue.value;
    }

    setFilters(newFilters);

    // Close the filtered popup
    setOpenFilteredPop(false);

    // Optionally, call getBookingData to fetch the new filtered data
    getBookingData();
  };

  const toggleDropdownFiltered = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelection = (option, isNewSearch = false) => {
    if (isNewSearch) {
      setPage(1);
    }

    setIsManual(option === "Manual");
    setIsOpen(false);
    console.log({ option });
    if (option === "Reset") {
      handleReset();
    }

    if (option !== "Manual" && option !== "Reset") {
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

    // Set the selected start and end date in state

    // Validate the selected date range
    if (
      startDate === "Invalid date+00:00" ||
      endDate === "Invalid date+00:00"
    ) {
      toast.error("Please select a valid date range");
      return;
    }

    setStartDate(startDate);
    setEndDate(endDate);

    // Initialize a new filters object
    let newFilters = { ...filters }; // Copy the existing filters

    // Add date filters only if valid
    if (startDate && endDate) {
      newFilters.startDate = startDate;
      newFilters.endDate = endDate;
    }

    // else {
    //   // If either startDate or endDate is not valid or cleared, remove them from filters
    //   delete newFilters.startDate;
    //   delete newFilters.endDate;
    // }

    // Update the filters state
    setFilters(newFilters);
  };

  const handleManualDateChange = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const DownloadReportHandler = async () => {
    try {
      let response;

      // Prepare the payload for Summary Booking

      if (allBookingData.length === 0) {
        toast.error("No Booking data found for this event.");
        return;
      }

      const payload = {
        AdminRole: organizerId.organizerSignupData.AdminRole,
        user_id: organizerId.organizerSignupData.user_id,
        organizer_id: organizerId.organizerSignupData.user_id,
      };
      if (selectedVenue) payload.venue_id = selectedVenue.value;
      if (selectedOrganizer) payload.organizer_id = selectedOrganizer.value;
      if (selectedCity) payload.cityname = selectedCity.value;
      if (selectedEventNames) payload.event_id = selectedEventNames.value;
      if (selectedPromoter) payload.promoter_id = selectedPromoter.value;

      if (searchTerm && searchTerm.length >= 3) {
        payload.searchkeyword = searchTerm;
      }

      console.log(payload);

      // Call the API for Summary Booking
      response = await axios.post(
        `${booking.DOWNLOAD_PROMOTER_EXCEL}`,
        payload,
        { responseType: "blob" } // Ensure the response is treated as a Blob
      );
      console.log(response);

      // else if (selectedBookingType === 2) {
      //   // Prepare the payload for Transaction Booking

      //   if (allTransactionBookingData.length === 0) {
      //     toast.error("No transaction data found for this event.");
      //     return;
      //   }

      //   const payload = {
      //     promoter_id: promoterUser.promoterSignupData.user_id,
      //     event_id: eventData._id,
      //   };

      // Add searchkeyword if searchTerm is not empty

      //   //      // Call the API for Transaction Booking
      //   response = await axios.post(
      //     promoterEndPointPannel.DOWNLOAD_EXECEL_REPORT_OF_TRANSACTION_BOOKING,
      //     payload,
      //     { responseType: "blob" } // Ensure the response is treated as a Blob
      //   );
      // }

      // Handle the response, which should be a Blob for the XLSX file
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "promoters_Report.xlsx");
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
    setSelectedEventNames(null);
    setOpenFilteredPop(false);
    setFilters({});
    setPage(1);
    setAllBookingData(originalData);
    setCount(originalTotalPage);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchTerm.length < 3) {
        toast.error("Search keyword must be at least 3 characters long.");
        return;
      }

      if (debouncedSearchTerm.length >= 3) {
        setPage(1);
        setFilters((prev) => ({
          ...prev,
          searchkeyword: debouncedSearchTerm.trim(),
        }));
      }
    };

    if (debouncedSearchTerm !== "") {
      fetchData();
    } else {
      // Reset search if search term is empty
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.searchkeyword;
        return newFilters;
      });
      setAllBookingData(originalData);
      setCount(originalTotalPage);
    }
  }, [debouncedSearchTerm]);

  const handleCancel = async (id) => {
    const payload = {
      booking_id: id,
    };
    console.log(payload);
    try {
      const response = await axios.post(`${booking.CANCEL_BOOKINGS}`, payload);
      toast.success(response.data.message);
      setConfirmationModal(false);
      fetchPromoterBookings();
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleResend = async (id) => {
    const payload = {
      booking_id: id,
    };
    // console.log(payload);
    try {
      const response = await axios.post(`${booking.RESEND_BOOKINGS}`, payload);
      toast.success(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const AllEvents = [...eventNames, ...completedEventsName];

  return (
    <>
      <div>
        <Toaster />
        <div className="w-[94%]">
          <div className="flex justify-between">
            <h1 className="md:text-4xl text-2xl mt-5 mb-6 font-bold text-black">
              Bookings
            </h1>
            <div className="mt-5 mb-6">
              <button
                onClick={DownloadReportHandler}
                disabled={!allBookingData}
                className={`${
                  !allBookingData ? "cursor-not-allowed" : "cursor-pointer"
                } bg-[#666666]  md:w-56 text-white py-2 px-4 rounded`}
                // className="bg-[#666666]  w-56 text-white py-2 px-4 rounded"
              >
                Download Report{" "}
              </button>
            </div>
          </div>
          <div className="w-[100%]  flex  gap-4 flex-col justify-between">
            <div className="relative flex items-center md:w-[50%] h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
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
                placeholder="Search By Customer Name and Booking ID"
              />
            </div>

            <div className="flex md:mt-0 mt-4 gap-x-4">
              <div
                onClick={openEventFilterPopUp}
                // className=" px-3 py-1 border-[2px] border-Gray40 "
              >
                <button className="border-[2px] border-Gray40 p-2">
                  <TbFilter size={30} color="gray" />
                </button>
              </div>

              {isManual && (
                <div className="flex md:flex-row  gap-2 flex-col">
                  <input
                    type="date"
                    className="md:mr-3 h-12 px-2 border border-gray-300 rounded-lg"
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
                    className="md:ml-3 px-2 md:px-4 py-2 bg-blue-500 text-white rounded-lg"
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
                            onClick={() =>
                              handleDateSelection(option.Value, true)
                            }
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
            </div>
          </div>
        </div>
        {/* <Promoter  /> */}

        <div className="flex mt-8 gap-x-11 w-[100%] mx-auto">
          {tabs.map((event) => (
            <div key={event.id}>
              <button
                onClick={() => setSelectedEventType(event.EventType)}
                className={` px-2 py-1 ${
                  event.EventType === selectedEventType
                    ? "bg-gray-200 px-2 py-1 rounded-md"
                    : ""
                } `}
              >
                {event.EventType}
              </button>
            </div>
          ))}
        </div>

        {openFilteredPop && (
          <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-4 rounded-md md:w-[60%] lg:w-[50%] w-[90%]">
              <div className="flex justify-between">
                <h1 className="mt-2">Event Filter</h1>
                <button
                  className="bg-Gray40 text-white px-2 py-2"
                  onClick={handleReset}
                >
                  Reset All
                </button>
              </div>
              {/* Dropdowns */}
              <div className="">
                <div className="flex md:flex-row flex-col  w-full mt-4 gap-x-5 justify-between">
                  <div className="md:w-[50%]">
                    <label htmlFor="">City</label>
                    <Select
                      styles={dropdownStyles}
                      options={cities.map((city) => ({
                        value: city.CityName,
                        label: city.CityName,
                      }))}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Select City"
                      isClearable
                    />
                  </div>

                  <div className="md:w-[50%]">
                    <label htmlFor="">Venue</label>
                    <Select
                      styles={dropdownStyles}
                      options={venues.map((venue) => ({
                        value: venue.venue_id,
                        label: venue.VenueName,
                      }))}
                      value={selectedVenue}
                      onChange={setSelectedVenue}
                      placeholder="Select Venue"
                      isClearable
                    />
                  </div>
                </div>
                <div className="flex w-full md:flex-row flex-col  mt-4 gap-x-5 justify-between">
                  {/* <div className="w-[50%]">
                    <label htmlFor="">Organizers</label>
                    <Select
                      styles={dropdownStyles}
                      options={organizer.map((organizer) => ({
                        value: organizer._id,
                        label: organizer.Username,
                      }))}
                      value={selectedOrganizer}
                      onChange={setSelectedOrganizer}
                      placeholder="Select Organizer"
                      isClearable
                    />
                  </div> */}

                  <div className="md:w-[50%]">
                    <label htmlFor="">Promoters</label>
                    <Select
                      styles={dropdownStyles}
                      options={promoters.map((promoter) => ({
                        value: promoter.promoter_id,
                        label: promoter.PromoterUsername,
                      }))}
                      value={selectedPromoter}
                      onChange={setSelectedPromoter}
                      placeholder="Select Promoter"
                      isClearable
                    />
                  </div>

                  <div className="md:w-[50%]">
                    <label htmlFor="">Event Name</label>
                    <Select
                      styles={dropdownStyles}
                      options={AllEvents.map((name) => ({
                        value: name._id,
                        label: name.EventName,
                      }))}
                      value={selectedEventNames}
                      onChange={setSelectedEventNames}
                      placeholder="Select Event names"
                      isClearable
                    />
                  </div>
                </div>
              </div>
              {/* Search Button */}
              <div className="w-full flex justify-end gap-x-4">
                <button
                  className="mt-4 w-[25%] border-2 border-Gray40  text-black p-2 rounded-md"
                  onClick={() => setOpenFilteredPop(false)}
                >
                  Close
                </button>
                <button
                  className="mt-4 w-[25%] bg-Gray40 text-white p-2 rounded-md"
                  onClick={() => handleSearch(true)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-[100%] mx-auto border-b-2 pb-4 border-Gray85 mt-6 md:mt-0">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[4%]">
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
                  phone No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Booking Date & Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Event
                </th>
                <th scope="col" className="px-6 py-3">
                  Ticket date
                </th>
                <th scope="col" className="px-6 py-3">
                  City
                </th>
                <th scope="col" className="px-10 py-3">
                  Venue
                </th>
                <th scope="col" className="px-6 py-3">
                  Promoter name
                </th>
                <th scope="col" className="px-4 py-3">
                  Quantity
                </th>
                {/* <th scope="col" className="px-4 py-3">
                  Check in
                </th> */}
                <th scope="col" className="px-2 py-3">
                  Ticket Name
                </th>
                <th scope="col" className="px-10 py-3">
                  Ticket type
                </th>
                <th scope="col" className="px-6 py-3">
                  Ticket price
                </th>
                <th scope="col" className="px-8 py-3">
                  Total amount
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  Actions
                </th> */}
              </tr>
            </thead>
            {loading ? (
              <div className="flex  justify-center items-center  w-full mt-6 mb-12">
                {" "}
                <Loading />
              </div>
            ) : (
              <tbody>
                {allBookingData?.length >= 1 ? (
                  allBookingData?.map((eventData, index) => (
                    <tr
                      key={eventData._id}
                      className={`${
                        eventData.status === bookingStatus.Cancelled
                          ? "bg-red-200"
                          : "bg-white hover:bg-gray-50 dark:hover:bg-gray-600"
                      } border-b dark:bg-gray-800 dark:border-black`}
                      // className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {eventData.CustomerName}
                      </th>
                      <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                        {eventData.Booking_id}
                      </td>

                      <td className="pl-4 py-4">{eventData.PhoneNumber}</td>
                      <td className=" pl-4 py-4">{eventData.Email}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {eventData?.BookingDateTime?.split(" ")[0]}{" "}
                        {eventData?.BookingDateTime?.split(" ")[1]}
                      </td>
                      <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                        {eventData.EventName}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                        {new Date(eventData.TicketDate).toLocaleDateString(
                          "en-In",
                          {
                            day: "numeric",
                            month: "short", // Use "short" to get the abbreviated month name like "Feb"
                            year: "numeric",
                            timeZone: "UTC", // Ensure the date is in UTC
                          }
                        )}
                      </td>
                      <td className="pl-4 py-4 px-6">
                        {eventData.EventCityName
                          ? eventData.EventCityName
                          : "-"}
                      </td>
                      <td className="pl-10 py-2 px-6">
                        {eventData.EventVenueName
                          ? eventData.EventVenueName
                          : "-"}
                      </td>
                      <td className="pl-6 py-4">{eventData.PromoterName}</td>
                      <td className="pl-10 py-4">{eventData.TicketQuantity}</td>
                      {/* <td className="pl-6 py-4">
                        {eventData.CheckIn ? eventData.CheckIn : "-"}
                      </td> */}
                      <td className="pl-2 py-4">{eventData.TicketName}</td>
                      <td className="pl-10 py-4">
                        {eventData.EventTicketType}
                      </td>
                      <td className="pl-6 py-4">{eventData.TicketPrice}</td>
                      <td className="pl-8 py-4">{eventData.TotalAmount}</td>
                      {/* <td className="pr-6 py-4">
                        <div className="flex gap-2">
                          <span
                            className="cursor-pointer"
                            onClick={() => handleCancel(eventData.Booking_id)}
                          >
                            Cancel
                          </span>
                          <span
                            className="underline cursor-pointer "
                            onClick={() => handleResend(eventData.Booking_id)}
                          >
                            Resend
                          </span>
                        </div>
                      </td> */}
                      <td className="pl-2 pr-14 py-4">
                        {eventData.status !== bookingStatus.Booked
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
            )}
          </table>
        </div>
      </div>
      <div className="flex justify-end items-center mt-6">
        <Pagination
          count={count}
          page={page}
          onChange={handlePaginationChange}
          shape="rounded"
          size="large"
        />
      </div>
    </>
  );
};

export default Promoter;
