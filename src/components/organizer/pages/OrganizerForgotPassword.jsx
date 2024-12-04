import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { forgotPasswordEmailObjectSchema } from "../../superAdmin/validation/YupValidation"; 
import {  organizerEndpoint, promoterEndPointPannel } from "../../../services/apis";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import axios from "axios";

const OrganizerForgotPassword = () => {

    const initialValues = {
      emailId: "",
    };


    const { values, errors, handleChange, handleSubmit, touched, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: forgotPasswordEmailObjectSchema,
      onSubmit: async (values) => {
        const palyload = {
          Email: values.emailId,
        };

        try {
          let response = await axios.post(
            `${organizerEndpoint.ORGANIZER_FORGOT_PASSWORD_SEND_EMAIL}`,
            palyload
          );

          toast.success(response.data.message);
          console.log(response.data);
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
              console.log(data);
              toast.error(data.message);
            }
          }
        }
      },
    });


  return (
    <div className="w-full h-full flex">
      <Toaster />
      <div className="bg-Gray85 w-[45%] h-[100vh]">
        <div className="w-full h-full"></div>
      </div>
      <div className="w-[55%] h-full">
        <div className="">
          <form
            onSubmit={handleSubmit}
            className="h-[100vh] flex flex-col justify-center w-[90%] mx-auto my-auto"
          >
            <div className="">
              <h1 className="w-full text-start font-bold text-3xl ">
                Forget Password
              </h1>
              <p className="mt-[2%] text-Gray40">
                Enter the email address you used to create the account, and we
                will email you the instructions to reset the password.{" "}
              </p>
              <div className="mt-[3%]">
                <label
                  htmlFor="productName"
                  className="block mb-2 text-xl font-medium text-gray-900 "
                >
                  Email
                </label>
                <input
                  type="emailId"
                  name="emailId"
                  id="emailId"
                  className="bg-gray-50 mt-2  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  onChange={handleChange}
                  value={values.emailId}
                  onBlur={handleBlur}
                  placeholder="Enter your Email Id"
                  required
                />
                {errors.emailId && touched.emailId ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.emailId}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-Gray40 p-2 mt-[3%] text-white rounded-xl"
            >
              Continue
            </button>
            <Link to={"/promoterlogin"}>
              <button className="w-full text-center text-lg mt-5 underline text-Gray40">
                Remember Password? Login{" "}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OrganizerForgotPassword