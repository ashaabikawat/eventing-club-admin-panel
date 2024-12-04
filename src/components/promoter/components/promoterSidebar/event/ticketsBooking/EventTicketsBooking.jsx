import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { promoterEndPointPannel } from "../../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoMdTime } from "react-icons/io";
import BookTicket from "./BookTicket";
import moment from "moment-timezone";
import { IoIosArrowDown } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const EventTicketsBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { arrangedEventDateTime, eventId, eventName, seasonPass, venueCity } =
    location.state;
  const promoterUser = useSelector((store) => store.promoterauth);
  const event = arrangedEventDateTime[0].EventStartDateTime;
  const date = new Date(event);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  const eventDate = date.toLocaleDateString("en-us", options);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [eventTicketsData, setEventTicketsData] = useState([]);
  const [counts, setCounts] = useState({});
  const [showCount, setShowCount] = useState({});
  // console.log("eventTicketsData", eventTicketsData);

  const eventStartDateTime = new Date(
    arrangedEventDateTime[0]?.EventStartDateTime
  );
  const startDateSeasonPass = eventStartDateTime.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });

  const eventEndDateTime = new Date(
    arrangedEventDateTime[arrangedEventDateTime.length - 1]?.EventStartDateTime
  );

  const endDateSeasonPass = eventEndDateTime.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });

  const { _id } = useParams();

  const [checkoutPage, setCheckOutPage] = useState(false);

  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    totalTickets: 0,
    selectedTickets: [],
  });

  useEffect(() => {
    if (arrangedEventDateTime.length === 1) {
      handleClick(arrangedEventDateTime[0]._id);
    }
  }, []);

  const handleClick = async (dateId) => {
    setSelectedIndex(dateId);
    try {
      const Payload = {
        event_id: eventId,
        eventDateTime_id: dateId,
        promoter_id: promoterUser.promoterSignupData.user_id,
      };

      const FetchEventTickets = await axios.post(
        `${promoterEndPointPannel.GET_PROMOTER_TICKET_DATA_BY_EVENT_DATE}`,
        Payload
      );

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
          setEventTicketsData([]);
        }
      }
    }
  };
  // console.log("eventticket" , eventTicketsData[0].BookingMaxLimit);
  // console.log(counts);
  const handleSeasonPass = async (dateId) => {
    setSelectedIndex(dateId);
    const payload = {
      event_id: _id,
      promoter_id: promoterUser.promoterSignupData.user_id,
    };
    // console.log(promoterEndPointPannel.GET_SEASON_PASS);
    try {
      const response = await axios.post(
        `${promoterEndPointPannel.GET_SEASON_PASS}`,
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
          toast.error(data.message);
        }
      }
    }
  };

  useEffect(() => {
    // Update bookingData whenever counts change
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      totalTickets: Object.values(counts),
      totalPrice: eventTicketsData.reduce(
        (acc, ticket) => acc + (counts[ticket._id] || 0) * ticket.Price,
        0
      ),
    }));
  }, [counts]);

  const handleIncrease = (ticketId) => {
    //  setCounts({
    //     [ticketId]: (counts[ticketId] || 0  ) + 1, // Set the count for the selected ticket
    //   })

    const bookingObj = eventTicketsData.find(
      (ticket) => ticket._id === ticketId
    );
    const bookingLimit = bookingObj.BookingMaxLimit;

    if (Object.values(counts) < bookingLimit) {
      setCounts({
        [ticketId]: (counts[ticketId] || 0) + 1, // Set the count for the selected ticket
      });
      setShowCount({
        [ticketId]: true,
      });
    } else {
      // alert("Exceeding booking limit");
      toast.error("Exceeding booking limit");
    }

    // Ensure only the selected ticket shows the counter

    setBookingData({ ...bookingData, totalTickets: Object.values(counts) });
    // console.log("handleincrement", counts);
    // console.log("booikingdata", bookingData);
  };

  const handleDecrease = (ticketId) => {
    // console.log(ticketId);

    setCounts((prevCounts) => {
      const newCount = Math.max((prevCounts[ticketId] || 0) - 1, 0);

      if (newCount === 0) {
        setShowCount({});
        return {};
      }

      // console.log("handledecrement", counts);
      setBookingData({ ...bookingData, totalTickets: Object.values(counts) });

      return { [ticketId]: newCount }; // Store only the current ticket's count
    });
  };

  // console.log("eventtivcketdata", eventTicketsData);

  // console.log("counts", counts);

  const handleShowCount = (ticketId) => {
    setShowCount((prevShowCount) => ({
      ...prevShowCount,
      [ticketId]: true,
    }));
  };

  // Calculate total tickets and price
  const totalTickets = Object.values(counts).reduce(
    (acc, count) => acc + count,
    0
  );

  const totalPrice = eventTicketsData.reduce(
    (acc, ticket) => acc + (counts[ticket._id] || 0) * ticket.Price,
    0
  );
  // console.log("eventTicketsData inside", eventTicketsData);

  const calculateTotals = () => {
    const totalTickets = Object.values(counts).reduce(
      (acc, count) => acc + count,
      0
    );
    const totalPrice = eventTicketsData.reduce(
      (acc, ticket) => acc + (counts[ticket._id] || 0) * ticket.Price,
      0
    );
    const selectedTickets = eventTicketsData.filter(
      (ticket) => counts[ticket._id] > 0
    );

    setBookingData({
      totalPrice,
      totalTickets,
      selectedTickets,
    });
  };

  const handleContinue = () => {
    calculateTotals();
    setCheckOutPage(true);
  };

  // Determine if other divs should be disabled
  // const isAnyCountActive = Object.values(showCount).some(
  //   (value, index) => value && counts[eventTicketsData[index]?._id] > 0
  // );

  const isAnyCountActive = Object.values(showCount).some((value) => value);

  // console.log("showcount", isAnyCountActive);
  const [expandedStates, setExpandedStates] = useState({});
  const maxLines = 3; // Adjust the number of lines to display before "Read More"
  const maxChars = 100;

  const toggleReadMore = (ticketId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [ticketId]: !prevStates[ticketId], // Toggle the state for the specific ticket
    }));
  };

  return (
    <div className="relative min-h-screen">
      <Toaster />

      {!checkoutPage ? (
        <>
          <div className="w-[96%] mx-auto pb-[200px]">
            <div className="w-full flex justify-between">
              <h1 className="md:text-4xl text-3xl mt-5 font-bold text-black">
                Book Events
              </h1>
              <button
                onClick={() => navigate("/promoter/dashboard/event")}
                className="border border-[#666666] w-[20%] mt-5 text-[#666666] md:h-12 rounded"
              >
                Back
              </button>
            </div>

            <div className="  md:mt-2 mt-8">
              <div className="">
                <Swiper
                  className="mt-6 m-0"
                  // slidesPerView={
                  //   arrangedEventDateTime.length < 4
                  //     ? arrangedEventDateTime.length
                  //     : 4
                  // }
                  slidesPerView="1.6"
                  spaceBetween={20}
                  breakpoints={{
                    320: {
                      slidesPerView: 1.6,
                      spaceBetween: 16,
                    },
                    425: {
                      slidesPerView: 2.4,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4.3,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 5.4,
                      spaceBetween: 20,
                    },
                  }}
                  // centeredSlides={false} // Keeps slides aligned to the left
                  // loop={false} // Prevents looping
                  // centerInsufficientSlides={true}
                >
                  {arrangedEventDateTime.map((eventDate, index) => {
                    const eventStartDateTime = eventDate.EventStartDateTime;
                    const date = new Date(eventStartDateTime);

                    const weekday = date.toLocaleString("en-US", {
                      weekday: "long",
                      timeZone: "UTC",
                    });

                    const month = date.toLocaleString("en-US", {
                      month: "long",
                      timeZone: "UTC",
                    });

                    const day = date.toLocaleString("en-US", {
                      day: "numeric",
                      timeZone: "UTC",
                    });

                    const time = date.toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    });
                    // console.log(weekday, month, day, time);

                    return (
                      <SwiperSlide>
                        {/* <div
                      
                        style={{
                          display: "flex",

                          flexDirection: "column",
                          // width: "100px",
                          marginBottom: "10px",
                          height: "150px",
                          backgroundColor:
                            selectedIndex === eventDate._id
                              ? "#B2B2B2"
                              : "green",
                        }}
                        className="border px-4 py-2 cursor-pointer "
                      >
                        <p className="text-center underline underline-offset-4">
                          {weekday}
                        </p>
                        <p className="text-center mt-1.5">{month}</p>
                        <p className="text-center mt-3 mb-2">
                          <span className="bg-Gray40 px-3 py-2.5 rounded-full">{`${day}`}</span>
                        </p>
                        <p className="text-center mt-1.5">{time}</p>
                      </div> */}
                        <div
                          className=" h-auto border px-4 py-2 cursor-pointer "
                          key={index}
                          onClick={() => handleClick(eventDate._id)}
                          style={{
                            backgroundColor:
                              selectedIndex === eventDate._id
                                ? "#B2B2B2"
                                : "transparent",
                          }}
                        >
                          <div className="flex flex-col gap-2">
                            <p className="text-center underline underline-offset-4">
                              {weekday}
                            </p>
                            <p className="text-center mt-1.5">{month}</p>
                            <p className="text-center mt-3 mb-2">
                              <span className="bg-Gray40 px-3 py-2.5 rounded-full text-white">{`${day}`}</span>
                            </p>
                            <p className="text-center mt-1.5">{time}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                  {seasonPass > 0 && (
                    <SwiperSlide>
                      <div
                        onClick={() =>
                          handleSeasonPass(arrangedEventDateTime._id)
                        }
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginBottom: "10px",

                          backgroundColor:
                            selectedIndex === eventDate._id
                              ? "#B2B2B2"
                              : "transparent",
                        }}
                        className="border  h-44  px-4 py-2 cursor-pointer"
                      >
                        <p className="text-center underline underline-offset-4">
                          Season passs
                        </p>

                        <div className="flex items-center justify-center my-2 mx-auto">
                          <IoIosArrowDown size={20} />
                        </div>

                        <p className="text-center font-semibold">{`${startDateSeasonPass} - ${endDateSeasonPass}`}</p>
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>
            </div>

            <div className="mt-6 w-full">
              {eventTicketsData?.map((eventTicket, index) => {
                const ticketId = eventTicket._id;
                const description = eventTicket?.Description || "";
                // Handle both newline-separated and long single-line descriptions
                const descriptionLines = description.includes("\n")
                  ? description.split("\n")
                  : [description];
                // Determine whether this ticket is expanded
                const isExpanded = expandedStates[ticketId] || false;

                // Truncate based on maxLines or maxChars
                const truncatedDescription =
                  descriptionLines.length > maxLines
                    ? descriptionLines.slice(0, maxLines)
                    : [
                        description.substring(0, maxChars) +
                          (description.length > maxChars ? "..." : ""),
                      ];

                const displayedLines = isExpanded
                  ? descriptionLines
                  : truncatedDescription;

                const startTimeObj = new Date(eventTicket.EventStartDateTime);
                const endTimeObj = new Date(eventTicket.EventEndDateTime);

                const startTime = startTimeObj.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                });
                const endTime = endTimeObj.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                });

                const count = counts[eventTicket._id] || 0;

                return (
                  <div
                    key={index}
                    className="bg-[#F5F5F5] w-full mt-2 p-4 mb-2 flex justify-between "
                  >
                    <div className="md:w-[70%]">
                      <h1 className="font-semibold text-xl">
                        {eventTicket.Name}
                      </h1>
                      {/* <p className="mt-3 flex">
                        <span className="mr-2">
                          <IoMdTime size={25} color="black" />
                        </span>
                        {`${startTime} - ${endTime}`}
                      </p> */}
                      {/* <p className="mt-3">{eventTicket.Description}</p> */}
                      {/* <p className="mt-3">
                        {eventTicket?.Description?.split("\n").map(
                          (line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          )
                        )}
                      </p> */}
                      <p className="mt-3">
                        {displayedLines.map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                        {(description.length > maxChars ||
                          descriptionLines.length > maxLines) && (
                          <button
                            onClick={() => toggleReadMore(ticketId)}
                            className="text-black font-bold underline ml-1"
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>

                    <div className="w-[30%] flex flex-col justify-between ">
                      <p className="text-center">Rs.{eventTicket.Price}</p>
                      {showCount[eventTicket._id] ? (
                        <div className="flex justify-center items-center mt-4">
                          <button
                            className="bg-[#666666] text-white py-1 px-2 rounded-l"
                            onClick={() => handleDecrease(eventTicket._id)}
                          >
                            -
                          </button>
                          <span className="mx-4">{count}</span>
                          <button
                            className="bg-[#666666] text-white py-1 px-2 rounded-r"
                            onClick={() => handleIncrease(eventTicket._id)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className={` ${
                            isAnyCountActive
                              ? "bg-[#666666] bg-opacity-40 cursor-not-allowed"
                              : "bg-[#666666]"
                          }  md:w-[50%] text-white py-2 px-4 rounded mx-auto mt-4`}
                          onClick={() => handleShowCount(eventTicket._id)}
                          disabled={isAnyCountActive}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer for Total Count and Price */}
          {totalTickets > 0 && (
            <div className="fixed  border-t border-gray-200 bottom-0 md:w-[90%] md:h-[100px] w-full  h-auto bg-white shadow-md md:p-6 p-4 flex md:flex-row flex-col  justify-between ">
              <div className="md:w-[50%] w-full md:pl-6  flex md:block justify-between ">
                <p className="text-2xl font-bold">Rs.{totalPrice}</p>
                <p className="text-xl font-bold px-4 md:px-0">
                  {totalTickets} Ticket
                </p>
              </div>
              <div className="md:w-[35%] md:mt-0 mt-4 w-full">
                <button
                  onClick={handleContinue}
                  className="bg-[#666666] md:w-[50%] w-full text-white py-2 px-4 rounded"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <BookTicket
            bookingData={bookingData}
            setBookingData={setBookingData}
            setCheckOutPage={setCheckOutPage}
            eventId={eventId}
            counts={counts}
            setCounts={setCounts}
            handleDecrease={handleDecrease}
            handleIncrease={handleIncrease}
            eventTicketsData={eventTicketsData}
            eventName={eventName}
            newEventdate={eventDate}
            venueCity={venueCity}
          />
        </div>
      )}
    </div>
  );
};

export default EventTicketsBooking;
