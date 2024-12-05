import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  eventsticketsByEventId,
  normalEventTickets,
} from "../../../../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import TableBreadcrumb from "./TableBreadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import CreateBulkTicket from "../bulkTickets/CreateBulkTicket";
import CreateTicket from "../normalTickets/CreateTicket";
import BulkTicketsTable from "../bulkTickets/BulkTicketsTable";
import NormalTicketTable from "../normalTickets/NormalTicketTable";
import { transformEventDateTime } from "../../../../../../../common/transformEventDateTime";
import { formatDate3 } from "../../../../../../../common/formatDate2";
import { CiFilter } from "react-icons/ci";
import { limit } from "../../../../../../../common/helper/Enum";
import { Pagination } from "@mui/material";

const TicketTable = () => {
  const { _id } = useParams();

  const [ticketCreation, setTicketCreation] = useState(false);
  const [eventName, setEventName] = useState("");
  const [bulkTicketCreationCheck, setBulkTicketCreationCheck] = useState(false);
  const [showTables, setShowTables] = useState(true);
  const [eventDates, setEventDates] = useState([]);
  const [promoterData, setPromoterData] = useState([]);
  const [eventTicketsData, setEventTicketsData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [eventStatus, setEventStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [storeFilterDates, setStoreFilterDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [ticketNameFilterData, setTicketNameFilterData] = useState([]);
  const [nameDropDownVisible, setNameDropDownVisible] = useState(false);

  const [selectedNameIndex, setSelectedNameIndex] = useState(null);
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({});

  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
  // console.log("eventTicketsData", eventTicketsData);

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      getAllTicketsByEventId();
    }
  }, [!ticketCreation, !bulkTicketCreationCheck, page]);

  //  initial  state
  const getAllTicketsByEventId = async () => {
    const payload = {
      event_id: _id,
      page: String(page),
      limit: String(limit),
    };

    try {
      let response = await axios.post(
        `${eventsticketsByEventId.GET_ALL_EVENTS_TICKETS_BY_EVENT_ID}`,
        payload
      );

      // console.log("response check ===>", response.data.data);
      setEventName(response.data.data.EventName);

      const EventDateFormatting = response.data.data.EventDateTimeData;
      const formattedEventData = await transformEventDateTime(
        EventDateFormatting
      );

      setStoreFilterDates(formattedEventData);

      setEventDates(response.data.data.EventDateTimeData);
      setOriginalData(response.data.data.EventTicketsData);
      setPromoterData(response.data.data.EventPromotersData);
      setEventTicketsData(response.data.data.EventTicketsData);
      setTotalPages(response.data.data.totalPages);
      setOriginalTotalPages(response.data.data.totalPages);
      setTicketNameFilterData(response.data.data.TicketNamesArray);
      setEventStatus(response.data.data.EventStatus);
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

  const allPromoterData = (promotorData) => {
    // console.log({ promotorData });
    if (promotorData.length !== 0) {
      setPromoterData(promotorData);
    }
  };

  const handlerActivateTickets = () => {
    setShowTables(true);
    setBulkTicketCreationCheck(false);
  };

  const handlerActivateBulkTickets = () => {
    setShowTables(false);
    setBulkTicketCreationCheck(true);
  };

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
      try {
        if (debouncedSearchTerm.length < 2) {
          toast.error("Search keyword must be at least 2 characters long.");
          return;
        }

        const payload = {
          event_id: _id,
          search_keyword: debouncedSearchTerm,
        };

        let response = await axios.post(
          `${`${normalEventTickets.GET_SERACH_TICKET_BY_EVENT_ID}`}`,
          payload
        );

        console.log(response.data.data);
        setEventTicketsData(response.data.data);
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
          }
        }
      }
    };
    if (debouncedSearchTerm !== "") {
      fetchData();
    } else {
      setEventTicketsData(originalData);
    }
  }, [debouncedSearchTerm, originalData]);

  // filltered data by dates
  const handleDateFilter = (eventDateId, eventDate, isNewSearch = false) => {
    if (isNewSearch) {
      setPage(1);
    }
    setSelectedDate(eventDateId);
    // setSelectedNameIndex(null);
    // setNameDropDownVisible(false);

    const newFilters = { ...filters, eventDateTime_id: eventDateId };

    if (eventDate === "reset") {
      // setEventTicketsData(originalData);
      // setTotalPages(originalTotalPages);
      getAllTicketsByEventId();
      setFilters({});
      setDropdownVisible(false);
    } else {
      setFilters(newFilters);

      setDropdownVisible(false);
      if (!isNewSearch) {
        fetchFilteredData(newFilters); // Only call this if it's not a new search
      }
    }
  };

  const handleNameFilter = (ticketName, index, isNewSearch = false) => {
    if (isNewSearch) {
      setPage(1);
    }
    setSelectedNameIndex(index);

    const newFilters = { ...filters, ticketName: ticketName };

    if (ticketName === "resetAllNames") {
      // setEventTicketsData(originalData);
      // setTotalPages(originalTotalPages);
      getAllTicketsByEventId();
      setFilters({});

      setNameDropDownVisible(false);
    } else {
      setFilters(newFilters);

      setNameDropDownVisible(false);
      if (!isNewSearch) {
        fetchFilteredData(newFilters); // Only call this if it's not a new search
      }
    }
  };

  useEffect(() => {
    if (Object.keys(filters).length !== 0) {
      fetchFilteredData(filters); // Call the function when page changes
    }
  }, [page, filters]);

  const fetchFilteredData = async (filterParams) => {
    const payload = {
      event_id: _id,
      page: String(page),
      limit: String(limit),
      ...filterParams,
    };

    console.log("payload", payload);

    try {
      let response = await axios.post(
        `${normalEventTickets.FILTER_NORMAL_EVENT_TICKET_BY_DATE_AND_NAME}`,
        payload
      );

      // console.log("response", response.data.data);
      setEventTicketsData(response.data.data.TicektsData);
      setTotalPages(response.data.data.totalPages);
      toast.success(response.data.message);
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
          // console.log(error.response);
          toast.error(data.message);
        }
      }
    }
  };

  const toggleDropdownName = () => {
    setNameDropDownVisible((prev) => !prev);
  };

  // console.log("eventDates", eventDates);

  return (
    <div>
      <Toaster />
      <div>
        <TableBreadcrumb path={_id} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => setTicketCreation(!ticketCreation)}
            className={`w-[25%] py-2 ${
              ticketCreation
                ? "border-2 text-Gray85 border-Gray85"
                : "bg-Gray40 text-white"
            } flex justify-center items-center md:text-xl`}
          >
            {/* <span className="mr-2">
              {ticketCreation ? (
                <FaChevronLeft size={23} />
              ) : (
                <IoMdAdd size={23} />
              )}
            </span>{" "} */}
            {ticketCreation
              ? "Back"
              : bulkTicketCreationCheck
              ? " Create Bulk Ticket"
              : "Create Ticket"}
          </button>
        </div>
        <h1 className="md:text-3xl text-xl font-semibold -mt-8 md:-mt-6">
          {eventName}{" "}
          <span className="md:text-xl text-base capitalize">(ticket)</span>
        </h1>
      </div>

      {!loading && (
        <div>
          {ticketCreation ? (
            bulkTicketCreationCheck ? (
              <CreateBulkTicket
                eventDates={eventDates}
                setTicketCreation={setTicketCreation}
              />
            ) : (
              <CreateTicket
                eventDates={eventDates}
                promoterData={promoterData}
                onchangePromotor={allPromoterData}
                setTicketCreation={setTicketCreation}
                setEventDates={setEventDates}
                eventStatus={eventStatus}
              />
            )
          ) : (
            <div className=" ">
              <div className="flex mt-10 gap-8 pb-6 border-b-2 ">
                <h1
                  className={`text-xl font-semibold  cursor-pointer ${
                    showTables ? "underline underline-offset-[8px]" : ""
                  }`}
                  onClick={() => handlerActivateTickets()}
                >
                  Tickets
                </h1>
                <h1
                  className={`text-xl font-semibold cursor-pointer ${
                    !showTables ? "underline underline-offset-[8px]" : ""
                  }`}
                  onClick={() => handlerActivateBulkTickets()}
                >
                  Bulk Tickets
                </h1>
              </div>

              {!ticketCreation && !bulkTicketCreationCheck && (
                <div className="flex justify-end md:mt-0 mt-4">
                  {/* <div className="max-w-md mt-[2%]">
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
                        placeholder="Search Ticket name here"
                      />
                    </div>
                  </div> */}

                  <div className="flex gap-x-4">
                    {/* Filltered By Name */}
                    <div className="relative text-center mt-[2%]">
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
                        } bg-white divide-y divide-gray-100 rounded-lg shadow w-56`}
                      >
                        <div
                          className="py-2 text-sm text-gray-700 "
                          aria-labelledby="dropdownDelayButton"
                        >
                          {ticketNameFilterData.map((dates, index) => (
                            <div
                              onClick={() =>
                                handleNameFilter(dates, index, true)
                              }
                            >
                              <li>
                                <p
                                  className={`block cursor-pointer text-start px-4 py-2 hover:bg-gray-100  ${
                                    selectedNameIndex === index
                                      ? "bg-gray-200 "
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
                              className="block px-4 py-2 hover:bg-gray-100 text-start "
                            >
                              Reset Filter
                            </Link>
                          </li>
                        </div>
                      </ul>
                    </div>

                    {/* Filltered By Date */}
                    <div className="relative text-center mt-[2%]">
                      <button
                        id="dropdownDelayButton"
                        onClick={toggleDropdown}
                        className="text-Gray40 w-full px-2 md:px-14  focus:ring-1 focus:outline-none focus:ring-Gray40 font-medium rounded-lg text-lg py-2.5 text-center inline-flex items-center border border-Gray40"
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
                                handleDateFilter(
                                  dates._id,
                                  dates.EventStartDate,
                                  true
                                )
                              }
                            >
                              <li>
                                <p
                                  className={`block px-4 py-2 text-start hover:bg-gray-100 ${
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
                              className="block px-4 py-2 text-start hover:bg-gray-100 "
                            >
                              Reset Filter
                            </Link>
                          </li>
                        </div>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                {showTables ? (
                  <NormalTicketTable eventTicketsData={eventTicketsData} />
                ) : (
                  <BulkTicketsTable />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!ticketCreation && !bulkTicketCreationCheck && (
        <div className="flex justify-end items-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePaginationChange}
            shape="rounded"
            size="large"
          />
        </div>
      )}
    </div>
  );
};

export default TicketTable;
