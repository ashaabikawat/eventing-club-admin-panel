import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { resetPasswordObjectSchema } from "../validation/YupValidation";

const ForgotPassword = () => {

  const [adminData, setAdminData] = useState([]);

  const initialValues = {
    password: "",
    confirmPassword: "",
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
    validationSchema: resetPasswordObjectSchema,
    onSubmit: async (values) => {
      const palyload = {
        Email: values.emailId,
        Password: values.password,
      };

      console.log("payload", palyload);

      try {
        let response = await axios.post(`${authendpoints.LOGIN_API}`, palyload);
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
                Reset Password
              </h1>

              <p className="w-full text-start mt-[2%]">
                Admin, your  new password must be different from the any of your previous one . {" "}
              </p>
              <div className="mt-[3%]">
                <label
                  htmlFor="password"
                  className="block mb-2 text-xl font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 mt-2  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                  placeholder="Enter the Password"
                  required
                />
                 {errors.password && touched.password ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.password}
                  </p>
                ) : null}
              </div>
              <div className="mt-[3%]">
                <label
                  htmlFor="password"
                  className="block mb-2 text-xl font-medium text-gray-900 "
                >
                 Re-enter Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="bg-gray-50 mt-2  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  onChange={handleChange}
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  placeholder="Re-Enter Password"
                  required
                />
                 {errors.confirmPassword && touched.confirmPassword ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-Gray40 p-2 mt-[3%] text-white rounded-xl"
            >
               Save & Continue
            </button>
            <Link to={"/"}>
              <button className="w-full text-center text-xl mt-5 underline text-Gray40">
                Remember Password? Login ?{" "}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
