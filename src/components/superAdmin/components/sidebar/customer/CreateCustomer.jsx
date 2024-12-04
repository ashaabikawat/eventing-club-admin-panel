import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useFormik } from "formik";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { customerObjectSchema } from "../../../validation/YupValidation";
import { websiteCustomer } from "../../../../../services/apis";
import { useSelector } from "react-redux";

const CreateCustomer = () => {

   const adminuser = useSelector((store) => store.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(0);

  const initialValues = {
    customerFullName: "",
    // customerDescription: "",
    customerEmail: "",
    customerPhoneNo: "",
    // customerPassword: "",
    // messageCheckbox: false,
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
    validationSchema: customerObjectSchema,
    onSubmit: async (values) => {
      const payload = {
        Email: values.customerEmail,
        CustomerName: values.customerFullName,
        MobileNumber: values.customerPhoneNo,
        createduser_id:adminuser.adminSignupData.user_id
        // Description: values.customerDescription,
        // Password: values.customerPassword,
        // SendMailFlag: isChecked,
      };

      console.log({ payload });

      try {
        let response = await axios.post(
          `${websiteCustomer.CREATE_CUSTOMER_WEBSITE}`,
          payload
        );

        console.log({response});

        toast.success(response.data.message);
        resetForm();
        // setIsChecked(0);
        console.log(response.data.date);
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

  const handleCheckboxChange = () => {
    setIsChecked((prevValue) => !prevValue);
    setFieldValue("messageCheckbox", !isChecked);
  };

  console.log({ errors });

  return (
    <div>
      <Toaster />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="md:w-[70%] sm:w-[80%] xl:w-[60%] mt-[2%]">
          <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
            {/* First Name Input Field  */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
              >
                Customer Full Name*
              </label>
              <input
                type="text"
                id="customerFullName"
                name="customerFullName"
                value={values.customerFullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.customerFullName && touched.customerFullName ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.customerFullName}
                </p>
              ) : null}
            </div>

            {/* Customer Description*/}
            {/* <div className="md:col-span-2 mb-2">
              <label
                htmlFor="customerDescription"
                className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
              >
                Customer Description*
              </label>
              <textarea
                id="customerDescription"
                name="customerDescription"
                value={values.customerDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.customerDescription && touched.customerDescription ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.customerDescription}
                </p>
              ) : null}
            </div> */}

            <div className="w-full md:col-span-2 flex justify-between gap-x-4">
              <div className="w-[100%]">
                <label
                  htmlFor="customerEmail"
                  className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={values.customerEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.customerEmail && touched.customerEmail ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.customerEmail}
                  </p>
                ) : null}
              </div>
              <div className="w-[100%]">
                <label
                  htmlFor="customerPhoneNo"
                  className="block mb-2 text-start text-base font-medium text-gray-900 dark:text-white"
                >
                  Phone Number*
                </label>
                <input
                  type="text"
                  id="customerPhoneNo"
                  name="customerPhoneNo"
                  value={values.customerPhoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.customerPhoneNo && touched.customerPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.customerPhoneNo}
                  </p>
                ) : null}
              </div>
            </div>

            {/* <div className="md:col-span-2 relative">
              <label
                htmlFor="name"
                className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
  
                type={showPassword ? "text" : "text"}
                name="customerPassword"
                id="customerPassword"
                className="bg-gray-50 mt-2 z-10  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                onChange={handleChange}
                value={values.customerPassword}
                onBlur={handleBlur}
                placeholder="Enter the Password"
              /> */}
            {/* <div className="absolute w-[98%] z-0 top-9 flex justify-end items-end">
              <p onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <AiFillEye size={25} />
                ) : (
                  <AiFillEyeInvisible size={25} />
                )}
              </p>
            </div> */}
            {/* {errors.customerPassword && touched.customerPassword ? (
                <p className="font-Marcellus text-red-900 pl-2">
                  {errors.customerPassword}
                </p>
              ) : null}
            </div> */}
            {/* <div className="flex mt-7 md:col-span-2 md:gap-2 gap-1 md:w-full md:text-lg items-center">
              <input
                type="checkbox"
                id="messageCheckbox"
                className="hidden"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="messageCheckbox"
                className="relative cursor-pointer flex items-center"
              >
                <div
                  className={`w-6 h-6 border-[1px] border-text_Color2 rounded-md ${
                    isChecked ? "bg-text_Color2" : ""
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="w-4 h-4  absolute inset-0 mt-1.5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-text_Color font-Marcellus">
                  Tick here to send a new account information message to this
                  individual
                </span>
              </label>
            </div> */}
          </div>
          <div className="w-full flex justify-end items-end ">
            <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
