import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { FaqEndPoint } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { faqObjectSchema } from "../../../validation/YupValidation";

const EditFaq = () => {

   const { _id } = useParams();
  const navigate = useNavigate();

  const [faqData, setFaqData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaqDataById();
  }, []);

  //   Fetch Artist Data by Id
  const getFaqDataById = async () => {
    try {
      const payload = {
        faq_id: _id,
      };

      let response = await axios.post(
        `${FaqEndPoint.FAQ_GET_DATA_BY_ID}`,
        payload
      );

      setFaqData(response.data.data);
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

  const initialValues = loading
    ? {
        faqTag: "",
        faqQuestion: "",
        faqAnswer: "",
      }
    : {
        faqTag: faqData?.Tag,
        faqQuestion: faqData?.Question,
        faqAnswer: faqData?.Answer,
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
    validationSchema: faqObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        faq_id: _id,
        Tag: values.faqTag,
        Question: values.faqQuestion,
        Answer: values.faqAnswer,
      };

      try {
        let response = await axios.post(
          `${FaqEndPoint.FAQ_DATA_UPDATED}`,
          payload
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

  return <div>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Faq"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/faq")}
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
        <h1 className="text-3xl font-semibold -mt-2">Edit Faq</h1>
      </div>

   
      {/* Form Data */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="">
          <div className="w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* Faq Tag */}
             
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tag*
                </label>
                <input
                  type="text"
                  id="faqTag"
                  name="faqTag"
                  value={values.faqTag}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.faqTag && touched.faqTag ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.faqTag}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2 mb-4">
                <label
                  htmlFor="faqQuestion"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                 Question
                </label>
                <textarea
                  id="faqQuestion"
                  name="faqQuestion"
                  value={values.faqQuestion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.faqQuestion && touched.faqQuestion ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.faqQuestion}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2 ">
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
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.faqAnswer && touched.faqAnswer ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.faqAnswer}
                  </p>
                ) : null}
              </div>


             
            </div>
          </div>

          <div className="w-[70%] flex justify-end items-end ">
            <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>;
};

export default EditFaq;
