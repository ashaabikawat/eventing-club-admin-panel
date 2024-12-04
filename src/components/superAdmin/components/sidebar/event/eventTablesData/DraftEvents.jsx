import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  eventEndPoint,
  getallcityDataEndPoint,
  organizerEndpoint,
  promoterEndpoint,
  venueEndPoint,
} from "../../../../../../services/apis";
import axios from "axios";
import { useSelector } from "react-redux";
import { formatDate2 } from "../../../../../common/formatDate2";
import { IoIosCloseCircle } from "react-icons/io";
import { GrMoreVertical } from "react-icons/gr";

import { TbFilter } from "react-icons/tb";
import AddPromoterAndShow from ".././EventTable/AddPromoterAndShow";
import {
  EventVisibilityText,
  getEventStatusText,
} from "../../../../../common/EventVisibilityText";
import { useNavigate } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";
import { dropdownOptions } from "../modalCrationData/modalOpen";
import Select from "react-select";
import moment from "moment-timezone";
import { dateFilter } from "../../../../../common/datefilter";
import { limit } from "../../../../../common/helper/Enum";
import { Pagination } from "@mui/material";

const DraftEvents = () => {
  const adminuser = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [allEventsData, SetallEventsData] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Organizer States
  const [openOrganizerPopUp, setOpenOrganizerPopUp] = useState(false);
  const [organizerData, setOrganizerData] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  const [customDate, setCustomDate] = useState(false);
  const [openFilteredPop, setOpenFilteredPop] = useState(false);

  const [venues, setVenues] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [selectedPromoter, setSelectedPromoter] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // serach state
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Date Filtered
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isManual, setIsManual] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [originalTotalPage, setOriginalTotalPage] = useState(1);

  const [filters, setFilters] = useState({});
  const [eventToggle, setEventToggle] = useState(false);
  const enableDisable = {
    Enable: 1,
    Disable: 2,
  };

  const handlePaginationChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleEnable = async () => {
    console.log("enable clicked", openDropdownId);

    try {
      const payload = {
        event_id: openDropdownId,
      };

      const response = await axios.post(
        `${eventEndPoint.ENABLE_EVENT}`,
        payload
      );
      toast.success(response.data.message);
      setEventToggle((prev) => !prev);
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

    setOpenDropdownId(null);
  };

  const handleDisable = async () => {
    console.log("Disable clicked", openDropdownId);

    try {
      const payload = {
        event_id: openDropdownId,
      };

      const response = await axios.post(
        `${eventEndPoint.DISABLE_EVENT}`,
        payload
      );
      toast.success(response.data.message);
      setEventToggle((prev) => !prev);
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

    setOpenDropdownId(null);
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const handleViewEdit = (eventId) => {
    navigate(`/superAdmin/dashboard/event/edit/${eventId}`);
    setOpenDropdownId(null);
  };

  const handleViewAddTickets = (eventId, eventStatus) => {
    // if (
    //   eventStatus === 1 ||
    //   eventStatus === 2 ||
    //   eventStatus === 4 ||
    //   eventStatus === 6
    // ) {
    //   toast.error("Please select a Published or ReviewApproved event");
    //   return;
    // } else {
    navigate(`/superAdmin/dashboard/event/edit-booking/${eventId}`);
    // }
  };

  const handleEditBooking = () => {
    navigate(`/superAdmin/dashboard/event/booking/${eventId}`);
    // setIsDropdownOpen(false);
  };

  useEffect(() => {
    getALLEventData();
  }, [eventToggle, page]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      getALLEventData();
    }
  }, [filters, page]);

  const getALLEventData = async () => {
    try {
      const payload = {
        AdminRole: adminuser.adminSignupData.AdminRole,
        user_id: adminuser.adminSignupData.user_id,
        page: String(page),
        limit: String(limit),
        ...filters,
      };

      const FetchEventData = await axios.post(
        `${eventEndPoint.GET_DRAFT_EVENTS_PAGINATION}`,
        payload
      );

      // console.log("FetchEventData", FetchEventData.data);
      SetallEventsData(FetchEventData.data.data.EventsData);
      setCount(FetchEventData.data.data.totalPages);

      if (page === 1 && filters && Object.keys(filters).length === 0) {
        setOriginalData(FetchEventData.data.data.EventsData); // Store initial booking data
        setOriginalTotalPage(FetchEventData.data.data.totalPages); // Store initial total page count
      }

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

  const handlerOpenOrganizerPopUp = (organizer) => {
    setOrganizerData(organizer);
    setOpenOrganizerPopUp(true);
  };

  const toggleDropdownFiltered = () => {
    setIsOpen(!isOpen);
  };

  const openEventFilterPopUp = () => {
    setOpenFilteredPop(true);
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
      setOrganizers(FetchOrganizerData.data.data);
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

  const handleReset = () => {
    setSelectedVenue(null);
    setSelectedOrganizer(null);
    setSelectedPromoter(null);
    setSelectedCity(null);
    setOpenFilteredPop(false);
    setFilters({});
    setPage(1);
    SetallEventsData(originalData);
    setCount(originalTotalPage);
  };

  const handleSearch = async (isNewSearch = false) => {
    if (isNewSearch) {
      setPage(1);
    }

    if (
      selectedVenue === null &&
      selectedOrganizer === null &&
      selectedPromoter === null &&
      selectedCity === null
    ) {
      return toast.error("Please select at least one filter");
    }

    // Initialize a new filters object
    let newFilters = { ...filters };

    // Add filters only if they are selected (not null)
    // if (selectedEventNames) {
    //   newFilters.event_id = selectedEventNames.value;
    // }
    if (selectedOrganizer) {
      newFilters.organizer_id = selectedOrganizer.value;
    }

    if (selectedPromoter) {
      newFilters.promoter_id = selectedPromoter.value;
    }
    if (selectedCity) {
      newFilters.CityName = selectedCity.value;
    }

    if (selectedVenue) {
      newFilters.venue_id = selectedVenue.value;
    }
    setFilters(newFilters);

    // Close the filtered popup
    setOpenFilteredPop(false);

    // getALLEventData();
  };

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  // serach function
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
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
          eventNameSearchKeyword: debouncedSearchTerm.trim(),
        }));
      }
    };

    if (debouncedSearchTerm !== "") {
      fetchData();
    } else {
      // Reset search if search term is empty
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.eventNameSearchKeyword;
        return newFilters;
      });
      SetallEventsData(originalData);
      setCount(originalTotalPage);
    }
  }, [debouncedSearchTerm]);

  // Date Filted function
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
    if (
      startDate === "Invalid date+00:00" ||
      endDate === "Invalid date+00:00"
    ) {
      toast.error("Please select date range");
      return;
    }

    setStartDate(startDate);
    setEndDate(endDate);

    let newFilters = { ...filters };

    if (startDate && endDate) {
      newFilters.startDate = startDate;
      newFilters.endDate = endDate;
    }

    setFilters(newFilters);
  };

  const handleManualDateChange = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleManualSubmit = () => {
    const startdate = `${moment(startDate)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss")}+00:00`;
    const enddate = `${moment(endDate)
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss")}+00:00`;
    // console.log(startdate, enddate);
    DateFilterApiCall(startdate, enddate);
  };

  return (
    <div>
      <Toaster />
      <div className="w-[96%] mx-auto">
        <div className="mt-6 md:mt-6 w-[100%] flex gap-4  flex-col justify-between">
          <div className="relative flex items-center md:w-[40%] w-[80%] h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
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
              placeholder="Search By Event Name"
            />
          </div>

          <div className="flex   md:mt-0 mt-4 gap-x-4">
            <div onClick={openEventFilterPopUp} className="  ">
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
                  className="md:ml-3 md:px-4 px-2 py-2 bg-blue-500 text-white rounded-lg"
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
                  className="z-10 absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    {dropdownOptions.map((option, index) => (
                      <li
                        onClick={() => handleDateSelection(option.Value, true)}
                        key={index}
                      >
                        <span className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          {option.Value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto border-b-2 pb-4 border-Gray85 mt-8 md:mt:0">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
          {!loading && (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {/* <th scope="col" className="p-4"></th> */}
                  <th scope="col" className="px-6 py-3">
                    Event Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Organizer
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Promoter
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Visibility
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Venue
                  </th>
                  <th scope="col" className="px-6 py-3">
                    City
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allEventsData?.map((eventData, index) => {
                  const isLastTwoRows =
                    allEventsData.length > 2 &&
                    index >= allEventsData.length - 2;
                  return (
                    <tr
                      key={eventData._id}
                      className={` ${
                        eventData.EventIsEnableOrDisable !==
                        enableDisable.Enable
                          ? "bg-red-200"
                          : "bg-white hover:bg-gray-50 dark:hover:bg-gray-600"
                      } border-b dark:bg-gray-800 dark:border-gray-700 `}
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
                        {eventData.EventName}
                      </th>
                      <td className=" w-24 py-4">
                        {eventData?.arrangedEventDateTime[0]?.EventStartDateTime
                          ? new Date(
                              eventData.arrangedEventDateTime[0].EventStartDateTime
                            ).toLocaleDateString("en-In", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              timeZone: "UTC", // Specify UTC to avoid local time zone conversion
                            })
                          : "N/A"}
                      </td>
                      <td className="pl-4 w-24 py-4">
                        {eventData?.arrangedEventDateTime[0]?.EventStartDateTime
                          ? new Date(
                              eventData.arrangedEventDateTime[0].EventStartDateTime
                            ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "UTC", // Specify UTC to avoid local time zone conversion
                            })
                          : "N/A"}
                      </td>
                      <td className="pl-4 py-4">{eventData.categoryName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center cursor-pointer">
                          {eventData?.PopUpOrganizerData?.map(
                            (organizer, index) => {
                              if (index < 4) {
                                return (
                                  <div
                                    key={index}
                                    onClick={() =>
                                      handlerOpenOrganizerPopUp(
                                        eventData.PopUpOrganizerData
                                      )
                                    }
                                    className="w-5 h-5 bg-Gray85 border border-white rounded-full -mx-0.5"
                                  />
                                );
                              }
                              return null;
                            }
                          )}
                          {eventData?.PopUpOrganizerData?.length > 4 && (
                            <span className="mx-1">
                              +{eventData?.PopUpOrganizerData?.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AddPromoterAndShow eventData={eventData} />
                      </td>
                      <td className="pl-6 py-4">
                        {EventVisibilityText(eventData.EventVisibility)}
                      </td>
                      <td className="pl-6 py-4">{eventData.VenueName}</td>
                      <td className="pl-6 py-4">
                        {eventData.VenueEventFlag
                          ? eventData.VenueCity
                          : eventData.VenueToBeAnnounced
                          ? eventData.VenueToBeAnnouncedCity
                          : "-"}
                      </td>
                      <td className="pl-6 py-4">
                        {getEventStatusText(eventData.EventStatus)}
                      </td>

                      <td className="px-6 py-4 relative">
                        <p
                          onClick={() => toggleDropdown(eventData._id)}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                        >
                          <GrMoreVertical size={25} />
                        </p>
                        {openDropdownId === eventData._id && (
                          <div
                            className={`absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ${
                              isLastTwoRows
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                            style={{
                              right: isLastTwoRows ? "70%" : "78%",
                              top: isLastTwoRows ? "auto" : "10%", // 'auto' for last two rows to align above
                              bottom: isLastTwoRows ? "10%" : "auto", // set bottom when one of the last two rows
                            }}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleViewEdit(eventData._id)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                View & Edit
                              </button>
                              <button
                                onClick={() => handleEditBooking(eventData._id)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Booking
                              </button>
                              <button
                                onClick={() =>
                                  handleViewAddTickets(
                                    eventData._id,
                                    eventData.EventStatus
                                  )
                                }
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                View & Add Tickets
                              </button>
                              {eventData.EventIsEnableOrDisable !==
                              enableDisable.Enable ? (
                                <button
                                  onClick={handleEnable}
                                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                >
                                  Enable
                                </button>
                              ) : (
                                <button
                                  onClick={handleDisable}
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
          )}
        </div>
      </div>

      {openOrganizerPopUp && (
        <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-4 rounded-md md:w-[40%] sm:w-[70%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Organizers</h2>
              <IoIosCloseCircle
                size={24}
                className="cursor-pointer"
                onClick={() => setOpenOrganizerPopUp(false)}
              />
            </div>
            <div className="flex flex-wrap">
              {organizerData.map((organizer, index) => (
                <div key={index} className="flex items-center w-1/2 mb-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  <p>{organizer.OrganizerName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              <div className="flex w-full md:flex-row flex-col mt-4 gap-x-5 justify-between">
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
                      value: venue._id,
                      label: venue.Name,
                    }))}
                    value={selectedVenue}
                    onChange={setSelectedVenue}
                    placeholder="Select Venue"
                    isClearable
                  />
                </div>
              </div>

              <div className="flex w-full md:flex-row flex-col mt-2 gap-x-5 justify-between">
                <div className="md:w-[50%]">
                  <label htmlFor="">Organizer</label>
                  <Select
                    styles={dropdownStyles}
                    options={organizers.map((organizer) => ({
                      value: organizer._id,
                      label: organizer.Username,
                    }))}
                    value={selectedOrganizer}
                    onChange={setSelectedOrganizer}
                    placeholder="Select Organizer"
                    isClearable
                  />
                </div>

                <div className="md:w-[50%]">
                  <label htmlFor="">Promoter</label>
                  <Select
                    styles={dropdownStyles}
                    options={promoters.map((promoter) => ({
                      value: promoter._id,
                      label: promoter.Username,
                    }))}
                    value={selectedPromoter}
                    onChange={setSelectedPromoter}
                    placeholder="Select Promoter"
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
      <div className="flex justify-end items-center mt-6">
        <Pagination
          count={count}
          page={page}
          onChange={handlePaginationChange}
          shape="rounded"
          size="large"
        />
      </div>
    </div>
  );
};

export default DraftEvents;
