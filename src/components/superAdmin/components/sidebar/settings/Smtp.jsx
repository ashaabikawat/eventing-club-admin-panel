import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { smtpDetails } from "../../../../../services/apis";

const Smtp = () => {
  const [smtp, setSmtp] = useState({});
  const [loading, setLoading] = useState(true);

  const initialValues = loading
    ? {
        port: "",
        host: "",
        username: "",
        password: "",
        encryption: "",
      }
    : {
        port: smtp?.Port,
        host: smtp?.Host,
        username: smtp?.Username,
        password: smtp?.Password,
        encryption: smtp?.Encryption,
      };

  useEffect(() => {
    fetchSmtp();
  }, []);

  const fetchSmtp = async () => {
    try {
      const response = await axios.get(`${smtpDetails.GET_ALL}`);
      setSmtp(response.data.data);
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
          console.log(data);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    //  validationSchema: resetPasswordProfileSection,
    onSubmit: async (values) => {
      // if (
      //   values.port === undefined ||
      //   values.port === null ||
      //   values.port === ""
      // ) {
      //   return toast.error("Please enter Port number");
      // }

      // if (
      //   values.host === undefined ||
      //   values.host === null ||
      //   values.host === ""
      // ) {
      //   return toast.error("Please enter host name");
      // }
      // if (
      //   values.username === undefined ||
      //   values.username === null ||
      //   values.username === ""
      // ) {
      //   return toast.error("Please enter username");
      // }

      // if (
      //   values.password === undefined ||
      //   values.password === null ||
      //   values.password === ""
      // ) {
      //   return toast.error("Please enter password");
      // }

      // if (
      //   values.encryption === undefined ||
      //   values.encryption === null ||
      //   values.encryption === ""
      // ) {
      //   return toast.error("Please enter encryption");
      // }
      // if (!isEditing) {
      //   const payload = {
      //     Port: values.port,
      //     Host: values.host,
      //     Username: values.username,
      //     Password: values.password,
      //     Encryption: values.encryption,
      //   };

      //   try {
      //     const response = await axios.post(`${smtpDetails.REGISTER}`, payload);
      //     toast.success(response.data.message);
      //     resetForm();
      //   } catch (error) {
      //     if (error.response) {
      //       const { status, data } = error.response;

      //       if (
      //         status === 404 ||
      //         status === 403 ||
      //         status === 500 ||
      //         status === 302 ||
      //         status === 409 ||
      //         status === 401 ||
      //         status === 400
      //       ) {
      //         console.log(data);
      //         toast.error(data.message);
      //       }
      //     }
      //   }
      // }

      const payload = {
        smtp_id: smtp?._id,
      };
      if (values.port !== smtp?.Port) payload.Port = values.port;
      if (values.host !== smtp?.Host) payload.Host = values.host;
      if (values.username !== smtp?.Username)
        payload.Username = values.username;
      if (values.password !== smtp?.Password)
        payload.Password = values.password;
      if (values.encryption !== smtp?.Encryption)
        payload.Encryption = values.encryption;

      try {
        const response = await axios.post(
          `${smtpDetails.UPDATE_BY_ID}`,
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
            console.log(data);
            toast.error(data.message);
          }
        }
      }
    },
  });

  return (
    <div>
      <Toaster />
      <div>
        <h1 className="text-black text-2xl font-semibold">SMTP details</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-5">
          <div className="flex md:flex-row flex-col gap-4 md:gap-14">
            <div className="">
              <label className="block text-gray-700">Port</label>
              <div className=" relative mt-1.5 ">
                <input
                  //  type={showCurrentPassword ? "text" : "password"}
                  className=" w-72 p-2 border border-gray-300 rounded"
                  name="port"
                  id="port"
                  onChange={handleChange}
                  // value={smtp?.Port}
                  value={values.port}
                  // onBlur={handleBlur}
                  placeholder="Enter port number"
                  required
                />

                <span
                  className="absolute inset-y-0 right-[32%]  flex items-center cursor-pointer"
                  //  onClick={() => togglePasswordVisibility("current")}
                >
                  {/* {showCurrentPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )} */}
                </span>
              </div>
            </div>

            <div className="">
              <label className="block text-gray-700">Host</label>
              <div className="relative mt-1.5 ">
                <input
                  //  type={showCurrentPassword ? "text" : "password"}
                  className="w-72 p-2 border border-gray-300 rounded"
                  name="host"
                  id="host"
                  onChange={handleChange}
                  value={values.host}
                  onBlur={handleBlur}
                  placeholder="Enter host"
                  required
                />

                <span
                  className="absolute inset-y-0 right-[32%]  flex items-center cursor-pointer"
                  //  onClick={() => togglePasswordVisibility("current")}
                >
                  {/* {showCurrentPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )} */}
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-4 md:gap-14 mt-5">
            <div className="">
              <label className="block text-gray-700">Username</label>
              <div className=" relative mt-1.5 ">
                <input
                  //  type={showCurrentPassword ? "text" : "password"}
                  className=" w-72 p-2 border border-gray-300 rounded"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  value={values.username}
                  onBlur={handleBlur}
                  placeholder="Enter username"
                  required
                />

                <span
                  className="absolute inset-y-0 right-[32%]  flex items-center cursor-pointer"
                  //  onClick={() => togglePasswordVisibility("current")}
                >
                  {/* {showCurrentPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )} */}
                </span>
              </div>
            </div>

            <div className="">
              <label className="block text-gray-700">Password</label>
              <div className="relative mt-1.5 ">
                <input
                  //  type={showCurrentPassword ? "text" : "password"}
                  className="w-72 p-2 border border-gray-300 rounded"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                  placeholder="Enter password"
                  required
                />

                <span
                  className="absolute inset-y-0 right-[32%]  flex items-center cursor-pointer"
                  //  onClick={() => togglePasswordVisibility("current")}
                >
                  {/* {showCurrentPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )} */}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="">
              <label className="block text-gray-700">Encryption</label>
              <div className=" relative mt-1.5 ">
                <input
                  //  type={showCurrentPassword ? "text" : "password"}
                  className=" w-full p-2 border border-gray-300 rounded"
                  name="encryption"
                  id="encryption "
                  onChange={handleChange}
                  value={values.encryption}
                  onBlur={handleBlur}
                  placeholder="Enter encryption"
                  required
                />

                <span
                  className="absolute inset-y-0 right-[32%]  flex items-center cursor-pointer"
                  //  onClick={() => togglePasswordVisibility("current")}
                >
                  {/* {showCurrentPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )} */}
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:justify-end  ">
            <button
              type="submit"
              className="bg-Gray40 px-6 py-2 mt-4 md:mt-[3%] text-white "
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Smtp;
