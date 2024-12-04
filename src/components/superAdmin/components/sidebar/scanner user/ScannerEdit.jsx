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
import Breadcrumb from "../../common/Breadcrumb";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ScannerEdit = () => {
  const [organizer, setOrganizer] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEventNames, setSelectedEventNames] = useState(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const [specificEvents, setSpecificEvents] = useState([]);
  const [specificOrganizer, setSpecificOrganizer] = useState([]);

  const [userDetails, setUserDetails] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };
  const adminuser = useSelector((store) => store.auth);

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
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const payload = {
      scanneruser_id: id,
    };
    try {
      let response = await axios.post(`${scanUser.GET_BY_ID}`, payload);
      // console.log(response.data.data);
      setUserDetails(response.data.data);
      setSpecificEvents(response.data.data.Events);
      setSpecificOrganizer(response.data.data.Organizers);
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
        }
      }
    }
  };

  const initialValues = loading
    ? {
        userName: "",
        UserType: "",
        selectedEvents: [],
        selectedOrganizer: [],
      }
    : {
        userName: userDetails.Username,
        UserType: userDetails.UserType,
        selectedEvents: userDetails?.Events,
        selectedOrganizer: userDetails?.Organizers,
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
    //  validationSchema: promoterObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        scanneruser_id: id,
        UserType: values.UserType,
      };

      if (Number(values.UserType) === 1) {
        if (!values.selectedEvents || values.selectedEvents.length === 0) {
          toast.error("Please select a specific event");
          return;
        }

        payload.Events = [
          {
            event_id: values?.selectedEvents[0]?.event_id,
          },
        ];
      }

      if (Number(values.UserType) === 2) {
        if (
          !values.selectedOrganizer ||
          values.selectedOrganizer.length === 0
        ) {
          toast.error("Please select a specific organizer");
          return;
        }
        payload.Organizers = [
          {
            organizer_id: values?.selectedOrganizer[0]?.organizer_id,
          },
        ];
      }

      console.log("payload", payload);
      try {
        let response = await axios.post(`${scanUser.UPDATE_USER}`, payload);
        console.log(response.data);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/superAdmin/dashboard/scannerUser");
        }, 1000);
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

  //   console.log("eve", values?.selectedEvents[0]?.event_id);
  //   console.log(specificEvents);
  //   console.log(
  //     specificEvents[0]?.event_id === values?.selectedEvents[0]?.event_id
  //   );

  return (
    <div className="ml-[2%]">
      <Toaster />

      <div className="mt-[3%] ">
        <Breadcrumb path={"Scanner user"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/scannerUser")}
            className={`w-[15%] py-2 
               "border-2 border-black text-Gray85 "
          flex justify-center items-center text-xl`}
          >
            <span className="md:mr-2">
              <FaChevronLeft size={23} />
            </span>{" "}
            Back
          </button>
        </div>
        <h1 className="md:text-3xl text-2xl font-semibold -mt-2">Edit User</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div>
          <div className="md:w-[70%] mt-8 md:mt-[4%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* code Name Input Field  */}
              <div className="md:col-span-2">
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
                  value={userDetails?.Username}
                  disabled
                  placeholder="Enter username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {/* {errors.codeName && touched.codeName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.codeName}
                  </p>
                ) : null} */}
              </div>

              {/* <div className="md:col-span-1">
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
                  // value={values.password}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Enter password"
                  disabled
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              
              </div> */}

              {/* user type  */}
              <div className="md:col-span-1">
                <label
                  htmlFor="user"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  User type*
                </label>
                <select
                  id="UserType"
                  name="UserType"
                  value={values?.UserType}
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
              {Number(values?.UserType) === 1 && (
                <div className="flex w-full mt-2 gap-x-5 justify-between">
                  <div className="w-[100%]">
                    <label htmlFor="">Event Name</label>
                    <Select
                      styles={dropdownStyles}
                      name="selectedEvents"
                      options={eventNames?.map((event) => ({
                        label: event.EventName,
                        value: event._id,
                      }))}
                      // value={
                      //   eventNames.find(
                      //     (event) => event._id === specificEvents[0]?.event_id
                      //   )
                      //     ? {
                      //         label: eventNames?.find(
                      //           (event) =>
                      //             event._id ===
                      //             values.selectedEvents[0]?.event_id
                      //         ).EventName,
                      //         value: values.selectedEvents[0]?.event_id,
                      //       }
                      //     : null
                      // }

                      value={
                        values.selectedEvents?.length > 0
                          ? eventNames.find(
                              (event) =>
                                event._id === values.selectedEvents[0]?.event_id
                            )
                            ? {
                                label: eventNames.find(
                                  (event) =>
                                    event._id ===
                                    values.selectedEvents[0]?.event_id
                                )?.EventName,
                                value: values.selectedEvents[0]?.event_id,
                              }
                            : null
                          : null
                      }
                      onChange={(selectedOption) => {
                        const selectedEvent = selectedOption
                          ? [{ event_id: selectedOption.value }]
                          : [];
                        setFieldValue("selectedEvents", selectedEvent); // Update Formik's value
                      }}
                      placeholder="Select Events"
                      isClearable
                    />
                  </div>
                </div>
              )}

              {Number(values?.UserType) === 2 && (
                <div className="w-[100%]">
                  <label htmlFor="">Organizers</label>
                  <Select
                    styles={dropdownStyles}
                    options={organizer?.map((organizer) => ({
                      value: organizer._id,
                      label: organizer.Username,
                    }))}
                    // value={
                    //   organizer.find(
                    //     (org) => org._id === specificOrganizer[0]?.organizer_id
                    //   )
                    //     ? {
                    //         label: organizer.find(
                    //           (org) =>
                    //             org._id ===
                    //             values.selectedOrganizer[0]?.organizer_id
                    //         )?.Username,
                    //         value: values.selectedOrganizer[0]?.organizer_id,
                    //       }
                    //     : null
                    // }

                    value={
                      values.selectedOrganizer?.length > 0
                        ? organizer.find(
                            (org) =>
                              org._id ===
                              values.selectedOrganizer[0]?.organizer_id
                          )
                          ? {
                              label: organizer.find(
                                (org) =>
                                  org._id ===
                                  values.selectedOrganizer[0]?.organizer_id
                              )?.Username,
                              value: values.selectedOrganizer[0]?.organizer_id,
                            }
                          : null
                        : null
                    }
                    onChange={(selectedOption) => {
                      const selectedOrg = selectedOption
                        ? [{ organizer_id: selectedOption.value }]
                        : [];
                      setFieldValue("selectedOrganizer", selectedOrg); // Update Formik's value
                    }}
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
            onClick={() => navigate("/superAdmin/dashboard/scannerUser")}
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

export default ScannerEdit;
