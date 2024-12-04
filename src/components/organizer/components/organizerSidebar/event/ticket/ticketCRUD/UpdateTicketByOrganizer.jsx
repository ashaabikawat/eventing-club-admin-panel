import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  eventEndPoint,
  eventsticketsByEventId,
  normalEventTickets,
} from "../../../../../../../services/apis";
import axios from "axios";
import { transformEventDateTime } from "../../../../../../common/transformEventDateTime";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import {
  TicketType,
  TicketVisiblity,
} from "../../../../../../common/helper/Enum";
import { formatDate3 } from "../../../../../../common/formatDate2";
import { IoIosCloseCircle } from "react-icons/io";
import Select from "react-select";

const UpdateTicketByOrganizer = () => {
  const { eventId, ticketId } = useParams();

  // states Managment
  const [allticketsData, setAllTicketsData] = useState([]);
  const [eventDateFormatting, setEventDateFormatting] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [allPromoterData, setAllPromoterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoterID, setPromoterID] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visibilityValue, setVisibilityValue] = useState("");
  const [callAllEventData, setCallAllEventData] = useState(false);
  const [eventDates, setEventDates] = useState([]);
  const [selectedMultiplePassDates, setSelectedMultiplePassDates] =
    useState(null);
  const [openPromotorModal, setOpemPromotorModal] = useState(false);

  const [selectedPromotorData, setSelectedPromotorData] = useState([]);
  const [allPromoterDatas, setAllPromoterDatas] = useState([]);
  const [eventPromotersData, setEventPromotersData] = useState([]);
  const [countCheckPopup, setCountCheckPopup] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getAllTicketDataByID();
    getAllEventTicketDataByID();
  }, []);

  useEffect(() => {
    if (selectedPromotorData.length > 0 && allPromoterDatas.length > 0) {
      handlerSelectedPromoter();
    }
  }, [selectedPromotorData, allPromoterDatas]);

  const getAllTicketDataByID = async () => {
    try {
      const payload = { event_id: eventId };

      let response = await axios.post(
        `${eventsticketsByEventId.GET_ALL_EVENTS_TICKETS_BY_EVENT_ID}`,
        payload
      );

      const EventDateFormatting = response.data.data.EventDateTimeData;
      // console.log({ EventDateFormatting });
      const formattedEventData = await transformEventDateTime(
        EventDateFormatting
      );
      setEventDates(formattedEventData);

      // console.log(response.data.data);
      const promoterData = response.data.data.EventPromotersData;
      setAllPromoterDatas(promoterData);
      // handlerSelectedPromoter(promoterData);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
          console.log(error.response);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  const getAllEventTicketDataByID = async () => {
    try {
      const payload = { eventTicket_id: ticketId };

      let response = await axios.post(
        `${normalEventTickets.GET_NORMAL_EVENT_TICKET_BY_ID}`,
        payload
      );

      setAllTicketsData(response.data.data);
      console.log(response.data.data);
      setVisibilityValue(response.data.data.Visibility);
      const selectedPromoterResponse = response.data.data.Promoters;
      setSelectedPromotorData(selectedPromoterResponse);
      setSelectedMultiplePassDates(response.data.data.EventDateTime_id);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
          console.log(error.response);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchEventPromoters();
  }, []);

  const fetchEventPromoters = async () => {
    const payload = {
      event_id: eventId,
    };
    try {
      const FetchPromoterData = await axios.post(
        `${eventEndPoint.GET_EVENT_PROMOTER}`,
        payload
      );
      setEventPromotersData(FetchPromoterData.data.data);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
          console.log(error.response);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  const initialValues = loading
    ? {
        // ticketType: eventDates.length == 1 ? TicketType.SingleDay : "",
        ticketType: "",
        ticketVisiblity: "",
        ticketName: "",
        ticketDescription: "",
        ticketPrice: "",
        ticketQuantity: "",
        ticketMaxLimit: "",
        showPromoterModal: false,
      }
    : {
        ticketType: allticketsData.TicketType,
        ticketVisiblity: allticketsData.Visibility,
        ticketName: allticketsData.Name,
        ticketDescription: allticketsData.Description,
        ticketPrice: allticketsData.Price,
        ticketQuantity: allticketsData.Quantity,
        ticketMaxLimit: allticketsData.BookingMaxLimit,
      };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues,
    // validationSchema: eventTicketsObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        Event_id: eventId,
        eventTicket_id: ticketId,
        // Quantity: values.ticketQuantity,
        EventTicketVisibility: visibilityValue,
        // Description: values.ticketDescription,
        // BookingMaxLimit: values.ticketMaxLimit,
      };
      if (values.ticketQuantity !== allticketsData.Quantity)
        payload.Quantity = values.ticketQuantity;

      if (
        values.ticketDescription !== null &&
        values.ticketDescription !== "" &&
        values.ticketDescription !== undefined
      )
        payload.Description = values.ticketDescription;

      if (values.ticketPrice !== allticketsData.Price)
        payload.Price = values.ticketPrice;

      console.log(payload);
      // if (values.ticketType == TicketType.MultipleDay) {
      //   const multipleDateData = selectedEvents.map((item) => ({
      //     eventDateTime_id: item._id,
      //   }));
      //   payload.MultiplePassDates = multipleDateData;
      // }

      // if (visibilityValue == "3") {
      //   const promoterData = selectedOptions.map((promotor) => ({
      //     promoter_id: promotor.value,
      //   }));
      //   payload.EventPromoters = promoterData;
      // }

      console.log(payload);

      try {
        let response = await axios.post(
          `${normalEventTickets.UPDATE_NORMAL_EVENT_TICKET_BY_ID}`,
          payload
        );

        toast.success(response.data.message);
        setTimeout(() => {
          handleGoBack();
        }, 2000);
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
    },
  });

  const handlerSelectedPromoter = () => {
    const selectedIds = selectedPromotorData.map(
      (option) => option.promoter_id
    );
    const matchedOptions = [];

    // console.log("selectedPromotorData  ===> ", selectedPromotorData);
    // console.log("allPromoterDatas ===> ", allPromoterDatas);

    selectedPromotorData.forEach((options) => {
      const organizer = eventPromotersData.find(
        (org) => org.promoter_id === options.promoter_id
      );
      if (organizer) {
        matchedOptions.push({
          value: organizer.promoter_id,
          label: organizer.PromoterUsername,
        });
      }
    });

    // console.log({ matchedOptions });

    setSelectedOptions(matchedOptions);

    const updatedAllPromoterData = eventPromotersData
      .filter((organizer) => !selectedIds.includes(organizer._id))
      .map((organizer) => ({
        value: organizer.promoter_id,
        label: organizer.PromoterUsername,
      }));

    // console.log(updatedAllPromoterData);
    setAllPromoterData(updatedAllPromoterData);
    setLoading(false);
  };

  const handleEventClick = (eventdata) => {
    setSelectedEvents((prevSelected) => {
      const isSelected = prevSelected.some(
        (event) => event._id === eventdata._id
      );
      if (isSelected) {
        return prevSelected.filter((event) => event._id !== eventdata._id);
      } else {
        return [...prevSelected, eventdata];
      }
    });
  };

  const closeModal = () => {
    setFieldValue("ticketVisiblity", "");
  };

  const handleSelectChangePromoter = (selected) => {
    setSelectedOptions(selected);
    console.log({ selected });
  };

  const handleVisibilityChange = (e) => {
    setVisibilityValue(e.target.value);
    setFieldValue("ticketVisiblity", e.target.value);
  };

  const handleGoBack = () => {
    navigate(`/organizer/dashboard/event/ticket/${eventId}`);
  };

  return (
    <div className="mt-6">
      <Toaster />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="md:w-[70%]">
          {/* Ticket Type */}
          <div>
            <div className=" mt-3 ">
              <p className="text-black font-semibold text-xl">Event Type*</p>
              <div className="w-[85%] flex justify-between mt-1.5">
                {/* Event Type Booking */}
                {allticketsData.TicketType == "1" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketType"
                      id="singleDay"
                      value={TicketType.SingleDay}
                      checked={allticketsData.TicketType == "1"}
                      className="mr-2 transform scale-150"
                      onChange={handleChange}
                      disabled={allticketsData.TicketType != "1"}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="singleDay"
                    >
                      Single Day
                    </label>
                  </div>
                )}

                {allticketsData.TicketType == "2" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketType"
                      id="mulDay"
                      value={TicketType.MultipleDay}
                      checked={allticketsData.TicketType == "2"}
                      className="mr-2 transform scale-150"
                      onChange={handleChange}
                      disabled={allticketsData.TicketType != "2"}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="mulDay"
                    >
                      Multiple Day
                    </label>
                  </div>
                )}

                {allticketsData.TicketType == "3" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketType"
                      id="seaonpass"
                      value={TicketType.SeasonPass}
                      checked={allticketsData.TicketType == "3"}
                      className="mr-2 transform scale-150"
                      onChange={handleChange}
                      disabled={allticketsData.TicketType != "3"}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="seaonpass"
                    >
                      Season Pass
                    </label>
                  </div>
                )}
              </div>

              {/* Conditionally render the input field based on selected event type */}
              {values.ticketType == "2" && (
                <div className="mt-4">
                  {eventDates?.map((eventdata) => {
                    const isSelected =
                      selectedMultiplePassDates === eventdata._id;
                    return (
                      <div
                        key={eventdata._id}
                        onClick={() => handleEventClick(eventdata)}
                        className={`w-[90%] py-2 px-6 flex justify-between border-b-2  ${
                          isSelected ? "bg-gray-300" : ""
                        }`}
                      >
                        <p>
                          {formatDate3(eventdata.EventStartDate)} -{" "}
                          {formatDate3(eventdata.EventEndDate)}
                        </p>
                        <p>
                          {eventdata.EventStartTime} - {eventdata.EventEndTime}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Visisbility */}

          {/* <div className="">
            <div className=" mt-5 ">
              <p className="text-black font-semibold text-xl">Visisbility*</p> */}

          {/* First Fold */}

          {/* <div className="flex gap-x-12 mt-2"> */}
          {/* Event Type Booking */}
          {/* {allticketsData.Visibility == "2" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="all"
                      value={TicketVisiblity.All}
                      checked={allticketsData.Visibility == "1"}
                      className="mr-2 transform scale-150"
                      onChange={handleVisibilityChange}
                    />
                    <label className="text-black font-semibold" htmlFor="all">
                      All
                    </label>
                  </div>
                )} */}

          {/* Event Type Whatsapp */}
          {/* {allticketsData.Visibility == "2" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="allctm"
                      value={TicketVisiblity.AllCustomers}
                      checked={allticketsData.Visibility == "2"}
                      className="mr-2 transform scale-150"
                      onChange={handleVisibilityChange}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="allctm"
                    >
                      All Customers
                    </label>
                  </div>
                )}

                {allticketsData.Visibility == "3" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="promoter"
                      value={TicketVisiblity.Promoters}
                      checked={allticketsData.Visibility == "3"}
                      className="mr-2 transform scale-150"
                      onChange={handleVisibilityChange}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="promoter"
                    >
                      Promoters
                    </label>
                  </div>
                )}
              </div> */}

          {/* second Fold */}
          {/* <div className="w-[85%] flex justify-between mt-4"> */}
          {/* Event Type Booking */}
          {/* </div>
            </div>
          </div> */}

          {/* Promoter Pop  */}
          {/* {values.ticketVisiblity == TicketVisiblity.Promoters && (
            <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
              <div className="bg-white p-4  rounded-md  md:w-[50%] sm:w-[70%]">
                <div className="w-[96%] mx-auto flex justify-between">
                  <h1>Add Promoter</h1>
                  <p onClick={closeModal} className="cursor-pointer">
                    <span>
                      <IoIosCloseCircle size={20} />
                    </span>
                  </p>
                </div>

                <div>
                  <div className="mt-3">
                    <p className="text-black font-semibold text-lg mb-1">
                      Add Promoter
                    </p>
                    <Select
                      isMulti
                      name="promoters"
                      // options={allPromoterData}
                      className="basic-multi-select bg-Gray40"
                      classNamePrefix="select promoter"
                      // onChange={handleSelectChangePromoter}
                      value={selectedOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}
          {/* {allticketsData.Visibility == "3" && (
            <div className="mt-2 mb-10">
              <label
                htmlFor="promoters"
                className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
              >
                Promoters
              </label>
              <div className="bg-gray-50 border-gray-300 border rounded-md p-2">
                {allPromoterData?.map((promoter, index) => (
                  <div
                    className={`${
                      index === allPromoterData?.length - 1
                        ? "border-none"
                        : "border-b-[1px]"
                    } py-2 border-gray-300 `}
                    key={index}
                  >
                    <p>{promoter.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          <div className="">
            <div className=" mt-5 ">
              <p className="text-black font-semibold text-xl">Visibility*</p>

              {/* First Fold */}

              <div className="flex gap-x-12 mt-2">
                {/* Event Type Booking */}
                {allticketsData.Visibility == "1" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="all"
                      value={TicketVisiblity.All}
                      checked={allticketsData.Visibility == "1"}
                      className="mr-2 transform scale-150"
                      onChange={handleVisibilityChange}
                    />
                    <label className="text-black font-semibold" htmlFor="all">
                      All
                    </label>
                  </div>
                )}

                {/* Event Type Whatsapp */}
                {allticketsData.Visibility == "2" && (
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="allctm"
                      value={TicketVisiblity.AllCustomers}
                      checked={allticketsData.Visibility == "2"}
                      className="mr-2 transform scale-150"
                      onChange={handleVisibilityChange}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="allctm"
                    >
                      All Customers
                    </label>
                  </div>
                )}

                {allticketsData.Visibility == "3" && (
                  <div onClick={() => setFieldValue("ticketVisiblity", 3)}>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="promoter"
                      value={TicketVisiblity.Promoters}
                      checked={allticketsData.Visibility == "3"}
                      className="mr-2 transform scale-150"
                      // onChange={handleVisibilityChange}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="promoter"
                    >
                      Promoters
                    </label>
                  </div>
                )}
              </div>

              {/* second Fold */}
              <div className="w-[85%] flex justify-between mt-4">
                {/* Event Type Booking */}
              </div>
            </div>
          </div>

          {/* Promoter Pop  */}
          {/* {values.ticketVisiblity == TicketVisiblity.Promoters && ( */}
          {allticketsData.Visibility == "3" && (
            // <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white  rounded-md  md:w-[50%] sm:w-[70%]">
              {/* <div className="w-[96%] mx-auto flex justify-between">
                <h1>Add Promoter</h1>
                <p onClick={closeModal} className="cursor-pointer">
                  <span>
                    <IoIosCloseCircle size={20} />
                  </span>
                </p>
              </div> */}

              <div>
                <div className="">
                  <p className="text-black font-semibold text-base mb-1">
                    Add Promoter
                  </p>
                  <Select
                    isMulti
                    name="promoters"
                    options={allPromoterData}
                    className="basic-multi-select bg-Gray40"
                    classNamePrefix="select promoter"
                    // onChange={handleSelectChangePromoter}
                    value={selectedOptions}
                  />
                </div>
              </div>
            </div>
            // </div>
            // <div className="mt-4">
            //   <label
            //     htmlFor="promoters"
            //     className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
            //   >
            //     Promoters
            //   </label>
            //   <div className="bg-gray-50 border-gray-300 border rounded-md p-2">
            //     {selectedOptions?.map((promoter, index) => (
            //       <div
            //         className={`${
            //           index === selectedOptions?.length - 1
            //             ? "border-none"
            //             : "border-b-[1px]"
            //         } py-2 border-gray-300 `}
            //         key={index}
            //       >
            //         <p>{promoter.label}</p>
            //       </div>
            //     ))}
            //   </div>
            // </div>
          )}

          {/* Ticket Name  */}
          <div className="md:w-[80%] mt-4">
            <label
              htmlFor="name"
              className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
            >
              Ticket Name*
            </label>
            <input
              type="text"
              id="ticketName"
              name="ticketName"
              value={allticketsData.Name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.ticketName && touched.ticketName ? (
              <p className="font-Marcellus text-start text-red-900">
                {errors.ticketName}
              </p>
            ) : null}
          </div>

          {/* Ticket  Description*/}
          <div className="md:w-[80%] mt-4">
            <label
              htmlFor="eventTourDescription"
              className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
            >
              Ticket Description*
            </label>
            <textarea
              id="ticketDescription"
              name="ticketDescription"
              value={values?.ticketDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.ticketDescription && touched.ticketDescription ? (
              <p className="font-Marcellus text-start text-red-900">
                {errors.ticketDescription}
              </p>
            ) : null}
          </div>

          <div className="md:w-[80%] mt-4">
            <label
              htmlFor="name"
              className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
            >
              Price*
            </label>
            <input
              type="text"
              id="ticketPrice"
              name="ticketPrice"
              value={values?.ticketPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.ticketPrice && touched.ticketPrice ? (
              <p className="font-Marcellus text-start text-red-900">
                {errors.ticketPrice}
              </p>
            ) : null}
          </div>

          <div className="md:w-[80%] flex justify-between gap-x-4">
            <div className="w-[100%] mt-4">
              <label
                htmlFor="name"
                className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
              >
                Total Quantity*
              </label>
              <input
                type="text"
                id="ticketQuantity"
                name="ticketQuantity"
                value={values?.ticketQuantity}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.ticketQuantity && touched.ticketQuantity ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.ticketQuantity}
                </p>
              ) : null}
            </div>
            <div className="w-[100%] mt-4">
              <label
                htmlFor="name"
                className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
              >
                Booking Max Limit*
              </label>
              <input
                type="text"
                id="ticketMaxLimit"
                name="ticketMaxLimit"
                value={allticketsData.BookingMaxLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.ticketMaxLimit && touched.ticketMaxLimit ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.ticketMaxLimit}
                </p>
              ) : null}
            </div>
          </div>

          <div className="w-[80%] flex justify-end items-end gap-x-5 mt-6">
            <button
              className="px-5 py-2 mt-1 text-gray-600 bg-white border border-gray-300  hover:border-gray-400"
              type="button"
              onClick={() => handleGoBack()}
            >
              Cancel
            </button>
            <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateTicketByOrganizer;
