import React, { useEffect, useState } from "react";
import { ConvinienceFeeUnit } from "../../../../common/helper/Enum";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import { eventEndPoint, promocode } from "../../../../../services/apis";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Breadcrumb from "../../common/Breadcrumb";
import Select from "react-select";

const EditPromocodes = () => {
  const adminuser = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [promocodeData, setPromocodeData] = useState({});
  const [specificEvents, setSpecificEvents] = useState([]);
  const [openSpecificEvents, setOpenSpecificEvents] = useState(false);
  const [specificCustomers, setSpecificCustomers] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromocode();
  }, []);

  const fetchPromocode = async () => {
    const payload = {
      Promocode_id: id,
    };
    try {
      const response = await axios.post(`${promocode.GET_BY_ID}`, payload);
      console.log(response.data.data);
      setPromocodeData(response.data.data);
      setSpecificEvents(response.data.data.Events);
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
          // console.log(error.response);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

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
      setSpecificEvents(FetchEventData.data.data);
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

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  const values = loading
    ? {
        promocodeType: "",
        codeName: "",
        termsConditions: "",
        feeunit: 1,
        discountPrice: "",
        minimumCheckout: "",
        expiryDate: "",
        redemptionType: 0,
        visibility: "",
        selectedEvents: [],
        selectedCustomers: [],
      }
    : {
        promocodeType: Number(promocodeData.CanBeUsed),
        codeName: promocodeData.PromoCodeName,
        termsConditions: promocodeData.TermsCondition,

        feeunit: promocodeData.PromocodeType,
        discountPrice: promocodeData.Value,
        minimumCheckout: promocodeData.MinCheckoutAmount,
        // expiryDate: promocodeData.ExpiryDate,
        redemptionType: promocodeData.OneTimeUseFlag,
        visibility: promocodeData.PromocodeValidFor,
        selectedEvents: promocodeData?.Events,
        selectedCustomers: promocodeData?.CustomerIds,
      };

  const expiryDate = promocodeData?.ExpiryDate
    ? promocodeData.ExpiryDate.split("T")[0]
    : null;

  // Ensure the date is in YYYY-MM-DD format
  const formattedDate = expiryDate ? expiryDate : "";

  return (
    <div className="mt-[3%] ml-[2%]">
      <Toaster />
      <Breadcrumb path={"Promocode"} />
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
                  checked={values.promocodeType === 1}
                  disabled
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
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
                  checked={values.promocodeType === 2}
                  onClick={() => setOpenSpecificEvents(true)}
                  // disabled
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
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
                  className="block mb-2 text-start text-sm font-medium text-gray-900"
                >
                  Code Name
                </label>
                <input
                  type="text"
                  id="codeName"
                  name="codeName"
                  value={values.codeName}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Enter promocode"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {/* {errors.codeName && touched.codeName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.codeName}
                  </p>
                ) : null} */}
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
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                />
                {/* {errors.genreDescription && touched.genreDescription ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.genreDescription}
                </p>
              ) : null} */}
              </div>

              {/* unit  */}
              <div className="md:col-span-1 mt-6 md:mt-0s">
                <label
                  htmlFor="feeunit"
                  className="block mb-2 text-start text-sm font-medium text-gray-900"
                >
                  Unit*
                </label>
                <select
                  id="feeunit"
                  name="feeunit"
                  value={values.feeunit}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
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
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Discount Price*
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={values.discountPrice}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Enter Value "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                  // onChange={handleChange}
                  // onBlur={handleBlur}
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
                  value={formattedDate}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                    // onChange={handleChangeRedemption}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500focus:ring-2 "
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
              <div className="flex items-center mt-2 md:mt-0">
                <input
                  type="radio"
                  id="all"
                  name="visibilityType"
                  value="all"
                  disabled
                  checked={values.visibility === 1}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                />
                <label
                  htmlFor="all"
                  className="ml-2 text-base font-medium text-gray-900 "
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
                  disabled
                  checked={values.visibility === 2}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
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
        <div className="flex items-end justify-end mb-6">
          <button
            className="px-5 border  border-gray-400 py-2 text-black bg-white"
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/promocodes")}
          >
            Back
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
                  Close
                </button>
              </div>
              <div className="w-[100%] mt-6">
                {/* <label htmlFor="">Events</label> */}
                <Select
                  styles={dropdownStyles}
                  name="selectedEvents"
                  // options={specificEvents.map((event) => ({
                  //   label: event.EventName,
                  //   value: event._id,
                  // }))}
                  value={
                    specificEvents.find(
                      (event) =>
                        event._id === values.selectedEvents[0]?.event_id
                    )
                      ? {
                          label: specificEvents.find(
                            (event) =>
                              event._id === values.selectedEvents[0]?.event_id
                          ).EventName,
                          value: values.selectedEvents[0]?.event_id,
                        }
                      : null
                  }
                  isDisabled
                />
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
                    name="selectedCustomers"
                    // options={customers.map((event) => ({
                    //   label: event.MobileNumber,
                    //   value: event._id,
                    // }))}
                    value={
                      specificEvents.find(
                        (event) =>
                          event._id === values.selectedCustomers[0]?.event_id
                      )
                        ? {
                            label: specificCustomers.find(
                              (event) =>
                                event._id ===
                                values.selectedCustomers[0]?.event_id
                            ).MobileNumber,
                            value: values.selectedCustomers[0]?.event_id,
                          }
                        : null
                    }
                    isDisabled
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

export default EditPromocodes;
