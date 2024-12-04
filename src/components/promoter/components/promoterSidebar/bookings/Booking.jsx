import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { booking, promoterEndPointPannel } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { TbFilter } from "react-icons/tb";
import { BsChevronDown } from "react-icons/bs";
import { dropdownOptions } from "../../../../superAdmin/components/sidebar/event/modalCrationData/modalOpen";
import Select from "react-select";
import { dateFilter } from "../../../../common/datefilter";
import moment from "moment-timezone";
import * as XLSX from "xlsx";
import { bookingStatus } from "../../../../common/helper/Enum";

const Booking = () => {
  const { _id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilteredPop, setOpenFilteredPop] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState([]);
  const [cities, setCities] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [venues, setVenues] = useState([]);

  const [selectedCity, setSelectedCity] = useState();
  const [selectedEventNames, setSelectedEventNames] = useState();
  const [selectedVenue, setSelectedVenue] = useState();

  const DownloadReportHandler = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(bookingData);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Export workbook to Excel
    XLSX.writeFile(workbook, "Bookings.xlsx");
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  // Fetch booking data
  const fetchBookingData = async () => {
    try {
      const payload = {
        promoter_id: _id,
      };
      // console.log(payload);

      const fetchBookingData = await axios.post(
        `${promoterEndPointPannel.GET_BOOKING_DATA}`,
        payload
      );

      console.log(fetchBookingData.data.data);
      setBookingData(fetchBookingData.data.data.BookingData);
      setOriginalData(fetchBookingData.data.data.BookingData);
      setCities(fetchBookingData.data.data.EventCities);
      setEventNames(fetchBookingData.data.data.EventNamesArray);
      setVenues(fetchBookingData.data.data.EventVenue);
      // toast.success(fetchBookingData.data.message);
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

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const filteredList = originalData?.filter(
      (e) =>
        e.CustomerName.includes(debouncedSearchTerm) ||
        e.Booking_id.toLowerCase().includes(
          debouncedSearchTerm.toLocaleLowerCase()
        )
    );
    setBookingData(filteredList);
  }, [debouncedSearchTerm]);

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  const handleManualDateChange = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };
  const handleManualSubmit = () => {
    if (startDate === null || endDate === null) {
      toast.error("Please select date range");
      return;
    }
    // // console.log("start", startDate, "end", endDate);

    const startdate = `${moment(startDate)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss")}+00:00`;
    const enddate = `${moment(endDate)
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss")}+00:00`;

    // console.log(startdate, enddate);

    const filteredList = originalData?.filter((e) => {
      const FilterationBookingDateTime = e.FilterationBookingDateTime;
      console.log(startdate, enddate);
      return (
        FilterationBookingDateTime >= startdate &&
        FilterationBookingDateTime <= enddate
      );
    });
    // console.log(
    //   "filteredList",
    //   filteredList.map((e) => console.log(e.FilterationBookingDateTime))
    // );
    setBookingData(filteredList);
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

      let startDate = TodayStartDateTimeStr;

      let endDate = TodayEndDatetimeStr;

      console.log("startDate", startDate);
      console.log("endDate", endDate);

      const filteredList = originalData?.filter((e) => {
        const eventDate = new Date(e.FilterationBookingDateTime);
        return (
          (startDate === null || eventDate >= new Date(startDate)) &&
          (endDate === null || eventDate <= new Date(endDate))
        );
      });

      console.log("filteredList", filteredList);
      setBookingData(filteredList);
    }
  };

  const toggleDropdownFiltered = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearch = (e) => {
    if (
      selectedVenue === null &&
      selectedEventNames === null &&
      selectedCity === null
    ) {
      return toast.error("Please select at least one filter");
    }

    const filtered = originalData?.filter((event) => {
      const cityMatch = selectedCity?.value
        ? event.EventCityName?.toLowerCase() ===
          selectedCity.value.toLowerCase()
        : true; // If no city filter is applied, match everything

      const eventMatch = selectedEventNames?.value
        ? event.EventName?.toLowerCase() ===
          selectedEventNames.value.toLowerCase()
        : true; // If no event name filter is applied, match everything

      const venueMatch = selectedVenue?.value
        ? event.EventVenueName?.toLowerCase() ===
          selectedVenue.value.toLowerCase()
        : true; // If no venue filter is applied, match everything

      // Return true if the event matches all selected filters
      return cityMatch && eventMatch && venueMatch;
    });

    setOpenFilteredPop(false);
    setBookingData(filtered);
    console.log(filtered);
  };

  // const handleSearch = (e) => {
  //   if (
  //     selectedVenue === null &&
  //     selectedEventNames === null &&
  //     selectedCity === null
  //   ) {
  //     return toast.error("Please select at least one filter");
  //   }

  //   const filtered = originalData?.filter((e) => {
  //     const cityMatch =
  //       selectedCity?.value &&
  //       e.EventCityName?.toLowerCase() === selectedCity?.value.toLowerCase();

  //     const eventMatch =
  //       selectedEventNames?.value &&
  //       e.EventName?.toLowerCase() === selectedEventNames.value.toLowerCase();

  //     const venueMatch =
  //       selectedVenue?.value &&
  //       e?.EventVenueName?.toLocaleLowerCase() ===
  //         selectedVenue.value.toLowerCase();

  //     // console.log(
  //     //   e?.EventVenueName.toLocaleLowerCase() ===
  //     //     selectedVenue?.value.toLocaleLowerCase()
  //     // );

  //     return cityMatch || eventMatch || venueMatch;
  //   });
  //   setOpenFilteredPop(false);
  //   setBookingData(filtered);
  //   console.log(filtered);
  // };

  const openEventFilterPopUp = () => {
    setOpenFilteredPop(true);
  };
  const handleReset = () => {
    setSelectedVenue(null);
    setSelectedEventNames(null);
    setSelectedCity(null);
    fetchBookingData();
    setOpenFilteredPop(false);
  };

  return (
    <div className="min-h-screen">
      <Toaster />
      <div className="w-[94%] mx-auto">
        <div className="flex justify-between">
          <h1 className="md:text-4xl text-3xl mt-5 mb-6 font-bold text-black">
            Bookings
          </h1>
          <div className="mt-5 mb-6">
            <button
              onClick={DownloadReportHandler}
              disabled={bookingData?.length === 0}
              className={`${
                bookingData?.length === 0
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } bg-[#666666]  md:w-56 text-white py-2 px-4 rounded`}
            >
              Download Report{" "}
            </button>
          </div>
        </div>

        <div className="w-[100%]  flex flex-col    md:gap-4">
          <div className="relative flex items-center md:w-[40%] h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
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

          <div className="flex  md:mt-0 mt-4  gap-x-4">
            <div
              onClick={openEventFilterPopUp}
              className=" 
              "
            >
              <button className="border-[2px] border-Gray40   p-2">
                <TbFilter size={30} color="gray" className="" />
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
          </div>
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
                  {/* <th scope="col" className="px-6 py-3">
                    Promoter name
                  </th> */}
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
              <tbody>
                {bookingData?.map((eventData, index) => (
                  <tr
                    key={eventData._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                      {eventData.BookingDateTime.split(" ")[0]}{" "}
                      {eventData.BookingDateTime.split(" ")[1]}
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
                      {eventData.EventCityName ? eventData.EventCityName : "-"}
                    </td>
                    <td className="pl-10 py-2 px-6">
                      {eventData.EventVenueName
                        ? eventData.EventVenueName
                        : "-"}
                    </td>
                    {/* <td className="pl-6 py-4">{eventData.PromoterName}</td> */}
                    <td className="pl-10 py-4">{eventData.TicketQuantity}</td>
                    {/* <td className="pl-6 py-4">
                      {eventData.CheckIn ? eventData.CheckIn : "-"}
                    </td> */}
                    <td className="pl-2 py-4">{eventData.TicketName}</td>
                    <td className="pl-10 py-4">{eventData.EventTicketType}</td>
                    <td className="pl-6 py-4">{eventData.TicketPrice}</td>
                    <td className="pl-8 py-4">{eventData.TotalAmount}</td>
                    {/* <td className="pr-6 py-4">
                      <div className="flex gap-2">
                        <span>Cancel</span>
                        <span className="underline  ">Resend</span>
                      </div>
                    </td> */}
                    <td className="pl-2 pr-14 py-4">
                      {eventData.status !== bookingStatus.Booked
                        ? "Cancelled"
                        : "Booked"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
              <div className="flex md:flex-row flex-col w-full mt-4 gap-x-5 justify-between">
                <div className="md:w-[50%]">
                  <label htmlFor="">City</label>
                  <Select
                    styles={dropdownStyles}
                    options={cities.map((city) => ({
                      value: city,
                      label: city,
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
                      value: venue,
                      label: venue,
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
                  <label htmlFor="">Event Name</label>
                  <Select
                    styles={dropdownStyles}
                    options={eventNames.map((name) => ({
                      value: name,
                      label: name,
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
            <div className="w-full flex md:justify-end gap-x-4">
              <button
                className="mt-4 md:w-[25%] w-full border-2 border-Gray40  text-black p-2 rounded-md"
                onClick={() => setOpenFilteredPop(false)}
              >
                Close
              </button>
              <button
                className="mt-4 md:w-[25%] w-full bg-Gray40 text-white p-2 rounded-md"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
