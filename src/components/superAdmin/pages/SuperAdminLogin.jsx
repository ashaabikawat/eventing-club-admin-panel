import { useEffect, useState } from "react";
import { loginObjectSchema } from "../validation/YupValidation";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { authendpoints } from "../../../services/apis";
import { useDispatch } from "react-redux";
import { setadminSignupData } from "../../../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const [accessLeveldata, setAccessLeveldata] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    userName: "",
    password: "",
  };

  const { values, errors, handleChange, handleSubmit, touched, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: loginObjectSchema,
      onSubmit: async (values) => {
        const palyload = {
          Username: values.userName,
          Password: values.password,
        };

        console.log("payload", palyload);

        try {
          let response = await axios.post(
            `${authendpoints.LOGIN_API}`,
            palyload
          );

          console.log(response.data);
          toast.success(response.data.message);
          dispatch(setadminSignupData(response.data.data));
          localStorage.setItem("admintoken", response.data.data.token);
          // navigate("/superAdmin/dashboard")
          navigate("/superAdmin/dashboard/event");
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
      <div className="bg-Gray85 hidden md:block w-[45%] h-[100vh]">
        <div className="w-full h-full"></div>
      </div>
      <div className="md:w-[55%] w-full h-full">
        <div className="">
          <form
            onSubmit={handleSubmit}
            className="h-[100vh] flex flex-col justify-center w-[90%] mx-auto my-auto"
          >
            <div className="">
              <h1 className="w-full text-start font-bold text-3xl ">Log In</h1>
              <div className="mt-[3%]">
                <label
                  htmlFor="productName"
                  className="block mb-2 text-xl font-medium text-gray-900 "
                >
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="bg-gray-50 mt-2  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  onChange={handleChange}
                  value={values.userName}
                  onBlur={handleBlur}
                  placeholder="Enter Username"
                  required
                />
                {errors.userName && touched.userName ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.userName}
                  </p>
                ) : null}
              </div>

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
                  placeholder="Enter your Password"
                  required
                />
                {errors.password && touched.password ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.password}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-Gray40 p-2 mt-[3%] text-white rounded-xl"
            >
              Log In
            </button>
            {/* <Link to={"/forgotpassword"}>
              <button className="w-full text-center text-xl mt-5 underline text-Gray40">
                Forget Password ?{" "}
              </button>
            </Link> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
