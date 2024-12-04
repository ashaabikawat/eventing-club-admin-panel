import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { userType } from "../../../../common/helper/Enum";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  eventEndPoint,
  organizerEndpoint,
  scanUser,
} from "../../../../../services/apis";
import axios from "axios";

const CreateScannerUser = ({ setUserCreation }) => {
  const [organizer, setOrganizer] = useState([]);
  const [eventNames, setEventNames] = useState([]);

  const [selectedEventNames, setSelectedEventNames] = useState(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const adminuser = useSelector((store) => store.auth);
  const initialValues = {
    userName: "",
    password: "",
    user: 1,
  };

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  useEffect(() => {
    getAllPublishedEventNames();
    getAllOrganizerData();
  }, []);

  const getAllPublishedEventNames = async () => {
    const payload = {
      AdminRole: adminuser.adminSignupData.AdminRole,
      user_id: adminuser.adminSignupData.user_id,
    };
    // console.log(payload);
    try {
      const FetchEventData = await axios.post(
        `${eventEndPoint.GET_ALL_PUBLISHED_EVENTS_DATA}`,
        payload
      );
      // console.log(FetchEventData.data.data);
      setEventNames(FetchEventData.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllOrganizerData = async () => {
    try {
      const FetchOrganizerData = await axios.get(
        `${organizerEndpoint.GET_ALL_ORGANIZERS_DATA_URL}`
      );
      setOrganizer(FetchOrganizerData.data.data);
    } catch (error) {
      handleError(error);
    }
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
    //  validationSchema: promocodeObjectSchema,
    onSubmit: async (values) => {
      // code name Validation
      if (
        values.userName === undefined ||
        values.userName === "" ||
        values.userName === null
      ) {
        return toast.error("Please Enter User Name");
      }

      if (
        values.password === undefined ||
        values.password === "" ||
        values.password === null
      ) {
        return toast.error("Please Enter Password");
      }

      const payload = {
        Username: values.userName,
        Password: values.password,
        UserType: values.user,
        CreatedBy: adminuser.adminSignupData.AdminRole,
        createduser_id: adminuser.adminSignupData.user_id,
      };

      if (Number(values.user) === 1) {
        if (!selectedEventNames?.value) {
          toast.error("Please select specific event");
          return;
        }

        payload.Events = [
          {
            event_id: selectedEventNames?.value,
          },
        ];
      }

      if (Number(values.user) === 2) {
        if (!selectedOrganizer?.value) {
          toast.error("Please select specific organizer");
          return;
        }
        payload.Organizers = [
          {
            organizer_id: selectedOrganizer?.value,
          },
        ];
      }

      console.log("payload", payload);
      try {
        let response = await axios.post(`${scanUser.REGISTER}`, payload);
        console.log(response.data);
        toast.success(response.data.message);
        setTimeout(() => {
          setUserCreation(false);
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

  console.log(selectedEventNames?.value);
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
          <div className="md:w-[70%] mt-8 md:mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* code Name Input Field  */}
              <div className="md:col-span-2 ">
                <label
                  htmlFor="userName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {/* {errors.codeName && touched.codeName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.codeName}
                  </p>
                ) : null} */}
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="password"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {/* {errors.codeName && touched.codeName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.codeName}
                  </p>
                ) : null} */}
              </div>

              {/* user type  */}
              <div className="md:col-span-1">
                <label
                  htmlFor="user"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  User type*
                </label>
                <select
                  id="user"
                  name="user"
                  value={values.user}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {Object.keys(userType).map((key) => (
                    <option key={key} value={userType[key]}>
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

              {/* event or organizer */}
              {Number(values.user) === 1 && (
                <div className="flex w-full mt-2 gap-x-5 justify-between">
                  <div className="w-[100%]">
                    <label htmlFor="">Event Name</label>
                    <Select
                      styles={dropdownStyles}
                      options={eventNames.map((name) => ({
                        value: name._id,
                        label: name.EventName,
                      }))}
                      value={selectedEventNames}
                      onChange={setSelectedEventNames}
                      placeholder="Select Event names"
                      isClearable
                    />
                  </div>
                </div>
              )}

              {Number(values.user) === 2 && (
                <div className="w-[100%]">
                  <label htmlFor="">Organizers</label>
                  <Select
                    styles={dropdownStyles}
                    options={organizer.map((organizer) => ({
                      value: organizer._id,
                      label: organizer.Username,
                    }))}
                    value={selectedOrganizer}
                    onChange={setSelectedOrganizer}
                    placeholder="Select Organizer"
                    isClearable
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-6">
          <button
            className="px-5 border border-gray-400 py-2 text-black bg-white"
            type="button"
            onClick={() => setUserCreation(false)}
          >
            cancel
          </button>
          <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateScannerUser;
