import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ConvinienceFeeUnit } from "../../../../common/helper/Enum";
import { useFormik } from "formik";
import Select from "react-select";
import { useSelector } from "react-redux";
import {
  eventEndPoint,
  promocode,
  websiteCustomer,
} from "../../../../../services/apis";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatDateForInput } from "../../../../common/FormatDate";
import { promocodeObjectSchema } from "../../../validation/YupValidation";

const CreatePromocodes = ({ setPromoCodeCreationModal }) => {
  const adminuser = useSelector((store) => store.auth);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("");
  const [openSpecificEvents, setOpenSpecificEvents] = useState(false);
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [specificCustomers, setSpecificCustomers] = useState(false);
  const [customers, setcustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState();

  const navigate = useNavigate();

  const [today, setToday] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
      // setToday(today);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (today) {
      const date = formatDateForInput(today.toLocaleDateString("en-US"));
      setFormattedDate(date);
    }
  }, [today]);

  useEffect(() => {
    getALLEventData();
  }, []);

  const getALLEventData = async () => {
    try {
      const payload = {
        AdminRole: adminuser.adminSignupData.AdminRole,
        user_id: adminuser.adminSignupData.user_id,
      };

      const FetchEventData = await axios.post(
        `${eventEndPoint.GET_ALL_PUBLISHED_EVENTS_DATA}`,
        payload
      );

      // console.log("FetchEventData", FetchEventData.data);
      setPublishedEvents(FetchEventData.data.data);
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

  useEffect(() => {
    getAllCustomersData();
  }, []);

  const getAllCustomersData = async () => {
    try {
      const FetchOrganizerData = await axios.get(
        `${websiteCustomer.GET_ALL_CUSTOMER_DATA}`
      );

      console.log("FetchOrganizerData", FetchOrganizerData.data);
      setcustomers(FetchOrganizerData.data.data);
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

  const initialValues = {
    promocodeType: "",
    codeName: "",
    termsConditions: "",
    feeunit: 1,
    discountPrice: "",
    minimumCheckout: "",
    expiryDate: "",
    redemptionType: 0,
    visibility: "",
  };

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };
  const handleChangeRedemption = () => {
    setFieldValue("redemptionType", values.redemptionType === 1 ? 0 : 1);
  };

  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;

    // Set selected option state
    setSelectedOption(selectedValue);

    // Set enum values for promocodeType (1 for 'allEvents', 2 for 'specificEvents')
    setFieldValue("promocodeType", selectedValue === "allEvents" ? 1 : 2);
  };

  const handleVisibility = (e) => {
    const selectedValue = e.target.value;

    // Set selected option state
    setSelectedVisibility(selectedValue);

    // Set enum values for promocodeType (1 for 'all customers', 2 for 'specific customers')
    setFieldValue("visibility", selectedValue === "all" ? 1 : 2);
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
    validationSchema: promocodeObjectSchema,
    onSubmit: async (values) => {
      // promocode
      if (
        values.promocodeType === undefined ||
        values.promocodeType === null ||
        values.promocodeType === ""
      ) {
        return toast.error("Please select promocode type");
      }

      // code name Validation
      if (
        values.codeName === undefined ||
        values.codeName === "" ||
        values.codeName === null
      ) {
        return toast.error("Please Enter Event Name");
      }

      // Term and condition validation
      if (
        values.termsConditions === undefined ||
        values.termsConditions === "" ||
        values.termsConditions === null ||
        values.termsConditions.length < 5
      ) {
        return toast.error(
          "Please Enter Terms and Conditions with a minimum length of 5 characters"
        );
      }

      // expiry date Validation
      if (
        values.expiryDate === undefined ||
        values.expiryDate === "" ||
        values.expiryDate === null
      ) {
        return toast.error("Please Enter expiry date");
      }

      // discount price Validation
      if (
        values.discountPrice === undefined ||
        values.discountPrice === "" ||
        values.discountPrice === null
      ) {
        return toast.error("Please Enter discount price");
      }

      // discount price Validation
      if (
        values.minimumCheckout === undefined ||
        values.minimumCheckout === "" ||
        values.minimumCheckout === null
      ) {
        return toast.error("Please Enter minimum checkout amount");
      }

      // visibility Validation
      if (
        values.visibility === undefined ||
        values.visibility === null ||
        values.visibility === ""
      ) {
        return toast.error("Please select visibility");
      }

      const payload = {
        CanBeUsed: values.promocodeType,
        PromoCodeName: values.codeName,
        TermsCondition: values.termsConditions,
        PromocodeType: values.feeunit,
        Value: values.discountPrice,
        MinCheckoutAmount: Number(values.minimumCheckout),
        ExpiryDate: values.expiryDate,
        OneTimeUseFlag: values.redemptionType,
        PromocodeValidFor: values.visibility,
      };

      if (values.promocodeType === 2) {
        if (!selectedEvent?.value) {
          toast.error("Please select specific event");
          return;
        }
        payload.Events = [
          {
            event_id: selectedEvent?.value,
          },
        ];
      }

      if (values.visibility === 2) {
        if (!selectedCustomers?.value) {
          toast.error("Please select specific customers");
          return;
        }

        payload.CustomerIds = [
          {
            customer_id: selectedCustomers.value,
          },
        ];
      }

      if (values.codeName) {
        if (values.codeName > 12) {
          toast.error("Code Name should be at least 12 characters long");
          return;
        } else if (values.codeName < 6) {
          toast.error("Code Name should be at least 6 characters long");
          return;
        }
      }

      if (Number(values.feeunit) === 2 && values.discountPrice > 100) {
        toast.error("Discount percentage should not exceed 100");
        return;
      }

      console.log("payload", payload);
      try {
        let response = await axios.post(
          `${promocode.CREATE_PROMOCODE}`,
          payload
        );
        console.log(response.data);
        toast.success(response.data.message);
        setTimeout(() => {
          setPromoCodeCreationModal(false);
        }, 1000);
        resetForm();
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

  return (
    <div>
      <Toaster />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div>
          <div className="md:w-[70%] mt-[2%]">
            <div className="w-full md:grid gap-6 mb-6 md:grid-cols-2">
              <div className="flex items-center mt-4">
                <input
                  type="radio"
                  id="allEvents"
                  name="promocodeType"
                  value="allEvents"
                  checked={selectedOption === "allEvents"}
                  onChange={handleOptionChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500   focus:ring-2 "
                />
                <label
                  htmlFor="allEvents"
                  className="ml-2 text-sm font-medium text-gray-900 "
                >
                  All Events
                </label>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="radio"
                  id="specificEvents"
                  name="promocodeType"
                  value="specificEvents"
                  onClick={() => setOpenSpecificEvents(true)}
                  checked={selectedOption === "specificEvents"}
                  onChange={handleOptionChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 d  focus:ring-2 "
                />
                <label
                  htmlFor="specificEvents"
                  className="ml-2 text-sm font-medium text-gray-900 "
                >
                  Specific Events
                </label>
              </div>

              {/* code Name Input Field  */}
              <div className="md:col-span-2 mt-6 md:mt-0">
                <label
                  htmlFor="codeName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Code Name
                </label>
                <input
                  type="text"
                  id="codeName"
                  name="codeName"
                  value={values.codeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promocode"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                />
                {errors.codeName && touched.codeName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.codeName}
                  </p>
                ) : null}
              </div>

              {/* promocode terms and conditions*/}
              <div className="md:col-span-2 mb-4 mt-6 md:mt-0">
                <label
                  htmlFor="termsConditions"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Terms & Conditions
                </label>
                <textarea
                  id="termsConditions"
                  name="termsConditions"
                  value={values.termsConditions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                />
                {errors.termsConditions && touched.termsConditions ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.termsConditions}
                  </p>
                ) : null}
              </div>

              {/* unit  */}
              <div className="md:col-span-1 mt-6 md:mt-0">
                <label
                  htmlFor="feeunit"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Unit*
                </label>
                <select
                  id="feeunit"
                  name="feeunit"
                  value={values.feeunit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                  {Object.keys(ConvinienceFeeUnit).map((key) => (
                    <option key={key} value={ConvinienceFeeUnit[key]}>
                      {key}
                    </option>
                  ))}
                </select>
                {/* {errors.organizerEmail && touched.organizerEmail ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerEmail}
                  </p>
                ) : null} */}
              </div>

              {/* discount Price . */}
              <div className="mt-6 md:mt-0">
                <label
                  htmlFor="discountPrice"
                  className="block mb-2 text-start text-sm font-medium text-gray-900"
                >
                  Discount Price*
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={values.discountPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Value "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {/* {errors.organizerPhoneNo && touched.organizerPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerPhoneNo}
                  </p>
                ) : null} */}
              </div>

              {/* minimum checkout value */}
              <div className="mt-6 md:mt-0">
                <label
                  htmlFor="minimumCheckout"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Minimum checkout*
                </label>
                <input
                  type="number"
                  id="minimumCheckout"
                  name="minimumCheckout"
                  value={values.minimumCheckout}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Value "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {/* {errors.organizerPhoneNo && touched.organizerPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerPhoneNo}
                  </p>
                ) : null} */}
              </div>

              {/*  Expiry date */}
              <div className="mt-6 md:mt-0">
                <label
                  htmlFor="expiryDate"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Expiry Date*
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  min={formattedDate}
                  value={values.expiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {/* {errors.organizerPhoneNo && touched.organizerPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerPhoneNo}
                  </p>
                ) : null} */}
              </div>

              {/* redemption */}
              <div className="col-span-2 mt-6 md:mt-0">
                <p className="font-semibold">Redemption value</p>
                <div className="flex items-center mt-4">
                  <input
                    type="radio"
                    id="redemption"
                    name="redemptionType"
                    value="redemption"
                    checked={values.redemptionType}
                    onChange={handleChangeRedemption}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500   focus:ring-2 "
                  />
                  <label
                    htmlFor="redemption"
                    className="ml-2 text-base font-medium text-gray-900"
                  >
                    Once per user
                  </label>
                </div>
              </div>

              {/*visibility  */}

              <p className="font-semibold col-span-2 mt-6 md:mt-0">
                Visibility
              </p>
              <div className="flex items-center mt-2 md:mt-0 ">
                <input
                  type="radio"
                  id="all"
                  name="visibilityType"
                  value="all"
                  checked={selectedVisibility === "all"}
                  onChange={handleVisibility}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                />
                <label
                  htmlFor="all"
                  className="ml-2 text-base font-medium text-gray-900"
                >
                  All customers
                </label>
              </div>

              <div className="flex items-center mt-2 md:mt-0 ">
                <input
                  type="radio"
                  id="specific"
                  name="visibilityType"
                  value="specific"
                  onClick={() => setSpecificCustomers(true)}
                  checked={selectedVisibility === "specific"}
                  onChange={handleVisibility}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                />
                <label
                  htmlFor="specific"
                  className="ml-2 text-base font-medium text-gray-900 "
                >
                  Specific Customers
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-6">
          <button
            className="px-5 border border-gray-400 py-2 text-black bg-white"
            type="button"
            onClick={() => setPromoCodeCreationModal(false)}
          >
            cancel
          </button>
          <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
            Save
          </button>
        </div>

        {openSpecificEvents && (
          <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-4 rounded-md md:w-[60%] lg:w-[50%] sm:w-[70%]">
              <div className="flex items-center justify-between">
                <h1 className="mt-2 text-lg">Event</h1>

                <button
                  className="bg-Gray40 text-white px-2 py-2"
                  onClick={() => setOpenSpecificEvents(false)}
                  type="button"
                >
                  <MdClose />
                </button>
              </div>
              <div className="w-[100%] mt-6">
                {/* <label htmlFor="">Events</label> */}
                <div>
                  <Select
                    styles={dropdownStyles}
                    options={publishedEvents.map((event) => ({
                      label: event.EventName,
                      value: event._id,
                    }))}
                    value={selectedEvent}
                    onChange={setSelectedEvent}
                    placeholder="Select event"
                    isClearable
                  />
                  <button
                    className="bg-Gray40 text-white px-2 py-2"
                    onClick={() => setOpenSpecificEvents(false)}
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {specificCustomers && (
          <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-4 rounded-md md:w-[60%] lg:w-[50%] sm:w-[70%]">
              <div className="flex items-center justify-between">
                <h1 className="mt-2 text-lg">Customers</h1>

                <button
                  className="bg-Gray40 text-white px-2 py-2"
                  onClick={() => setSpecificCustomers(false)}
                  type="button"
                >
                  <MdClose />
                </button>
              </div>
              <div className="w-[100%] mt-6">
                {/* <label htmlFor="">Events</label> */}
                <div>
                  <Select
                    styles={dropdownStyles}
                    options={customers.map((event) => ({
                      label: event.MobileNumber,
                      value: event._id,
                    }))}
                    value={selectedCustomers}
                    onChange={setSelectedCustomers}
                    placeholder="Select customer"
                    isClearable
                  />
                  <button
                    className="bg-Gray40 text-white px-2 py-2"
                    onClick={() => setSpecificCustomers(false)}
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePromocodes;
