import React, { useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import CreateEvent from "./CreateEvent";
import { EventFormat } from "../../../../common/helper/Enum";
import { EventingSelection } from "../../../data/EventSelection";

import { IoIosCloseCircle } from "react-icons/io";
// All Eventts Table Folder Path
import AllEvents from "./eventTablesData/AllEvents";
import PublishedEvents from "./eventTablesData/PublishedEvents";
import DraftEvents from "./eventTablesData/DraftEvents";
import TBREvents from "./eventTablesData/TBREvents";
import SelfEvents from "./eventTablesData/SelfEvents";
import { useNavigate } from "react-router-dom";
import RejectedEvent from "./eventTablesData/RejectedEvent";

const Event = () => {
  const [eventCreationModal, setEventCrationModal] = useState(false);
  const [eventSelectFormatModal, setEventSelectFormatModal] = useState(false);
  const [eventSelectionFlag, setEventSelectionFlag] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedEventType, setSelectedEventType] = useState("All");

  const navigate = useNavigate();

  const renderComponent = () => {
    switch (selectedEventType) {
      case "All":
        return <AllEvents />;
      case "Published":
        return <PublishedEvents />;
      case "Draft":
        return <DraftEvents />;
      case "To Be Reviewed":
        return <TBREvents />;
      case "Self":
        return <SelfEvents />;
      case "Rejected":
        return <RejectedEvent />;
      default:
        return <AllEvents />;
    }
  };

  const HandlerCreatePage = (status) => {
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

  return (
    <div className=" ">
      <div className="mt-[3%] ml-[2%] ">
        <Breadcrumb path={"Events"} />

        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={handlerMange}
            // onClick={() => handlerMange("1")}
            className={`w-[25%] py-2 ${
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
                  {EventingSelection.map((event) => (
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
          <div className="md:flex hidden mt-8 md:mt-5 gap-x-6 md:gap-x-11 w-[100%] mx-auto ">
            {EventingSelection.map((event) => (
              <div key={event.id}>
                <button
                  className={` px-2 py-1 ${
                    event.EventType === selectedEventType
                      ? "bg-gray-200 px-2 py-1 rounded-md"
                      : ""
                  } `}
                  onClick={() => setSelectedEventType(event.EventType)}
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

      <div className="mt-[3%]">
        {eventCreationModal ? (
          <CreateEvent
            eventSelectionFlag={eventSelectionFlag}
            setEventCrationModal={setEventCrationModal}
          />
        ) : (
          <div>{renderComponent()}</div>
        )}
      </div>
    </div>
  );
};

export default Event;
