import React, { useEffect, useState } from "react";
import OrganizerBreadCrumb from "../../organizerCommon/OrganizerBreadCrumb";
import toast, { Toaster } from "react-hot-toast";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
// import CreateEventOrganizer from "./CreateEventOrganizer";
// import EventTable from "./EventTable";
import { EventFormat } from "../../../../common/helper/Enum";
import { eventEndPoint } from "../../../../../services/apis";
import axios from "axios";
import { useSelector } from "react-redux";
import { formatDate2 } from "../../../../common/formatDate2";
import { IoIosCloseCircle } from "react-icons/io";
import { GrMoreVertical } from "react-icons/gr";

import {
  EventVisibilityText,
  getEventStatusText,
} from "../../../../common/EventVisibilityText";
import { useNavigate } from "react-router-dom";
import CreateEventOrganizer from "./CreateEventOrganizer";
import { OrganizerEventSelection } from "./data/OrganizerEventSelection";
import AllDraftEventData from "./eventTableData/AllDraftEventData";
import AllOrganizerEventData from "./eventTableData/AllOrganizerEventData";
import AllPublishedOrganizerEventData from "./eventTableData/AllPublishedOrganizerEventData";
import AllPendingReviewEventData from "./eventTableData/AllPendingReviewEventData";
import AllRejectedEventData from "./eventTableData/AllRejectedEventData";

const EventOrganizer = () => {
  const organizerUser = useSelector((store) => store.organizerauth);
  const navigate = useNavigate();

  const [eventCreationModal, setEventCrationModal] = useState(false);
  const [eventSelectFormatModal, setEventSelectFormatModal] = useState(false);
  const [eventSelectionFlag, setEventSelectionFlag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allEventsData, SetallEventsData] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [selectedEventType, setSelectedEventType] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const HandlerCreatePage = (status) => {
    console.log({ status });

    // Set Flag Value
    setEventSelectionFlag(status);

    // Set Event Creation Modal True
    setEventCrationModal(true);

    // Set Selection Event Format Modal False
    setEventSelectFormatModal(false);
  };

  const HandlerBackEvent = () => {
    setEventCrationModal(false);
    setEventSelectFormatModal(false);
  };

  const handlerMange = () => {
    if (!eventCreationModal) {
      setEventSelectFormatModal(!eventCreationModal);
    } else {
      setEventCrationModal(false);
      setEventSelectFormatModal(false);
    }
  };

  const renderComponent = () => {
    switch (selectedEventType) {
      case "All":
        return <AllOrganizerEventData />;
      case "Published":
        return <AllPublishedOrganizerEventData />;
      case "Draft":
        return <AllDraftEventData />;
      case "Pending Review":
        return <AllPendingReviewEventData />;
      case "Rejected":
        return <AllRejectedEventData />;
      default:
        return <AllOrganizerEventData />;
    }
  };

  console.log({ selectedEventType });

  return (
    <>
      <div className="mt-[3%] ml-[2%]">
        <Toaster />
        <OrganizerBreadCrumb path={"Events"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            // onClick={() => setEventSelectFormatModal(!eventCreationModal)}
            onClick={handlerMange}
            className={`w-[25%]  py-2 ${
              eventCreationModal
                ? "border-2 text-Gray85 border-Gray85"
                : "bg-Gray40 text-white"
            } flex justify-center items-center md:text-xl`}
          >
            {/* <span className="mr-2">
              {eventCreationModal ? (
                <FaChevronLeft size={23} onClick={() => HandlerBackEvent()} />
              ) : (
                <IoMdAdd size={23} />
              )}
            </span>{" "} */}
            {eventCreationModal ? "Back " : "Create Event"}
          </button>
        </div>
        <h1 className="md:text-3xl text-2xl font-semibold -mt-6">Events</h1>

        {/* {!eventCreationModal && (
          <div className="max-w-md mt-[2%]">
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
                //  value={searchTerm}
                // onChange={handleChange}
                placeholder="Search By Event Name"
              />
            </div>
          </div>
        )} */}

        {/* Dropdown for mobile */}
        {!eventCreationModal && (
          <div className="block md:hidden mt-8 w-[80%] ">
            <label className="font-semibold">Select Event type:</label>
            <div className="relative mt-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border border-black px-4 py-2 text-left rounded-md focus:outline-none"
              >
                {selectedEventType || "Select Event Type"}
              </button>
              {dropdownOpen && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-md rounded-md z-10">
                  {OrganizerEventSelection.map((event) => (
                    <button
                      key={event.id}
                      className={`w-full px-4 py-2 text-left ${
                        event.EventType === selectedEventType
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedEventType(event.EventType);
                        setDropdownOpen(false);
                      }}
                    >
                      {event.EventType}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!eventCreationModal && (
          <div className="md:flex hidden mt-8 md:mt-5 gap-x-11 w-[100%] mx-auto">
            {OrganizerEventSelection.map((event) => (
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
        )}

        {/* Event Selection Format  */}
        {eventSelectFormatModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md  mobile:w-[90%] md:w-[40%]">
              <div className="flex justify-between  w-[98%] mx-auto items-center ">
                <h1 className="text-text_Color font-roxboroughnormal font-semibold text-lg">
                  Please select the Event format
                </h1>
                <button
                  type="button"
                  onClick={() => setEventSelectFormatModal(false)}
                  className=""
                >
                  <span>
                    <IoIosCloseCircle size={25} />
                  </span>
                </button>
              </div>
              <p className="w-[98%] mx-auto mt-1.5 text-text_Color font-Marcellus font-normal text-base">
                Choose the appropriate option which best describes your event
              </p>
              <div className="flex justify-between w-full mt-[3%]">
                <button
                  type="button"
                  onClick={() => HandlerCreatePage(EventFormat.EventTour)}
                  className="w-[48%] py-2 bg-Gray40 text-white"
                >
                  Event Tour
                </button>
                <button
                  type="button"
                  onClick={() => HandlerCreatePage(EventFormat.StandardEvent)}
                  className="w-[48%] py-2 bg-Gray40 text-white"
                >
                  Standard Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!loading && (
        <div className="mt-[3%]">
          {eventCreationModal ? (
            <CreateEventOrganizer
              eventSelectionFlag={eventSelectionFlag}
              setEventCrationModal={setEventCrationModal}
            />
          ) : (
            <>{renderComponent()}</>
          )}
        </div>
      )}

      {/* Organizer PopUp */}
      {/* {openOrganizerPopUp && (
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
              {promoterData.map((promoterName, index) => (
                <div key={index} className="flex items-center w-1/2 mb-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  <p>{promoterName.PromoterName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default EventOrganizer;
