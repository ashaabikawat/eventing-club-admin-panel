import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  organizerEndpoint,
  promoterEndPointPannel,
} from "../../../../../services/apis";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { promoterObjectSchema } from "../../../../superAdmin/validation/YupValidation";
import { useFormik } from "formik";
import EditAddress from "../../../../common/EditAddress";
import { useNavigate } from "react-router-dom";
import { organizerProfileUpdateValidations } from "../../../validation/YupValidation";

const OrganizerPersonalData = () => {
  const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;

  const organizerUser = useSelector((store) => store.organizerauth);

  const navigate = useNavigate();

  const [organizerData, setOrganizerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [profilImageAdmin, setProfileImageAdmin] = useState(null);

  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();

  useEffect(() => {
    getAllOrganizerProfileData();
  }, []);

  const getAllOrganizerProfileData = async () => {
    try {
      const payload = {
        user_id: organizerUser.organizerSignupData.user_id,
      };

      const FetchOrganizerData = await axios.post(
        `${organizerEndpoint.GET_ORGANIZER_DATA_BY_ID_URL}`,
        payload
      );

      console.log(" data ", FetchOrganizerData.data.data);

      setOrganizerData(FetchOrganizerData.data.data);

      const image = FetchOrganizerData?.data?.data?.profile_img;

      if (image != undefined || image != null) {
        setProfileImage(`${BASE_URl}/${image}`);
      }

      setStateIsoCode(FetchOrganizerData?.data?.data?.StateIsoCode);
      setStateName(FetchOrganizerData?.data?.data?.State);
      setCityIsoCode(FetchOrganizerData?.data?.data?.CityIsoCode);
      setCityName(FetchOrganizerData?.data?.data?.City);

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
        organizerFullName: "",
        organizerDescription: "",
        organizerEmail: "",
        organizerPhoneNo: "",
        organizerAddress: "",
        organizerWhatsappNo: "",
      }
    : {
        organizerFullName: organizerData.FullName,
        organizerDescription: organizerData.About,
        organizerEmail: organizerData.Email,
        organizerPhoneNo: organizerData.Phone1,
        organizerAddress: organizerData?.Address ? organizerData?.Address : "",
        organizerWhatsappNo: organizerData?.Phone2 ? organizerData?.Phone2 : "",
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
      formData.append("FullName", values.organizerFullName);
      formData.append("user_id", organizerUser.organizerSignupData.user_id);
      formData.append("Phone1", values.organizerPhoneNo);
      formData.append("Country", "India");
      formData.append("CountryIsoCode", "IN");
      formData.append("State", stateName);
      formData.append("StateIsoCode", stateIsoCode);
      formData.append("City", cityName);
      formData.append("CityIsoCode", cityIsoCode);

      if (values.organizerWhatsappNo) {
        formData.append("Phone2", values.organizerWhatsappNo);
      }

      // Append Address only if it's not empty
      if (values.organizerAddress) {
        formData.append("Address", values.organizerAddress);
      }

      if (Image !== null && profilImageAdmin) {
        formData.append("ProfileImage", values.profilImageAdmin);
      }

      try {
        let response = await axios.post(
          `${organizerEndpoint.UPDATE_ORGANIZER_PROFILE}`,
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
      <h1 className="text-black text-2xl font-semibold">Personal data</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className=""
      >
        <div className="mt-5">
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
        </div>
        <div className="">
          <div className="w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="organizerFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="organizerFullName"
                  name="organizerFullName"
                  value={values.organizerFullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerFullName && touched.organizerFullName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerFullName}
                  </p>
                ) : null}
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
                  id="organizerPhoneNo"
                  name="organizerPhoneNo"
                  value={values.organizerPhoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerPhoneNo && touched.organizerPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerPhoneNo}
                  </p>
                ) : null}
              </div>

              <div className="">
                <label
                  htmlFor="organizerWhatsappNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Whatsapp No.
                </label>
                <input
                  type="text"
                  id="organizerWhatsappNo"
                  name="organizerWhatsappNo"
                  value={values.organizerWhatsappNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerWhatsappNo && touched.organizerWhatsappNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerWhatsappNo}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="organizerEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="organizerEmail"
                  name="organizerEmail"
                  value={organizerData.Email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                  placeholder="Enter Promoter emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="organizerAddress"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <textarea
                  id="organizerAddress"
                  name="organizerAddress"
                  value={values.organizerAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Enter text here..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerAddress && touched.organizerAddress ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerAddress}
                  </p>
                ) : null}
              </div>

              {/* EDit State and City APi Field */}

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

          <div className="w-[70%] flex justify-end items-end mt-3  gap-x-4">
            <button
              className="px-5 py-2 border"
              type="button"
              onClick={() => navigate("/promoter/dashboard")}
            >
              Cancel
            </button>
            <button className="px-5 py-2 text-white bg-Gray40" type="submit">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganizerPersonalData;
