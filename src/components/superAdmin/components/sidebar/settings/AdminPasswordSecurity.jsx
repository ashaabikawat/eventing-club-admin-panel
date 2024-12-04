import { useFormik } from "formik";
import React, { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import {
  authendpoints,
  dashboard,
  organizerEndpoint,
} from "../../../../../services/apis";
import { useSelector } from "react-redux";
import axios from "axios";
import { resetPasswordProfileSection } from "../../../../organizer/validation/YupValidation";

const AdminPasswordSecurity = () => {
  const adminUser = useSelector((store) => store.auth);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "current") {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "reenter") {
      setShowReEnterPassword(!showReEnterPassword);
    }
  };

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
    validationSchema: resetPasswordProfileSection,
    onSubmit: async (values) => {
      const palyload = {
        user_id: adminUser.adminSignupData.user_id,
        CurrentPassword: values.currentPassword,
        NewPassword: values.newPassword,
      };

      console.log("payload", palyload);

      try {
        let response = await axios.post(
          `${dashboard.ADMIN_CHANGE_PASSWORD}`,
          palyload
        );

        console.log(response.data);
        toast.success(response.data.message);
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
        <h1 className="text-black text-2xl font-semibold">
          Password & Security
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="">
        <div className="mt-5">
          <div className="mb-4">
            <label className="block text-gray-700">Current Password</label>
            <div className="relative mt-1.5 ">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="md:w-[70%] w-[100%] p-2 border border-gray-300 rounded"
                name="currentPassword"
                id="currentPassword"
                onChange={handleChange}
                value={values.currentPassword}
                onBlur={handleBlur}
                placeholder="Enter Current Password"
                required
              />

              <span
                className="absolute inset-y-0 md:right-[32%] right-1 flex items-center cursor-pointer"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showCurrentPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )}
              </span>
            </div>
            {errors.currentPassword && touched.currentPassword ? (
              <p className="font-Marcellus text-red-900 ">
                {errors.currentPassword}
              </p>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <div className="relative mt-1.5">
              <input
                type={showNewPassword ? "text" : "password"}
                className="md:w-[70%] w-[100%] p-2 border border-gray-300 rounded"
                name="newPassword"
                id="newPassword"
                onChange={handleChange}
                value={values.newPassword}
                onBlur={handleBlur}
                placeholder="Enter new Password"
                required
              />

              <span
                className="absolute inset-y-0 md:right-[32%]  right-1 flex items-center cursor-pointer"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showNewPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )}
              </span>
            </div>
            {errors.newPassword && touched.newPassword ? (
              <p className="font-Marcellus text-red-900 pl-2">
                {errors.newPassword}
              </p>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Re-Enter Password</label>
            <div className="relative mt-1.5">
              <input
                type={showReEnterPassword ? "text" : "password"}
                className="md:w-[70%] w-[100%] p-2 border border-gray-300 rounded"
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
                value={values.confirmPassword}
                onBlur={handleBlur}
                placeholder="Enter Current Password"
                required
              />

              <span
                className="absolute inset-y-0 md:right-[32%] right-1 flex items-center cursor-pointer"
                onClick={() => togglePasswordVisibility("reenter")}
              >
                {showReEnterPassword ? (
                  <RiEyeOffFill size={20} />
                ) : (
                  <RiEyeFill size={20} />
                )}
              </span>
            </div>
            {errors.confirmPassword && touched.confirmPassword ? (
              <p className="font-Marcellus text-red-900">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>
        </div>

        <div className="w-[70%] flex justify-end mt-5">
          <button type="submit" className="bg-Gray40 p-3 mt-[3%] text-white ">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPasswordSecurity;
