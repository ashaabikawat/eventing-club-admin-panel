import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboard } from "../../../../../services/apis";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import EditAddress from "../../../../common/EditAddress";
import { organizerProfileUpdateValidations } from "../../../../organizer/validation/YupValidation";
import toast, { Toaster } from "react-hot-toast";

const PersonalDataAdmin = () => {
  const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;

  const adminUser = useSelector((store) => store.auth);
  const navigate = useNavigate;

  const [adminData, setAdminData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilImageAdmin, setProfileImageAdmin] = useState(null);

  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();
  // console.log(adminUser.adminSignupData.user_id);
  useEffect(() => {
    getAllAdminProfileData();
  }, []);
  // console.log("image", profileImage);

  // console.log(adminData);
  console.log(profileImage);

  // const getAllAdminProfileData = async () => {
  //   try {
  //     const payload = {
  //       user_id: adminUser.adminSignupData.user_id,
  //     };
  //     const response = await axios.post(
  //       `${dashboard.ADMIN_PROFILE_API}`,
  //       payload
  //     );
  //     // console.log("admin data", response.data.data);
  //     setAdminData(response.data.data);

  //     const image = response?.data?.data?.profile_img;
  //     // console.log("profile image", image);

  //     if (image !== undefined || image !== null) {
  //       setProfileImage(`${BASE_URl}/${image}`);
  //     }

  //     setStateIsoCode(response?.data?.data?.StateIsoCode);
  //     setStateName(response?.data?.data?.State);
  //     setCityIsoCode(response?.data?.data?.CityIsoCode);
  //     setCityName(response?.data?.data?.City);

  //     setLoading(false);
  //   } catch (error) {
  //     if (error.response) {
  //       const { status, data } = error.response;

  //       if (
  //         status === 404 ||
  //         status === 403 ||
  //         status === 500 ||
  //         status === 302 ||
  //         status === 409 ||
  //         status === 401 ||
  //         status === 400
  //       ) {
  //         // console.log(error.response);
  //         toast.error(data.message);
  //         setLoading(false);
  //       }
  //     }
  //   }
  // };

  const getAllAdminProfileData = async () => {
    try {
      const payload = {
        user_id: adminUser.adminSignupData.user_id,
      };
      const response = await axios.post(
        `${dashboard.ADMIN_PROFILE_API}`,
        payload
      );

      const adminData = response.data.data;
      setAdminData(adminData);

      const image = adminData?.profile_img;
      if (image) {
        // If the image exists, set the profile image
        setProfileImage(`${BASE_URl}/${image}`);
      } else {
        // If the image is undefined or null, set profile image to null
        setProfileImage(null);
      }

      // Set state and city codes/names
      setStateIsoCode(adminData?.StateIsoCode);
      setStateName(adminData?.State);
      setCityIsoCode(adminData?.CityIsoCode);
      setCityName(adminData?.City);

      setLoading(false);
    } catch (error) {
      // Handle errors here
      if (error.response) {
        const { status, data } = error.response;
        if ([404, 403, 500, 302, 409, 401, 400].includes(status)) {
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

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
          setProfileImage(reader.result);
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
  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const initialValues = loading
    ? {
        adminFullName: "",
        adminDescription: "",
        adminEmail: "",
        adminPhoneNo: "",
        adminAddress: "",
        adminWhatsappNo: "",
      }
    : {
        adminFullName: adminData.FullName,
        adminDescription: adminData.About,
        adminEmail: adminData.Email,
        adminPhoneNo: adminData.Phone1,
        adminAddress: adminData?.Address ? adminData?.Address : "",
        adminWhatsappNo: adminData?.Phone2,
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
    initialValues,
    validationSchema: organizerProfileUpdateValidations,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      values.adminFullName && formData.append("FullName", values.adminFullName);
      formData.append("user_id", adminUser.adminSignupData.user_id);
      values.adminPhoneNo && formData.append("Phone1", values.adminPhoneNo);
      // formData.append("Phone2", values.adminWhatsappNo);
      values.adminEmail && formData.append("Email", values.adminEmail);
      formData.append("Country", "India");
      formData.append("CountryIsoCode", "IN");
      // formData.append("State", stateName);
      // formData.append("StateIsoCode", stateIsoCode);
      // formData.append("City", cityName);
      // formData.append("CityIsoCode", cityIsoCode);
      if (stateName && stateName !== adminData.State) {
        formData.append("State", stateName);
      }

      if (stateIsoCode && stateIsoCode !== adminData.StateIsoCode) {
        formData.append("StateIsoCode", stateIsoCode);
      }
      if (cityIsoCode && cityIsoCode !== adminData.CityIsoCode) {
        formData.append("CityIsoCode", cityIsoCode);
      }

      if (cityName && cityName !== adminData.City)
        formData.append("City", cityName);

      if (values.adminWhatsappNo) {
        formData.append("Phone2", values.adminWhatsappNo);
      }

      // Append Address only if it's not empty
      if (values.adminAddress) {
        formData.append("Address", values.adminAddress);
      }

      if (Image !== null && profilImageAdmin) {
        formData.append("ProfileImage", values.profilImageAdmin);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      try {
        let response = await axios.post(
          `${dashboard.ADMIN_PROFILE_UPDATE_API}`,
          formData
        );

        toast.success(response.data.message);
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
    },
  });

  return (
    <div>
      <Toaster />
      <h1 className="text-black text-2xl font-semibold">Personal data</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className=""
      >
        {/* <div className="mt-5">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-[300px] h-[300px] object-cover"
            />
          ) : (
            <div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center cursor-pointer">
              <input
                type="file"
                id="profilImageAdmin"
                accept="image/*"
                className="absolute opacity-0 w-[300px] h-[300px] cursor-pointer"
                onChange={(e) => handleFileChange(e, "profilImageAdmin")}
              />
              <span>Select an image</span>
            </div>
          )}

          <p className="mt-3 text-gray-600">
            Only PNG or JPG Files. 500 kb max size
          </p>

          <div className="mt-3 flex w-[300px]">
            <button
              onClick={handleRemoveImage}
              type="button"
              className="mr-2 px-4 py-2 w-[50%] bg-red-500 text-white rounded"
            >
              Remove
            </button>
            <button
              className="px-4 py-2 w-[50%] bg-blue-500 text-white rounded"
              type="button"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              Upload Image
            </button>
          </div>
        </div> */}
        <div className="mt-5">
          <div className="md:w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="adminFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="adminFullName"
                  name="adminFullName"
                  value={values.adminFullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Admin full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.adminFullName && touched.adminFullName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.adminFullName}
                  </p>
                ) : null}
              </div>

              <div className="">
                <label
                  htmlFor="adminPhoneNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No.
                </label>
                <input
                  type="text"
                  id="adminPhoneNo"
                  name="adminPhoneNo"
                  value={values.adminPhoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Admin phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.adminPhoneNo && touched.adminPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.adminPhoneNo}
                  </p>
                ) : null}
              </div>

              <div className="">
                <label
                  htmlFor="adminWhatsappNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Whatsapp No.
                </label>
                <input
                  type="text"
                  id="adminWhatsappNo"
                  name="adminWhatsappNo"
                  value={values.adminWhatsappNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Admin phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.adminWhatsappNo && touched.adminWhatsappNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.adminWhatsappNo}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="adminEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={values.adminEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Admin emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="adminAddress"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <textarea
                  id="adminAddress"
                  name="adminAddress"
                  value={values.adminAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Enter text here..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.adminAddress && touched.adminAddress ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.adminAddress}
                  </p>
                ) : null}
              </div>

              {/* EDit State and City APi Field */}

              <div className="w-[100%] md:col-span-2">
                <EditAddress
                  StateIsoCode={adminData.StateIsoCode}
                  CityIsoCode={adminData.CityIsoCode}
                  setStateIsoCode={setStateIsoCode}
                  setStateName={setStateName}
                  setCityIsoCode={setCityIsoCode}
                  setCityName={setCityName}
                />
              </div>
            </div>
          </div>

          <div className="md:w-[70%] flex md:justify-end items-end mt-3  gap-x-4">
            <button
              className="px-5 py-2 border"
              type="button"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </button>
            <button
              className="md:px-5 px-2 py-2  text-white bg-Gray40"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalDataAdmin;
