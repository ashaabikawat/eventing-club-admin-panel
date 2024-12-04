import axios from "axios";
import React, { useEffect, useState } from "react";
import { dashboard } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import { Gender } from "../../../../../data/UserTypeDropDown";
import AddAddress from "../../../../common/AddAddress";
import { useFormik } from "formik";
import { adminProfileObjectSchema } from "../../../validation/YupValidation";
import { formatDateForInput } from "../../../../common/FormatDate";

const AdminProfile = () => {
  const adminuser = useSelector((store) => store.auth);

  const [adminProfileData, setAdminProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profilImageAdmin, setProfileImageAdmin] = useState(null);
  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();

  useEffect(() => {
    getAdminData();
  }, []);

  const getAdminData = async () => {
    try {
      const payload = {
        user_id: adminuser.adminSignupData.user_id,
      };

      const response = await axios.post(
        `${dashboard.ADMIN_PROFILE_API}`,
        payload
      );

      setAdminProfileData(response.data.data);
      setStateName(response.data.data?.State),
        setStateIsoCode(response.data.data?.StateIsoCode),
        setCityName(response.data.data?.City),
        setCityIsoCode(response.data.data?.CityIsoCode);
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
          console.log(data);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  const initialValues = !loading
    ? {
        firstName: adminProfileData?.FullName,
        lastName: adminProfileData?.FullName,
        phoneNumber1: adminProfileData?.Phone1,
        phoneNumber2: adminProfileData?.Phone2,
        emailId: adminProfileData?.Email,
        birthdate: formatDateForInput(adminProfileData?.BirthDay),
        gender: adminProfileData?.Gender,
        about: adminProfileData?.About,
        address: adminProfileData?.Address,
        Country: adminProfileData?.Country,
        CountryIsoCode: adminProfileData?.CountryIsoCode,
      }
    : {
        firstName: "",
        lastName: "",
        phoneNumber1: "",
        phoneNumber2: "",
        emailId: "",
        birthdate: "",
        gender: "",
        about: "",
        address: "",
        Country: "",
        CountryIsoCode: "",
        State: "",
        StateIsoCode: "",
        City: "",
        CityIsoCode: "",
        // CountryIsoCode: "",
        // State: stateName,
        // StateIsoCode: values.state,
        // City: city,
        // CityIsoCode: values.city,
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
    validationSchema: adminProfileObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values, action) => {
      const formData = new FormData();
      formData.append("user_id", adminuser.adminSignupData.user_id);
      formData.append("FullName", values.firstName);
      formData.append("Phone1", values.phoneNumber1);
      formData.append("Phone2", values.phoneNumber2);
      // formData.append("MetaKeyWord", values.emailId);
      formData.append("BirthDay", values.birthdate);
      formData.append("Gender", values.gender);
      formData.append("About", values.about);
      formData.append("Address", values.address);
      formData.append("Country", values.Country);
      formData.append("CountryIsoCode", values.CountryIsoCode);
      formData.append("State", stateName);
      formData.append("StateIsoCode", stateIsoCode);
      formData.append("City", cityName);
      formData.append("CityIsoCode", cityIsoCode);

      if (Image !== null && profilImageAdmin) {
        formData.append("ProfileImage", values.profilImageAdmin);
      }

      try {
        let response = await axios.post(
          `${dashboard.ADMIN_PROFILE_UPDATE_API}`,
          formData
        );

        //   console.log(response)

        if (response.status === 200) {
          toast.success(response.data.message);
        }
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
      handleResetClick();
    },
  });

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];

    setFieldValue(field, file); // Set the file in the form state

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "bannerImageMobile") {
          setImagePreviewMobile(reader.result);
        }
        {
          setProfileImageAdmin(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (field === "bannerImageMobile") {
        setImagePreviewMobile(null);
      } else {
        setProfileImageAdmin(null);
      }
    }
  };

  // Convert and display the formatted date

  return (
    <div className="w-full h-auto">
      <Toaster />
      <div className="w-[96%] mx-auto">
        <h1>Personal data</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className=" w-[70%]">
            <label
              htmlFor="fileInput2"
              className="block text-sm font-medium text-gray-600"
            >
              Profile Image
            </label>

            <div className="">
              {profilImageAdmin ? (
                <img
                  src={profilImageAdmin}
                  alt="profile Image"
                  className=" w-[300px] h-[280px] object-contain"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/${
                    adminProfileData?.profile_img
                  }`}
                  alt="profile Image"
                  className=" w-[300px] h-[280px] object-cover"
                />
              )}
            </div>
            {/* <button 
            onChange={(e) => handleFileChange(e, "seriesImage")}
            type="button"
            className="w-[40%] py-4 bg-Gray85 flex justify-center items-center text-xl"
            >
              <span className="mr-2">
              <IoMdAdd size={23} />
            </span>{" "}
            Update Image
            </button> */}
            <input
              type="file"
              id="profilImageAdmin"
              onChange={(e) => handleFileChange(e, "profilImageAdmin")}
              className="mt-1 p-2 w-[40%] border rounded-md"
            />
          </div>

          <div className="w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.firstName && touched.firstName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.firstName}
                  </p>
                ) : null}
              </div>

              {/* Phone No. 1 Input Field  */}
              <div className="">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No. 1
                </label>
                <input
                  type="text"
                  id="phoneNumber1"
                  name="phoneNumber1"
                  value={values.phoneNumber1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.phoneNumber1 && touched.phoneNumber1 ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.phoneNumber1}
                  </p>
                ) : null}
              </div>
              {/* Phone No. 2 Input Field  */}
              <div className="">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No. 2
                </label>
                <input
                  type="text"
                  id="phoneNumber2"
                  name="phoneNumber2"
                  value={values.phoneNumber2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.phoneNumber2 && touched.phoneNumber2 ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.phoneNumber2}
                  </p>
                ) : null}
              </div>
              {/* Email ID Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={values.emailId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.emailId && touched.emailId ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.emailId}
                  </p>
                ) : null}
              </div>
              {/* Date Picker */}
              <div className="">
                <label
                  htmlFor="birthdate"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Birth Date
                </label>
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={values.birthdate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="YYYY-MM-DD"
                    title="Enter a date in the format YYYY-MM-DD"
                  />
                </div>
              </div>

              {/* Gender Selection  */}
              <div className="">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  key={values.gender}
                  onChange={handleChange}
                  value={values.gender}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" disabled selected>
                    Select gender
                  </option>
                  {Gender.map((item) => (
                    <option key={item.id} value={item.gender}>
                      {item.gender}
                    </option>
                  ))}
                </select>
              </div>
              {/* About */}
              <div className="md:col-span-2 mb-4">
                <label
                  htmlFor="about"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={values.about}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.about && touched.about ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.about}
                  </p>
                ) : null}
              </div>
              {/* Address Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.address && touched.address ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.address}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {!loading && (
            <AddAddress
              stateIsoCode={stateIsoCode}
              setStateIsoCode={setStateIsoCode}
              stateName={stateName}
              setStateName={setStateName}
              cityIsoCode={cityIsoCode}
              setCityIsoCode={setCityIsoCode}
              cityName={cityName}
              setCityName={setCityName}
            />
          )}

          <div className="flex justify-end w-[70%] mt-[2%]">
            <button type="button" className="py-2 px-5 border-[1px] mr-4 ">
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 border-[1px] bg-Gray40 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
