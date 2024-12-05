import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { transformEventDateTime } from "../../../../../../../common/transformEventDateTime";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { eventsticketsByEventId } from "../../../../../../../../services/apis";
import { eventBulkTicketsObjectSchema } from "../../../../../../validation/YupValidation";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { formatDate3 } from "../../../../../../../common/formatDate2";
import CustomToast from "../../../../../../../promoter/common/CustomToast";

const CreateBulkTicket = ({ eventDates, setTicketCreation }) => {
  const adminuser = useSelector((store) => store.auth);

  const [eventDateFormatting, setEventDateFormatting] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // State for single selected date
  const [showCalendar, setShowCalendar] = useState(false); // State to show/hide calendar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { _id } = useParams();

  useEffect(() => {
    formatDateAndTime();
  }, [eventDates]);

  // console.log({ selectedDate });
  const navigate = useNavigate();

  const formatDateAndTime = () => {
    const transformedData = transformEventDateTime(eventDates);
    setEventDateFormatting(transformedData);
  };

  const initialValues = {
    ticketName: "",
    customerName: "",
    ticketPhoneNumber: "",
    ticketEmailId: "",
    ticketPrice: "",
    ticketQuantity: "",
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
    validationSchema: eventBulkTicketsObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsModalOpen(true);
      const payload = {
        event_id: _id,
        TicketName: values.ticketName,
        CustomerName: values.customerName,
        PhoneNumber: values.ticketPhoneNumber,
        Email: values.ticketEmailId,
        Quantity: values.ticketQuantity,
        Price: values.ticketPrice,
        CreatedBy: adminuser.adminSignupData.AdminRole,
        createduser_id: adminuser.adminSignupData.user_id,
        EventDateTime_id: selectedDate._id,
      };

      try {
        let response = await axios.post(
          `${eventsticketsByEventId.CREATE_EVENT_BULK_COMPOUND}`,
          payload
        );

        // setTicketCreation(false);
        // console.log("api response", response);
        toast.success(response.data.message);

        // resetForm();
        setSelectedDate([]);
        setIsModalOpen(false);
        setTicketCreation(false);
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
            setIsModalOpen(false);
            // setTimeout(() => {
            //   navigate("/superAdmin/dashboard/event");
            // }, 1000);
          }
        }
      }
    },
  });

  // console.log({ selectedDate });

  const handleDateChange = (date) => {
    if (date) {
      const selectedEvent = eventDateFormatting.find((event) => {
        const eventStartDate = new Date(event.EventStartDate);
        return (
          eventStartDate.getDate() === date.getDate() &&
          eventStartDate.getMonth() === date.getMonth() &&
          eventStartDate.getFullYear() === date.getFullYear()
        );
      });

      if (selectedEvent) {
        setSelectedDate(selectedEvent);
        setFieldValue("ticketDate", formatDate3(selectedEvent.EventStartDate)); // Update input field value
      } else {
        setSelectedDate(null);
        setFieldValue("ticketDate", ""); // Clear input field value
      }
      setShowCalendar(false); // Hide calendar after selecting a date
    }
  };

  const handleInputClick = () => {
    setShowCalendar(!showCalendar); // Toggle calendar visibility
  };

  const startDates = eventDateFormatting.map(
    (event) => new Date(event.EventStartDate)
  );

  return (
    <div>
      <Toaster />
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            aria-hidden="true"
          ></div>

          <div
            id="static-modal"
            data-modal-backdrop="static"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 text-center p-6">
                <div className="flex items-center justify-between border-b p-4 md:p-5 rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white w-full text-center">
                    Please wait while we process your request.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <div className="md:w-[85%]">
          <div className="md:w-[80%] mt-8">
            <label
              htmlFor="ticketName"
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

          <div className="md:w-[80%] mt-8">
            <label
              htmlFor="customerName"
              className="block mb-2 text-start text-base font-medium text-gray-900 "
            >
              Customer Name*
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={values.customerName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
            {errors.customerName && touched.customerName ? (
              <p className="font-Marcellus text-start text-red-900">
                {errors.customerName}
              </p>
            ) : null}
          </div>

          <div className="md:w-[80%] md:flex-row flex-col justify-between gap-x-4">
            <div className="w-[100%] mt-4">
              <label
                htmlFor="ticketPhoneNumber"
                className="block mb-2 text-start text-base font-medium text-gray-900 "
              >
                Phone Number*
              </label>
              <input
                type="text"
                id="ticketPhoneNumber"
                name="ticketPhoneNumber"
                value={values.ticketPhoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
              {errors.ticketPhoneNumber && touched.ticketPhoneNumber ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.ticketPhoneNumber}
                </p>
              ) : null}
            </div>
            <div className="w-[100%] mt-4">
              <label
                htmlFor="ticketEmailId"
                className="block mb-2 text-start text-base font-medium text-gray-900 "
              >
                Email*
              </label>
              <input
                type="email"
                id="ticketEmailId"
                name="ticketEmailId"
                value={values.ticketEmailId}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
              {errors.ticketEmailId && touched.ticketEmailId ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.ticketEmailId}
                </p>
              ) : null}
            </div>
          </div>

          <div className="md:w-[80%] flex md:flex-row flex-col justify-between gap-x-4">
            <div className="w-[100%] mt-4 z-10 relative">
              <label
                htmlFor="ticketDate"
                className="block mb-2 text-start text-base font-medium text-gray-900 "
              >
                Select Date*
              </label>
              <input
                type="text"
                id="ticketDate"
                name="ticketDate"
                value={values.ticketDate || ""}
                onChange={handleChange}
                onClick={handleInputClick}
                onBlur={handleBlur}
                readOnly // Prevent direct input
                className="bg-gray-50 border z-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
              {showCalendar && (
                <DatePicker
                  selected={
                    selectedDate ? new Date(selectedDate.EventStartDate) : null
                  }
                  onChange={handleDateChange}
                  includeDates={startDates}
                  dateFormat="yyyy-MM-dd"
                  inline
                  highlightDates={
                    selectedDate ? [new Date(selectedDate.EventStartDate)] : []
                  }
                  className="bg-gray-50 border absolute  z-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mt-2"
                />
              )}
              {errors.ticketDate && touched.ticketDate ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.ticketDate}
                </p>
              ) : null}
            </div>

            <div className="w-[100%] mt-4 z-10">
              <label
                htmlFor="ticketQuantity"
                className="block mb-2 text-start text-base font-medium text-gray-900 "
              >
                Total Quantity*
              </label>
              <input
                type="text"
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
              {/* {selectedDates.length !== 0 && (
                <>
                <h1 className="mt-6 text-xl font-semibold underline underline-offset-4">Selected dates For Bulk Tickets</h1>
                  {selectedDates.map((dates) => (
                    <div className="mt-2">
                      <div
                        key={dates._id}
                        className={`w-[90%] py-2 px-6 flex justify-between border-b-2 cursor-pointer`}
                      >
                        <p>
                          {formatDate3(dates.EventStartDate)} -{" "}
                          {formatDate3(dates.EventEndDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )} */}
            </div>
          </div>

          <div className="md:w-[80%] flex md:flex-row flex-col justify-between gap-x-4">
            <div className="w-[100%] mt-4">
              <label
                htmlFor="ticketPrice"
                className="block mb-2 text-start text-base font-medium text-gray-900"
              >
                Ticket Price*
              </label>
              <input
                type="text"
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
            <div className="w-[100%] mt-4"></div>
          </div>

          <div className="w-[80%] flex justify-end items-end gap-x-5 mt-6">
            <button
              className="px-5 py-2 mt-1 text-gray-600 bg-white border border-gray-300 hover:border-gray-400"
              type="button"
              onClick={() => setTicketCreation(false)}
            >
              Cancel
            </button>
            <button className="px-5 py-2 text-white bg-Gray40" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBulkTicket;
