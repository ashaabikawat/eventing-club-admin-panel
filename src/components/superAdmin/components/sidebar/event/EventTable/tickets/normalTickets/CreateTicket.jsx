import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  TicketType,
  TicketVisiblity,
} from "../../../../../../../common/helper/Enum";
import { transformEventDateTime } from "../../../../../../../common/transformEventDateTime";
import { formatDate3 } from "../../../../../../../common/formatDate2";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";
import {
  eventsticketsByEventId,
  promoterEndpoint,
} from "../../../../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import AddPromoter from "./AddPromoter";
import Select from "react-select";
import { eventTicketsObjectSchema } from "../../../../../../validation/YupValidation";
import { useNavigate, useParams } from "react-router-dom";

const CreateTicket = ({
  eventDates,
  promoterData,
  onchangePromotor,
  setTicketCreation,
  eventStatus,
}) => {
  // console.log("promoterData", promoterData);
  // console.log("onchangePromotor", onchangePromotor);

  const [eventDateFormatting, setEventDateFormatting] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [allPromoterData, setAllPromoterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoterID, setPromoterID] = useState([promoterData]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visibilityValue, setVisibilityValue] = useState("");

  const [allSelected, setAllSelected] = useState(false);

  console.log("allPromoterData", allPromoterData);

  useEffect(() => {
    formatDateAndTime();
    if (promoterData.length === 0 && eventStatus == "2") {
      toast.error("Please add promotor in the event ");
    }
  }, []);

  const { _id } = useParams();
  const navigate = useNavigate();

  const formatDateAndTime = () => {
    const transformedData = transformEventDateTime(eventDates);
    setEventDateFormatting(transformedData);
  };

  const initialValues = {
    ticketType: eventDates.length == 1 ? TicketType.SingleDay : "",
    ticketVisiblity: "",
    ticketName: "",
    ticketDescription: "",
    ticketPrice: "",
    ticketQuantity: "",
    ticketMaxLimit: "",
    showPromoterModal: false,
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: eventTicketsObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        Event_id: _id,
        EventTicketType: values.ticketType,
        EventTicketVisibility: visibilityValue,
        Name: values.ticketName,
        Description: values.ticketDescription,
        Price: values.ticketPrice,
        Quantity: values.ticketQuantity,
        BookingMaxLimit: values.ticketMaxLimit,
      };

      if (values.ticketType == TicketType.SingleDay) {
        const singleTicketDateID = eventDates.map((item) => ({
          eventDateTime_id: item._id,
        }));
        payload.EventDateTimeIds = singleTicketDateID;
      }

      if (values.ticketType == TicketType.MultipleDay) {
        const multipleDateData = selectedEvents.map((item) => ({
          eventDateTime_id: item._id,
        }));
        payload.EventDateTimeIds = multipleDateData;
      }

      if (visibilityValue == "3") {
        const promoterData = selectedOptions.map((promotor) => ({
          promoter_id: promotor.value,
        }));

        if (promoterData.length === 0) {
          toast.error("Please select at least one promoter");
          return;
        }

        payload.EventPromoters = promoterData;
      }

      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(
          ([key, value]) =>
            value !== undefined && value !== null && value !== ""
        )
      );

      try {
        let response = await axios.post(
          `${eventsticketsByEventId.CREATE_EVENT_TICKETS}`,
          cleanedPayload
        );

        toast.success(response.data.message);
        setTicketCreation(false);

        // setTimeout(() => {
        //   navigate("/superAdmin/dashboard/event");
        // }, 2000);
        // resetForm();
        setVisibilityValue("");
        setEventDateFormatting([]);

        // console.log(response.data.data);
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

  // const handleEventClick = (eventdata) => {
  //   setSelectedEvents((prevSelected) => {
  //     const isSelected = prevSelected.some(
  //       (event) => event._id === eventdata._id
  //     );
  //     if (isSelected) {
  //       return prevSelected.filter((event) => event._id !== eventdata._id);
  //     } else {
  //       return [...prevSelected, eventdata];
  //     }
  //   });
  // };

  // const storeSelectedPromoters = (PDdata) => {
  //   const formattedData = PDdata.map((promoter) => ({
  //     _id: promoter.value,
  //     FullName: promoter.label,
  //   }));
  //   setPromoterID(formattedData);
  //   console.log({ formattedData });
  //   onchangePromotor(formattedData);
  // };

  // Call All Promoter Api if modal is true
  useEffect(() => {
    if (values.ticketVisiblity == TicketVisiblity.Promoters) {
      if (allPromoterData.length === 0) {
        fetchPromoterData();
      } else {
        setLoading(false);
      }
    }
  }, [values.ticketVisiblity, allPromoterData]);

  const fetchPromoterData = async () => {
    try {
      let response = await axios.get(
        `${promoterEndpoint.GET_ALL_PROMOTER_DATA_URL}`
      );

      console.log("response check ===>", response.data.data);
      // setLoading(false);

      setAllPromoterData(response.data.data);
      handlerSelectedPromoter(response.data.data);
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

  // Close Promoter Pop
  const closeModal = () => {
    setFieldValue("ticketVisiblity", "");
  };

  const handlerSelectedPromoter = (allPromoterDatas) => {
    // Extract the selected IDs
    const selectedIds = promoterData.map((option) => option._id);

    // Check which selected IDs exist in apiAllPromoterData
    const matchedOptions = [];

    promoterData.forEach((options) => {
      const organizer = allPromoterDatas.find(
        (org) => org._id === options.promoter_id
      );
      if (organizer) {
        matchedOptions.push({
          value: organizer._id,
          label: organizer.Username,
        });
      }
    });

    // console.log({ matchedOptions });

    // Update state with matched options
    setSelectedOptions(matchedOptions);
    // onpromoter(matchedOptions);

    // Filter out matched options from apiAllPromoterData
    // const updatedAllPromoterData = allPromoterDatas
    //   .filter((organizer) => !selectedIds.includes(organizer._id))
    //   .map((organizer) => ({
    //     value: organizer._id,
    //     label: organizer.FullName,
    //   }));

    setLoading(false);
    // // console.log(updatedAllPromoterData);
    setAllPromoterData(matchedOptions);
  };

  const handleSelectChangePromoter = (selected) => {
    setSelectedOptions(selected);
    console.log({ selected });
  };

  // console.log({selectedOptions});

  const handleVisibilityChange = (e) => {
    setVisibilityValue(e.target.value);
    setFieldValue("ticketVisiblity", e.target.value);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all events
      setSelectedEvents([]);
    } else {
      // Select all events
      setSelectedEvents(eventDateFormatting);
    }
    setAllSelected(!allSelected);
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

  return (
    <div className="md:mt-6 mt-8">
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
              <div className="md:w-[50%] flex justify-between mt-1.5">
                {/* Event Type Booking */}
                {eventDates.length == 1 ? (
                  <div>
                    <input
                      type="radio"
                      name="ticketType"
                      id="singleDay"
                      value={TicketType.SingleDay}
                      checked={values.ticketType === "1"}
                      className="mr-2 transform scale-150"
                      onChange={handleChange}
                      disabled={eventDates.length > 1}
                    />
                    <label
                      className="text-black font-semibold"
                      htmlFor="singleDay"
                    >
                      Single Day
                    </label>
                  </div>
                ) : (
                  <>
                    {/* Event Type Registration */}
                    <div>
                      <input
                        type="radio"
                        name="ticketType"
                        id="mulDay"
                        value={TicketType.MultipleDay}
                        checked={values.ticketType === "2"}
                        className="mr-2 transform scale-150"
                        onChange={handleChange}
                        disabled={eventDates.length === 1}
                      />
                      <label
                        className="text-black font-semibold"
                        htmlFor="mulDay"
                      >
                        Multiple Day
                      </label>
                    </div>

                    {/* Event Type Whatsapp */}
                    <div>
                      <input
                        type="radio"
                        name="ticketType"
                        id="seaonpass"
                        value={TicketType.SeasonPass}
                        checked={values.ticketType === "3"}
                        className="mr-2 transform scale-150"
                        onChange={handleChange}
                        disabled={eventDates.length === 1}
                      />
                      <label
                        className="text-black font-semibold"
                        htmlFor="seaonpass"
                      >
                        Season Pass
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Conditionally render the input field based on selected event type */}
              {values.ticketType == TicketType.MultipleDay && (
                <div className="mt-4">
                  <div className="w-[90%] py-2 px-6 flex justify-between border-b-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                      <span className="ml-2">Select All Dates</span>
                    </label>
                  </div>
                  {eventDateFormatting.map((eventdata) => {
                    const isSelected = selectedEvents.some(
                      (event) => event._id === eventdata._id
                    );
                    return (
                      <div
                        key={eventdata._id}
                        onClick={() => handleEventClick(eventdata)}
                        className={`w-[90%] py-2 px-6 flex justify-between border-b-2 cursor-pointer ${
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

          <div className="md:w-[60%]">
            <div className=" mt-5 ">
              <p className="text-black font-semibold text-xl">Visibility*</p>

              {/* First Fold */}
              {eventStatus != "2" && (
                <div className="w-[85%] flex justify-between mt-2">
                  {/* Event Type Booking */}
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="all"
                      value={TicketVisiblity.All}
                      checked={values.ticketVisiblity === "1"}
                      className="mr-2 transform scale-150"
                      onChange={handleVisibilityChange}
                    />
                    <label className="text-black font-semibold" htmlFor="all">
                      All
                    </label>
                  </div>

                  {/* Event Type Whatsapp */}
                  <div>
                    <input
                      type="radio"
                      name="ticketVisiblity"
                      id="allctm"
                      value={TicketVisiblity.AllCustomers}
                      checked={values.ticketVisiblity === "2"}
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
                </div>
              )}

              {/* second Fold */}
              <div className="w-[85%] flex justify-between mt-4">
                {/* Event Type Booking */}
                <div onClick={() => setFieldValue("ticketVisiblity", 3)}>
                  <input
                    type="radio"
                    name="ticketVisiblity"
                    id="promoter"
                    value={TicketVisiblity.Promoters}
                    checked={visibilityValue === "3"}
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
              </div>
            </div>
          </div>

          {/* Promoter Pop  */}
          {values.ticketVisiblity == TicketVisiblity.Promoters &&
            // (allPromoterData.length > 0 && selectedOptions.length > 0 ? (
            (allPromoterData.length > 0 ? (
              <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white p-4 rounded-md md:w-[50%] w-[90%]">
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
                        options={allPromoterData}
                        className="basic-multi-select bg-Gray40"
                        classNamePrefix="select promoter"
                        onChange={handleSelectChangePromoter}
                        value={selectedOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white p-4 rounded-md md:w-[50%] sm:w-[70%]">
                  <div className="w-[100%] mx-auto flex justify-between">
                    <h1 className="text-2xl font-bold">Attention</h1>
                    <p onClick={closeModal} className="cursor-pointer">
                      <span>
                        <IoIosCloseCircle size={20} />
                      </span>
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-red-700 font-semibold text-lg mb-1">
                      Please add promoters to the event before creating tickets.
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {/* Ticket Name  */}
          <div className="md:w-[80%] mt-4">
            <label
              htmlFor="name"
              className="block mb-2 text-start text-base font-medium text-gray-900 "
            >
              Ticket Name*
            </label>
            <input
              type="text"
              id="ticketName"
              name="ticketName"
              value={values.ticketName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
              className="block mb-2 text-start text-base font-medium text-gray-900 "
            >
              Ticket Description
            </label>
            <textarea
              id="ticketDescription"
              name="ticketDescription"
              value={values.ticketDescription || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={5}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
            />
            {/* {errors.ticketDescription && touched.ticketDescription ? (
              <p className="font-Marcellus text-start text-red-900">
                {errors.ticketDescription}
              </p>
            ) : null} */}
          </div>

          <div className="md:w-[80%] mt-4">
            <label
              htmlFor="name"
              className="block mb-2 text-start text-base font-medium text-gray-900 "
            >
              Price*
            </label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              value={values.ticketPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                className="block mb-2 text-start text-base font-medium text-gray-900 "
              >
                Total Quantity*
              </label>
              <input
                type="number"
                id="ticketQuantity"
                name="ticketQuantity"
                value={values.ticketQuantity}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                className="block mb-2 text-start text-base font-medium text-gray-900 "
              >
                Booking Max Limit*
              </label>
              <input
                type="number"
                id="ticketMaxLimit"
                name="ticketMaxLimit"
                value={values.ticketMaxLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
              onClick={() => setTicketCreation(false)}
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

export default CreateTicket;
