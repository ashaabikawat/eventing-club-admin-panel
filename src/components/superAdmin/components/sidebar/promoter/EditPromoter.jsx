import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { promoterEndpoint } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { promoterObjectSchema } from "../../../validation/YupValidation";
import EditAddress from "../../../../common/EditAddress";

const EditPromoter = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [promoterData, setPromoterData] = useState({});
  const [loading, setLoading] = useState(true);

  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();

  useEffect(() => {
    getPromoterDataById();
  }, []);

  const getPromoterDataById = async () => {
    try {
      const payload = {
        user_id: _id,
      };

      let response = await axios.post(
        `${promoterEndpoint.GET_PROMOTER_DATA_BY_ID_URL}`,
        payload
      );

      setPromoterData(response.data.data);
      setStateIsoCode(response?.data?.data?.StateIsoCode);
      setStateName(response?.data?.data?.State);
      setCityIsoCode(response?.data?.data?.CityIsoCode);
      setCityName(response?.data?.data?.City);
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

  const initialValues = loading
    ? {
        promoterFullName: "",
        promoterDescription: "",
        promoterEmail: "",
        promoterPhoneNo: "",
        promoterPassword: "",
      }
    : {
        promoterFullName: promoterData.FullName,
        promoterDescription: promoterData.About,
        promoterEmail: promoterData.Email,
        promoterPhoneNo: promoterData.Phone1,
      };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues,
    // validationSchema: promoterObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        user_id: _id,
        // Email: values.promoterEmail,
        // Password: values.promoterPassword,
        // FullName: values.promoterFullName,
        // Description: values.promoterDescription,
        // PhoneNumber: values.promoterPhoneNo,
        // Country: "India",
        // CountryIsoCode: "IN",
        // State: stateName,
        // StateIsoCode: stateIsoCode,
        // City: cityName,
        // CityIsoCode: cityIsoCode,
        // SendMailFlag: isChecked,
      };
      if (
        values.promoterFullName !== promoterData.FullName &&
        values.promoterFullName !== null &&
        values.promoterFullName !== "" &&
        values.promoterFullName !== undefined
      )
        payload.FullName = values.promoterFullName;

      if (
        values.promoterEmail !== promoterData.Email &&
        values.promoterEmail !== null &&
        values.promoterEmail !== "" &&
        values.promoterEmail !== undefined
      )
        payload.Email = values.promoterEmail;

      if (values.promoterPhoneNo && values.promoterPhoneNo.length !== 10) {
        toast.error("Invalid Phone Number");
        return;
      }

      if (
        values.promoterPhoneNo !== promoterData?.Phone1 &&
        values.promoterPhoneNo !== null &&
        values.promoterPhoneNo !== "" &&
        values.promoterPhoneNo !== undefined
      )
        payload.Phone1 = values.promoterPhoneNo;

      if (stateName && stateName !== promoterData.State) {
        payload.State = stateName;
      }

      if (stateIsoCode && stateIsoCode !== promoterData.StateIsoCode) {
        payload.StateIsoCode = stateIsoCode;
      }

      if (cityIsoCode && cityIsoCode !== promoterData.CityIsoCode) {
        payload.CityIsoCode = String(cityIsoCode);
      }

      if (cityName && cityName !== promoterData.City) payload.City = cityName;

      console.log("payload", payload);

      try {
        let response = await axios.post(
          `${promoterEndpoint.UPDATE_PROMOTER_DATA_URL}`,
          payload
        );

        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/superAdmin/dashboard/promoter");
          // navigate("/superAdmin/dashboard/promoter");
        }, 2000);

        setIsChecked(0);
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

  console.log(values?.promoterPhoneNo);
  const handlernavigatePromoter = () => {
    navigate("/superAdmin/dashboard/promoter");
  };

  return (
    <div>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Promoter"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => handlernavigatePromoter()}
            className={`w-[15%] py-2 
               "border-2 border-black text-Gray85 "
          flex justify-center items-center text-xl`}
          >
            <span className="mr-2">
              <FaChevronLeft size={23} />
            </span>{" "}
            Back
          </button>
        </div>
        <h1 className="md:text-3xl text-2xl font-semibold -mt-2">
          Edit Promoter
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="ml-[2%]">
          <div className="md:w-[70%] md:mt-[2%] mt-8">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="promoterFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="promoterFullName"
                  name="promoterFullName"
                  value={values.promoterFullName}
                  // value={promoterData.FullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promoter full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {/* {errors.promoterFullName && touched.promoterFullName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterFullName}
                  </p>
                ) : null} */}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="organizerFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  UserName
                </label>
                <input
                  type="text"
                  id="promoterusername"
                  name="promoterusername"
                  disabled
                  value={promoterData.Username}
                  placeholder="Enter promoter full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* <div className="md:col-span-2">
                <label
                  htmlFor="promoterDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="promoterDescription"
                  name="promoterDescription"
                  value={values.promoterDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Enter text here..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.promoterDescription && touched.promoterDescription ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterDescription}
                  </p>
                ) : null}
              </div> */}

              <div className="md:col-span-1">
                <label
                  htmlFor="promoterEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="promoterEmail"
                  name="promoterEmail"
                  value={values.promoterEmail}
                  // value={promoterData.Email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promoter emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {/* {errors.promoterEmail && touched.promoterEmail ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterEmail}
                  </p>
                ) : null} */}
              </div>

              <div className="">
                <label
                  htmlFor="promoterPhoneNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No.
                </label>
                <input
                  type="text"
                  id="promoterPhoneNo"
                  name="promoterPhoneNo"
                  value={values.promoterPhoneNo}
                  // value={promoterData.Phone1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promoter phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {/* {errors.promoterPhoneNo && touched.promoterPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterPhoneNo}
                  </p>
                ) : null} */}
              </div>
              {/* 
              <div className="md:col-span-1">
                <label
                  htmlFor="organizerEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  State
                </label>
                <input
                  value={promoterData.State}
                  placeholder="Enter organizer emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div> */}

              {/* City */}
              {/* 
              <div className="md:col-span-1">
                <label
                  htmlFor="organizerEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  City
                </label>
                <input
                  value={promoterData.City}
                  placeholder="Enter organizer emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div> */}

              {/* EDit State and City APi Field */}

              <div className="w-[100%] md:col-span-2">
                <EditAddress
                  StateIsoCode={promoterData.StateIsoCode}
                  CityIsoCode={promoterData.CityIsoCode}
                  setStateIsoCode={setStateIsoCode}
                  setStateName={setStateName}
                  setCityIsoCode={setCityIsoCode}
                  setCityName={setCityName}
                />
              </div>

              {/* <div className="md:col-span-2 relative">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="bg-gray-50 mt-2  z-0  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  onChange={handleChange}
                  value={values.promoterPassword}
                  onBlur={handleBlur}
                  placeholder="Generate the Password"
                  required
                />
                <div className="absolute w-[98%] z-30 top-9 flex justify-end items-end">
                  <p onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <AiFillEye size={25} />
                    ) : (
                      <AiFillEyeInvisible size={25} />
                    )}
                  </p>
                </div>
                {errors.password && touched.password ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.password}
                  </p>
                ) : null}
              </div> */}
            </div>
          </div>

          <div className="w-[70%] flex justify-end items-end gap-10 mt-3 ">
            <button
              onClick={handleSubmit}
              type="button"
              className="px-5 py-2 text-white bg-Gray40"
            >
              Submit
            </button>
            <button
              className="px-5 py-2 bg-white text-gray-600 border border-gray-300"
              type="button"
              onClick={() => handlernavigatePromoter()}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPromoter;
