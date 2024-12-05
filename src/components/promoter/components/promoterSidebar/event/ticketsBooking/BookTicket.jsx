import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { IoMdTime } from "react-icons/io";
import { FaMapLocation } from "react-icons/fa6";
import { promotorTicketBookingValidation } from "../../../../validation/YupValidation";
import { promoterEndPointPannel } from "../../../../../../services/apis";
import { useSelector } from "react-redux";
import CustomToast from "../../../../common/CustomToast";
const BookTicket = ({
  bookingData,
  setBookingData,
  setCheckOutPage,
  eventId,
  handleDecrease,
  handleIncrease,
  counts,
  setCounts,
  eventTicketsData,
  eventName,
  newEventdate,
  venueCity,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const promoterUser = useSelector((store) => store.promoterauth);
  const [eventDetails, setEventDetails] = useState();

  const [selectedTicketData, setSelectedTicketData] = useState(
    bookingData.selectedTickets[0]
  );
  console.log("eventTicketsData", eventTicketsData[0].TicketType);

  const selectedTicket = eventTicketsData.find(
    (ticket) => ticket._id === selectedTicketData._id
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const message = `
Thank you, ${eventDetails?.data?.CustomerName} ! 
Your tickets for the 
${eventName} on ${newEventdate}
have been successfully booked.

Tickets: ${Number(bookingData.totalTickets)} ${selectedTicketData.Name}
Amount Paid: Rs.${selectedTicket.Price * Number(bookingData.totalTickets)}
Check your email for more details.
`;

  const date = selectedTicketData.EventStartDateTime;
  const eventDate = new Date(date);
  const eventStartDate = eventDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
  });

  const [isWhatsApp, setIsWhatsApp] = useState(1);

  const initialValues = {
    FullName: "",
    PhoneNo: "",
    Email: "",
    noteDescription: "",
    WhatsAppNo: "",
  };

  // console.log({selectedTicketData}
  console.log(venueCity);
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
    validationSchema: promotorTicketBookingValidation,
    onSubmit: async (values) => {
      const payload = {
        promoter_id: promoterUser.promoterSignupData.user_id,
        event_id: eventId,
        EventDateTime_id: selectedTicketData.EventDateTime_id,
        EventTicket_id: selectedTicketData._id,
        CustomerName: values.FullName,
        PhoneNumber: values.PhoneNo,
        isWhatsAppNumberisSame: isWhatsApp,
        Email: values.Email,
        TicketQuantity: Number(bookingData.totalTickets),
        PromoterNote: values.noteDescription,
        EventTicketType: eventTicketsData[0].TicketType,
      };

      if (isWhatsApp === 0) {
        payload.WhatsAppNumber = values.WhatsAppNo;
      }

      if (values.noteDescription === "") {
        delete payload.PromoterNote;
      }

      console.log({ payload });

      try {
        let response = await axios.post(
          `${promoterEndPointPannel.BOOKING_TICKET_BY_PROMOTER}`,
          payload
        );
        console.log(response.data);
        setEventDetails(response.data);
        setIsModalOpen(true);
        // toast.custom(
        //   (t) => (
        //     <CustomToast
        //       message={message}
        //       // isVisible={t.visible}
        //       onClose={() => toast.dismiss(t.id)}
        //     />
        //   ),
        //   {
        //     duration: Infinity,
        //     position: "top-center",
        //     // animation: t.visible ? "easeInOut" : " 1s ease",
        //   }
        // );
        //  {
        //
        //  }

        console.log(response?.data?.data?.CustomerName);
        console.log("date", eventStartDate);
        // setTimeout(() => {
        //   navigate("/promoter/dashboard/event");
        // }, 2000);
        // console.log(response.data);
        //   resetForm();
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

  // if (isModalOpen) return <CustomToast setIsModalOpen={setIsModalOpen} />;

  return (
    <div>
      {isModalOpen && (
        <CustomToast
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          message={message}
          url={"/promoter/dashboard/event"}
          heading={"Order Details"}
        />
      )}

      <Toaster />
      <div className="w-[96%] mx-auto pb-[200px]">
        <div className="w-full flex justify-between">
          <h1 className="md:text-4xl text-2xl mt-5 font-bold text-black">
            Contact information
          </h1>
          <button
            type="button"
            onClick={() => setCheckOutPage(false)}
            className="border border-[#666666] w-[20%] mt-5 text-[#666666] md:h-12 rounded"
          >
            Back
          </button>
        </div>

        {/* Form Information  */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:gap-x-6 ">
              <div className="md:w-[60%] w-full md:mt-[2%] mt-8 h-auto">
                <div className="w-full grid gap-2 md:gap-6 mb-6 md:grid-cols-2">
                  <div className="mt-2 md:col-span-2">
                    <label
                      htmlFor="FullName"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="FullName"
                      name="FullName"
                      value={values.FullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter Name"
                    />
                    {errors.FullName && touched.FullName ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.FullName}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-2 ">
                    <label
                      htmlFor="PhoneNo"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Phone No.*
                    </label>
                    <input
                      type="text"
                      id="PhoneNo"
                      name="PhoneNo"
                      value={values.PhoneNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="Enter Phone no."
                    />
                    {errors.PhoneNo && touched.PhoneNo ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.PhoneNo}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="WhatsAppNo"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Is This Number a WhatsApp Number?*
                    </label>
                    <div className="flex gap-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isWhatsApp"
                          value="yes"
                          checked={isWhatsApp === 1}
                          onChange={() => setIsWhatsApp(1)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isWhatsApp"
                          value="no"
                          checked={isWhatsApp === 0}
                          onChange={() => setIsWhatsApp(0)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {isWhatsApp === 0 && (
                    <>
                      <div className="mt-2">
                        <label
                          htmlFor="WhatsAppNo"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          WhatsApp No.*
                        </label>
                        <input
                          type="text"
                          id="WhatsAppNo"
                          name="WhatsAppNo"
                          value={values.WhatsAppNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="Enter WhatsApp number here"
                        />
                      </div>
                      <br />
                    </>
                  )}

                  {/* Email id  */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="Email"
                      className="block mb-2 text-start text-sm font-medium text-gray-900"
                    >
                      Email Id*
                    </label>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      value={values.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter  email Id "
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    />
                    {errors.Email && touched.Email ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.Email}
                      </p>
                    ) : null}
                  </div>

                  {/* Age selection */}
                  {/* <div className="">
                    <label
                      htmlFor="Age"
                      className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Age*
                    </label>
                    <input
                      type="text"
                      id="Age"
                      name="Age"
                      value={values.Age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Age "
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {errors.Age && touched.Age ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.Age}
                      </p>
                    ) : null}
                  </div> */}

                  <div className="md:col-span-2 mb-4">
                    <label
                      htmlFor="noteDescription"
                      className="block mb-2 text-start text-sm font-medium text-gray-900 "
                    >
                      Remark
                    </label>
                    <textarea
                      id="noteDescription"
                      name="noteDescription"
                      value={values.noteDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    />
                    {errors.noteDescription && touched.noteDescription ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.noteDescription}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="md:w-[40%] w-full h-auto bg-[#F5F5F5] mt-[4%] z-30">
                <div className="p-6 ">
                  <div className="flex justify-between border-Gray85 border-b-[2px] pb-4 ">
                    <p className="text-black text-xl font-bold">
                      {selectedTicketData.Name}
                    </p>
                    <p className="text-black text-xl font-semibold">
                      Rs.{selectedTicketData.Price}
                    </p>
                  </div>

                  <div className="mt-3">
                    {(() => {
                      const startTimeObj = new Date(
                        selectedTicketData.EventStartDateTime
                      );
                      const endTimeObj = new Date(
                        selectedTicketData.EventEndDateTime
                      );

                      const startTime = startTimeObj.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "UTC",
                        }
                      );

                      const endTime = endTimeObj.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "UTC",
                      });

                      return (
                        <div className="flex justify-between">
                          {/* <p className="flex mt-2">
                            {" "}
                            <span className="mr-2 ">
                              <IoMdTime size={25} color="black" />
                            </span>
                            {startTime} - {endTime}
                          </p> */}

                          {venueCity && (
                            <p className="text-gray-600 mt-2 flex">
                              <span className="pr-2">
                                <FaMapLocation size={23} />
                              </span>
                              {venueCity}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <p className="mt-4 text-[#868686] border-Gray85 border-b-[2px] pb-4">
                    {selectedTicketData?.Description?.split("\n").map(
                      (line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      )
                    )}
                  </p>

                  <p className="mt-3 text-xl text-black font-normal pb-4 border-Gray85 border-b-[1px] border-dotted  ">
                    Quantity = {""}
                    {bookingData.totalTickets && bookingData.totalTickets > 0
                      ? bookingData.totalTickets
                      : 0}
                  </p>
                  <div className="flex justify-center items-center mt-4">
                    <button
                      type="button"
                      className="bg-[#666666] text-white py-1 px-2 rounded-l"
                      onClick={() => handleDecrease(selectedTicket._id)}
                    >
                      -
                    </button>
                    <span className="mx-4">
                      {Object.values(counts) > 0 ? Object.values(counts) : 0}
                    </span>
                    <button
                      type="button"
                      className="bg-[#666666] text-white py-1 px-2 rounded-r"
                      onClick={() => handleIncrease(selectedTicket._id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex justify-between mt-5 ">
                    <p className="text-black text-xl font-bold">Total</p>
                    <p className="text-black text-xl font-semibold">
                      {bookingData.totalPrice}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#666666] mt-5 w-[100%] text-white py-3 px-4 rounded"
                  >
                    Book ticket
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
