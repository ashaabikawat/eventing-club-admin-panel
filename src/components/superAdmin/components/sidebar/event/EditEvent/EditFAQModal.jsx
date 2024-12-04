import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { faqObjectSchema } from "../../../../validation/YupValidation";
import toast, { Toaster } from "react-hot-toast";
import { eventEndPoint } from "../../../../../../services/apis";
import axios from "axios";

const EditFAQModal = ({ faqDataEditObject, setFaqEditModal , _id  , updateFAQData  }) => {

   console.log({faqDataEditObject})

  const initialValues = {
    faqQuestion: faqDataEditObject.Question,
    faqAnswer: faqDataEditObject.Answer,
  };

  const { values, errors, handleChange, handleSubmit, touched, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: faqObjectSchema,
      onSubmit: async (values) => {
        // const updatedFAQ = { ...faqToEdit, Question: values.faqQuestion, Answer: values.faqAnswer };
        // onUpdateFAQ(updatedFAQ);
        // toast.success("FAQ successfully updated!");

        try {
          const payload = {
            event_id: _id,
            eventFaq_Id: faqDataEditObject._id,
            Question:values.faqQuestion,
            Answer: values.faqAnswer,
          };

          let response = await axios.post(
            `${eventEndPoint.EDIT_EVENT_FAQ_}`,
            payload
          );

          toast.success(response.data.message);
          updateFAQData(response.data.data);
          setFaqEditModal(false)

         //  console.log(response.data)

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

  const handleModalClose = () => {
    setFaqEditModal(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4 rounded-md md:w-[50%]">
        <h2 className="text-lg font-bold">Edit FAQ</h2>
        <Toaster />
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="faqQuestion"
              className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
            >
              Question*
            </label>
            <input
              type="text"
              id="faqQuestion"
              name="faqQuestion"
              value={values.faqQuestion}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.faqQuestion && touched.faqQuestion ? (
              <p className="text-start text-red-900">{errors.faqQuestion}</p>
            ) : null}
          </div>

          <div className="mt-4">
            <label
              htmlFor="faqAnswer"
              className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
            >
              Answer*
            </label>
            <textarea
              id="faqAnswer"
              name="faqAnswer"
              value={values.faqAnswer}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.faqAnswer && touched.faqAnswer ? (
              <p className="text-start text-red-900">{errors.faqAnswer}</p>
            ) : null}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white bg-blue-600 rounded-md"
              onClick={() => handlerSaveClick()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFAQModal;
