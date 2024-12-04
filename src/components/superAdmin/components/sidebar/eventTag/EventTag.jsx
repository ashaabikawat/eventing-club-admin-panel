import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import { FaWindowClose } from "react-icons/fa";
import { useFormik } from "formik";
import { eventTagObjectSchema } from "../../../validation/YupValidation";
import { eventTagEndPoint } from "../../../../../services/apis";

import axios from "axios";
import { formatDate2 } from "../../../../common/formatDate2";
import EditEventTag from "./EditEventTag";

const EventTag = () => {
  const [eventTagCreationModal, setEventTagCreationModal] = useState(false);
  const [allEventTags, setAllEventTags] = useState([]);
  const [editEventTagModal, setEditEventTagModal] = useState(false);
  const [editEventTagData, setEditEventTagData] = useState({});
  const [toucheds, setTouched] = useState({});

  useEffect(() => {
    getAllEventTags();
  }, []);

  const getAllEventTags = async () => {
    try {
      const response = await axios.get(
        `${eventTagEndPoint.ALL_EVENT_TAG_DATA}`
      );

      console.log("response", response.data.data);
      setAllEventTags(response.data.data);
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
    eventtag: "",
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
    validationSchema: eventTagObjectSchema,
    onSubmit: async (values) => {
      const payload = {
        EventTagName: values.eventtag,
      };

      console.log("payload", payload);

      try {
        let response = await axios.post(
          `${eventTagEndPoint.EVENT_TAG_CREATION_URL}`,
          payload
        );

        toast.success(response.data.message);
        resetForm();
        setEventTagCreationModal(false);
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

  const handlerEditEventTag = (eventTag) => {
    setEditEventTagModal(true);
    setEditEventTagData(eventTag);
  };

  console.log({ editEventTagData });

  const updateEventTagInList = (updatedEventTag) => {
    setAllEventTags((prevTags) =>
      prevTags.map((tag) =>
        tag._id === updatedEventTag._id ? updatedEventTag : tag
      )
    );
  };

  return (
    <div className="mt-[3%] ml-[2%]">
      <Toaster />
      <Breadcrumb path={"Event Tag"} />
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setEventTagCreationModal(!eventTagCreationModal)}
          className={`w-[25%] py-2 ${
            eventTagCreationModal
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center text-xl`}
        >
          <span className="mr-2">
            {eventTagCreationModal ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span>{" "}
          {eventTagCreationModal ? "Back " : "Create EventTag"}
        </button>
      </div>
      <h1 className="text-3xl font-semibold -mt-6">Event Tag</h1>

      <div className="max-w-md mt-[2%]">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            //    value={searchTerm}
            //   onChange={handleChange}
            placeholder="Search By Event Tag"
          />
        </div>
      </div>

      {/* Tag Cration Modal  */}
      {eventTagCreationModal && (
        <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-4  rounded-md  md:w-[40%]">
            <div className="w-[96%] flex justify-between">
              <p className="text-xl pl-2 text-black font-bold ">
                Create Event Tag
              </p>
              <p
                onClick={() => setEventTagCreationModal(!eventTagCreationModal)}
                className="flex justify-center cursor-pointer items-center"
              >
                <FaWindowClose size={25} />
              </p>
            </div>

            {/* Form Creation */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="mt-4 w-[96%] mx-auto"
            >
              <div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="organizerFullName"
                    className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Event Tag
                  </label>
                  <input
                    type="text"
                    id="eventtag"
                    name="eventtag"
                    value={values.eventtag}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter event tag name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.eventtag && touched.eventtag ? (
                    <p className="font-Marcellus text-start text-red-900">
                      {errors.eventtag}
                    </p>
                  ) : null}
                </div>

                <div className="w-[98%] flex justify-end items-end mt-5 ">
                  <button
                    className="px-5 py-2 text-white bg-Gray40"
                    type="submit "
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tag Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tag Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allEventTags.map((eventTag) => (
              <tr
                key={eventTag._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {eventTag.EventTagName}
                    </div>
                  </div>
                </th>
                <td className="pl-7">{formatDate2(eventTag.createdAt)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handlerEditEventTag(eventTag)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Event Tag */}
      {editEventTagModal && (
        <EditEventTag
          editEventTagData={editEventTagData}
          setEditEventTagData={setEditEventTagData}
          setEditEventTagModal={setEditEventTagModal}
          updateEventTagInList={updateEventTagInList}
        />
      )}
    </div>
  );
};

export default EventTag;
