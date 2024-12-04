import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { eventTagEndPoint } from "../../../../../services/apis";
import { eventTagObjectSchema } from "../../../validation/YupValidation";
import { FaWindowClose } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const EditEventTag = ({ editEventTagData, setEditEventTagData , setEditEventTagModal , updateEventTagInList}) => {
  const initialValues = {
    eventtag:editEventTagData.EventTagName,
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema: eventTagObjectSchema,
    onSubmit: async (values) => {
      const payload = {
        EventTag_id : editEventTagData._id,
        EventTagName: values.eventtag,
      };

      console.log("payload", payload);

      try {
        let response = await axios.post(
          `${eventTagEndPoint.EDIT_EVENT_TAG_DATA}`,
          payload
        );

        toast.success(response.data.message);
        updateEventTagInList(response.data.data); 
        setEditEventTagModal(false)
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
    <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4  rounded-md  md:w-[40%]">
         <Toaster/>
        <div className="w-[96%] flex justify-between">
          <p className="text-xl pl-2 text-black font-bold ">Edit Event Tag</p>
          <p
            onClick={() => setEditEventTagModal(false)}
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
        >
          <div className="mt-4 w-[96%] mx-auto">
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
              <button className="px-5 py-2 text-white bg-Gray40" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventTag;
