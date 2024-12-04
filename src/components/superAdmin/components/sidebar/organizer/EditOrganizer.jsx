import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { organizerEndpoint } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { organizerObjectSchema } from "../../../validation/YupValidation";
import EditAddress from "../../../../common/EditAddress";
import { TbChevronsDownLeft } from "react-icons/tb";

const EditOrganizer = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [organizerData, setOrganizerData] = useState({});
  const [loading, setLoading] = useState(true);

  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();

  useEffect(() => {
    getOrganizerDataById();
  }, []);

  //   Fetch Organizer Data by Id
  const getOrganizerDataById = async () => {
    try {
      const payload = {
        user_id: _id,
      };

      let response = await axios.post(
        `${organizerEndpoint.GET_ORGANIZER_DATA_BY_ID_URL}`,
        payload
      );

      console.log(response.data.data);
      setOrganizerData(response.data.data);
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

  const handlernavigateOrganizer = () => {
    navigate("/superAdmin/dashboard/organizer");
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      organizername: organizerData?.FullName || "",
      email: organizerData?.Email || "",
      organizerPhoneNo: organizerData?.Phone1 || "",
      state: organizerData?.State || "",
      city: organizerData.City || "",
    },
    // validationSchema: organizerProfileUpdateValidations,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        user_id: _id,
        // FullName: values.organizername,
      };

      if (
        values.organizername !== organizerData?.FullName &&
        values.organizername !== null &&
        values.organizername !== "" &&
        values.organizername !== undefined
      )
        payload.FullName = values.organizername;

      if (
        values.email !== organizerData?.Email &&
        values.email !== null &&
        values.email !== "" &&
        values.email !== undefined
      )
        payload.Email = values.email;

      if (values.organizerPhoneNo && values.organizerPhoneNo?.length !== 10) {
        toast.error("Invalid Phone Number");
        return;
      }

      if (
        values.organizerPhoneNo !== organizerData?.Phone1 &&
        values.organizerPhoneNo !== null &&
        values.organizerPhoneNo !== "" &&
        values.organizerPhoneNo !== undefined
      )
        payload.Phone1 = values.organizerPhoneNo;

      // if (values.state !== organizerData.State) payload.State = stateName;
      if (stateName && stateName !== organizerData.State) {
        payload.State = stateName;
      }

      if (stateIsoCode && stateIsoCode !== organizerData.StateIsoCode) {
        payload.StateIsoCode = stateIsoCode;
      }

      if (cityIsoCode && cityIsoCode !== organizerData.CityIsoCode) {
        payload.CityIsoCode = String(cityIsoCode);
      }

      if (cityName && cityName !== organizerData.City) payload.City = cityName;

      // console.log(payload);
      try {
        const response = await axios.post(
          `${organizerEndpoint.UPDATE_ORGANIZER_PROFILE}`,
          payload
        );
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/superAdmin/dashboard/organizer");
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
            setLoading(false);
          }
        }
      }
    },
  });
  console.log(values.organizerPhoneNo);

  return (
    <div>
      <Toaster />

      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Organizer"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => handlernavigateOrganizer()}
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
          Edit Organizer
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="ml-[2%]">
          <div className="md:w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              <div className="flex items-center mt-4">
                <input
                  type="radio"
                  id="ownClub"
                  name="organizerType"
                  value="ownClub"
                  disabled
                  // checked={selectedOption === "ownClub"}
                  checked={organizerData?.OwnerType === "1"}
                  // onChange={handleOptionChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="ownClub"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Own club
                </label>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="radio"
                  id="eventCompany"
                  name="organizerType"
                  value="eventCompany"
                  disabled
                  // checked={selectedOption === "eventCompany"}
                  checked={organizerData?.OwnerType === "2"}
                  // onChange={handleOptionChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="eventCompany"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Event company name
                </label>
              </div>

              {organizerData?.OwnerType === "1" && (
                <div className="mt-2 md:col-span-2">
                  <label
                    htmlFor="clubName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Own Club Name
                  </label>
                  <input
                    type="text"
                    id="clubName"
                    name="clubName"
                    disabled
                    value={organizerData?.CompanyName}
                    // onChange={(e) => setClubName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your club name"
                  />
                </div>
              )}

              {organizerData?.OwnerType === "2" && (
                <div className="mt-2 md:col-span-2">
                  <label
                    htmlFor="companyName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Event Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    disabled
                    value={organizerData?.CompanyName}
                    // onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter event company name"
                  />
                </div>
              )}
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="organizername"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="organizername"
                  value={values?.organizername}
                  onChange={handleChange}
                  placeholder="Enter organizer full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* <div className="md:col-span-2">
                <label
                  htmlFor="organizerDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  value={organizerData?.Description}
                  rows={4}
                  placeholder="Enter text here..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div> */}

              <div className="md:col-span-2">
                <label
                  htmlFor="organizerFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  UserName
                </label>
                <input
                  type="text"
                  disabled
                  id="organizerusername"
                  name="organizerusername"
                  value={organizerData.Username}
                  placeholder="Enter organizer full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="organizerEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  name="email"
                  value={values?.email}
                  onChange={handleChange}
                  placeholder="Enter organizer emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div className="">
                <label
                  htmlFor="organizerPhoneNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No.
                </label>
                <input
                  type="text"
                  name="organizerPhoneNo"
                  onChange={handleChange}
                  value={values.organizerPhoneNo}
                  placeholder="Enter organizer phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              {/* 
              <div className="md:col-span-1">
                <label
                  htmlFor="state"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  State
                </label>
                <input
                  name="state"
                  value={organizerData.State}
                  onChange={handleChange}
                  placeholder="Enter organizer emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div> */}

              {/* City */}

              {/* <div className="md:col-span-1">
                <label
                  htmlFor="city"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  City
                </label>
                <input
                  value={organizerData.City}
                  name="city"
                  onChange={handleChange}
                  placeholder="Enter organizer emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div> */}
              <div className="w-[100%] md:col-span-2">
                <EditAddress
                  StateIsoCode={organizerData.StateIsoCode}
                  CityIsoCode={organizerData.CityIsoCode}
                  setStateIsoCode={setStateIsoCode}
                  setStateName={setStateName}
                  setCityIsoCode={setCityIsoCode}
                  setCityName={setCityName}
                />
              </div>
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
              onClick={() => handlernavigateOrganizer()}
              type="button"
              className="px-5 py-2 bg-white text-gray-600 border border-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrganizer;
