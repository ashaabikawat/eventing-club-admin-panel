import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { promoterEndPointPannel } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import { IoMdTime } from "react-icons/io";
import { FaMapLocation } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { dateFilter } from "../../../../common/datefilter";

const EventPromoter = () => {
  const promoterUser = useSelector((store) => store.promoterauth);
  const navigate = useNavigate();

  const [allEventsData, setAllEventData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    getAllEventsData();
  }, []);

  const getAllEventsData = async () => {
    try {
      const payload = {
        AdminRole: promoterUser.promoterSignupData.AdminRole,
        user_id: promoterUser.promoterSignupData.user_id,
      };

      const FetchEventData = await axios.post(
        `${promoterEndPointPannel.GET_ALL_EVENTS_DATA_BY_PROMOTER}`,
        payload
      );

      console.log("FetchEventData", FetchEventData.data);
      setAllEventData(FetchEventData.data.data);
      setOriginalData(FetchEventData.data.data);
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

  const handlerBookTickets = (event) => {
    console.log(event);

    const eventId = event._id;
    const arrangedEventDateTime = event.arrangedEventDateTime;
    const eventName = event.EventName;
    const seasonPass = event.SeasonPassCount;
    const venueCity = event.VenueCity;

    navigate(`/promoter/dashboard/event/booking-tickets/${eventId}`, {
      state: {
        arrangedEventDateTime,
        eventId,
        eventName,
        seasonPass,
        venueCity,
      },
    });
  };

  const handleChange = (e) => {
    console.log(e.target.value);
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
          return; // Do nothing if less than 3 characters
        }

        const payload = {
          AdminRole: promoterUser.promoterSignupData.AdminRole,
          user_id: promoterUser.promoterSignupData.user_id,
          eventNameSearchKeyword: debouncedSearchTerm,
        };

        let response = await axios.post(
          `${promoterEndPointPannel.GET_ALL_EVENTS_DATA_BY_PROMOTER}`,
          payload
        );

        setAllEventData(response.data.data);
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
      setAllEventData(originalData);
    }
  }, [debouncedSearchTerm, originalData]);

  const handleDateSelection = (option) => {
    if (option === "Reset") {
      setAllEventData(originalData);
      return;
    }

    setIsManual(option === "Manual");

    if (option !== "Manual") {
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

  const handleManualDateChange = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleManualSubmit = () => {
    DateFilterApiCall(startDate, endDate);
  };

  const DateFilterApiCall = async (startDateApiCall, endDateApiCall) => {
    try {
      const payload = {
        AdminRole: promoterUser.promoterSignupData.AdminRole,
        user_id: promoterUser.promoterSignupData.user_id,
        startDate: startDateApiCall,
        endDate: endDateApiCall,
      };

      const FetchEventData = await axios.post(
        `${promoterEndPointPannel.GET_ALL_EVENTS_DATA_BY_PROMOTER}`,
        payload
      );

      setAllEventData(FetchEventData.data.data);
      toast.success(FetchEventData.data.message);
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
          setAllEventData([]);
        }
      }
    }
  };

  return (
    <div className="">
      <Toaster />
      <div className="md:w-[94%] w-full  mx-auto">
        <h1 className="md:text-4xl text-2xl mt-5  font-bold text-black">
          Events
        </h1>

        <div className="flex flex-col md:flex-row  w-full mx-auto justify-between gap-x-6">
          <div className="md:w-[30%] w-full md:mt-[2%] mt-6">
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
                placeholder="Search By Event Name"
              />
            </div>
          </div>

          <div className="md:w-[70%]  flex">
            <div
              id="dropdown"
              className="z-10 md:w-[20%] w-full md:absolute md:right-0 mr-[2%] mt-6  bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
            >
              <select
                className="block w-full cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onChange={(e) => handleDateSelection(e.target.value)}
              >
                <option selected disabled>
                  Select Event Filtered
                </option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 1 Month">Last 1 Month</option>
                <option value="Manual">Manual</option>
                <option value="Reset">Reset</option>
              </select>
            </div>
            {isManual && (
              <div className="flex mt-5 w-[45%] justify-between">
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-5">
          {allEventsData.map((event, index) => (
            <div
              key={index}
              className="bg-[#F5F5F5] p-4  h-auto flex flex-col justify-between"
            >
              {/* First Parent Div */}
              <div
                div
                className="flex md:flex-row  flex-col md:h-[80%] h-[40%]"
              >
                <div className="md:w-[50%] md:h-full w-full ">
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/${
                      event.EventCarouselImages[0]?.image_path
                    }`}
                    alt={`Product Image ${index}`}
                    className="w-full h-full object-cover "
                  />
                </div>

                <div className="md:w-[60%] w-full pl-4 flex flex-col justify-between h-[50%] mt-4">
                  <div>
                    <h1 className="text-xl font-bold md:h-[3rem]">
                      {event.EventName}
                    </h1>
                    {/* Render event description as HTML and hide overflow */}
                    {/* <div
                      className="text-gray-600 overflow-hidden md:h-[50px] mt-2 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: event.EventDescription,
                      }}
                    /> */}
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600 flex">
                      <span className="pr-2">
                        <FaCalendarAlt size={22} color="black" />
                      </span>
                      {event.arrangedEventDateTime[0].EventStartDateTime
                        ? new Date(
                            event.arrangedEventDateTime[0].EventStartDateTime
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "UTC",
                          })
                        : "N/A"}
                    </p>
                    <p className="text-gray-600 mt-2 flex">
                      <span className="pr-2">
                        <IoMdTime size={22} color="black" />
                      </span>
                      {event.arrangedEventDateTime[0].EventStartDateTime
                        ? new Date(
                            event.arrangedEventDateTime[0].EventStartDateTime
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "UTC",
                          })
                        : "N/A"}
                    </p>

                    <p className="text-gray-600 mt-2 flex">
                      <span className="pr-2">
                        <FaMapLocation size={23} />
                      </span>
                      {event.VenueEventFlag === 1
                        ? event.VenueCity
                        : event.VenueToBeAnnounced === 1
                        ? event.VenueToBeAnnouncedCity
                        : "Online Event"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Parent Div */}
              <div className="flex w-full gap-x-3 mt-4  md:mt-10">
                <button
                  className="border border-[#666666] w-[50%] text-[#666666] text-sm md:text-base py-2 px-4 rounded"
                  onClick={() =>
                    navigate(`/promoter/dashboard/event/report/${event._id}`)
                  } // Replace with the correct path
                >
                  Check Report
                </button>
                <button
                  className="bg-[#666666] w-[50%] text-white text-sm md:text-base y-2 px-4 rounded"
                  onClick={() => {
                    handlerBookTickets(event);
                  }}
                >
                  Book Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPromoter;
