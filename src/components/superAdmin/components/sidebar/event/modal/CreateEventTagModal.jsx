import React from "react";
import { eventTagEndPoint } from "../../../../../../services/apis";
import { useFormik } from "formik";
import { eventTagObjectSchema } from "../../../../validation/YupValidation";
import axios from "axios";
import { FaWindowClose } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const CreateEventTagModal = ({setShowCreateEventTagModal , onNewEventTag}) => {

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
        onNewEventTag(response.data.data)
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

 

  const handlerSaveClick = () => {
    handleSubmit();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4  rounded-md  md:w-[50%]">
         <Toaster/>
          <div className="w-[96%] flex justify-between">
              <p className="text-xl pl-2 text-black font-bold ">
                Create Event Tag
              </p>
              <p
                onClick={() => setShowCreateEventTagModal(false)}
                className="flex justify-center cursor-pointer items-center"
              >
                <FaWindowClose size={25} />
              </p>
            </div>

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
                    type="button"
                    onClick={() => handlerSaveClick()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
      </div>
    </div>
  );
};

export default CreateEventTagModal;
