import toast, { Toaster } from "react-hot-toast";
import { promoterObjectSchema } from "../../../validation/YupValidation";
import { useFormik } from "formik";
import { promoterEndpoint } from "../../../../../services/apis";
import axios from "axios";
import { generatePassword } from "../../../../common/GeneratePassword";
import { copyToClipboard } from "../../../../common/CopytoClipboard";
import AddAddress from "../../../../common/AddAddress";
import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { SendDefaultPasswordMail } from "../../../../common/helper/Enum";

const CreatePromoter = ({ setPromoterCrationModal }) => {
  const adminuser = useSelector((store) => store.auth);

  const [isChecked, setIsChecked] = useState(SendDefaultPasswordMail.No);
  const [showPassword, setShowPassword] = useState(false);

  const [stateIsoCode, setStateIsoCode] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityIsoCode, setCityIsoCode] = useState(null);
  const [cityName, setCityName] = useState(null);

  const initialValues = {
    promoterFullName: "",
    promoterusername: "",
    promoterDescription: "",
    promoterEmail: "",
    promoterPhoneNo: "",
    promoterPassword: "",
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
    validationSchema: promoterObjectSchema,
    onSubmit: async (values) => {
      const payload = {
        // Email: values.promoterEmail,
        Password: values.promoterPassword,
        FullName: values.promoterFullName,
        Username: values.promoterusername,
        CreatedBy: adminuser.adminSignupData.AdminRole,
        createduser_id: adminuser.adminSignupData.user_id,
        // Description: values.promoterDescription,
        // Phone1: values.promoterPhoneNo,
        Country: "India",
        CountryIsoCode: "IN",
        State: stateName,
        StateIsoCode: stateIsoCode,
        City: cityName,
        CityIsoCode: cityIsoCode,
        SendMailFlag: isChecked,
      };

      console.log("payload", payload);

      if (
        values.promoterEmail !== "" &&
        values.promoterEmail !== undefined &&
        values.promoterEmail !== null
      )
        payload.Email = values.promoterEmail;

      if (
        values.promoterPhoneNo !== "" &&
        values.promoterPhoneNo !== undefined &&
        values.promoterPhoneNo !== null
      )
        payload.Phone1 = values.promoterPhoneNo;

      // if (
      //   values.promoterEmail !== "" &&
      //   values.promoterEmail !== undefined &&
      //   values.promoterEmail !== null
      // )
      //   payload.SendMailFlag = isChecked;

      try {
        let response = await axios.post(
          `${promoterEndpoint.REGISTER_PROMOTER_URL}`,
          payload
        );

        toast.success(response.data.message);
        resetForm();
        setIsChecked(0);
        setPromoterCrationModal(false);
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

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setFieldValue("promoterPassword", password);
    copyToClipboard(password);
    toast.success(
      `Generated password: ${password}\nPassword copied to clipboard!`
    );
  };

  const handleCheckboxChange = () => {
    const newCheckedValue =
      isChecked === SendDefaultPasswordMail.No
        ? SendDefaultPasswordMail.Yes
        : SendDefaultPasswordMail.No;
    setIsChecked(newCheckedValue);
  };

  return (
    <div>
      <Toaster />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div>
          <div className="md:w-[70%] mt-8 md:mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="promoterFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="promoterFullName"
                  name="promoterFullName"
                  value={values.promoterFullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Promoter full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.promoterFullName && touched.promoterFullName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterFullName}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="promoterusername"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  UserName
                </label>
                <input
                  type="text"
                  id="promoterusername"
                  name="promoterusername"
                  value={values.promoterusername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promoter full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.promoterusername && touched.promoterusername ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterusername}
                  </p>
                ) : null}
              </div>

              {/* <div className="md:col-span-2">
                <label
                  htmlFor="promoterDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="promoterDescription"
                  name="promoterDescription"
                  value={values.promoterDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="Enter text here..."
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.promoterDescription && touched.promoterDescription ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterDescription}
                  </p>
                ) : null}
              </div> */}

              <div className="md:col-span-1">
                <label
                  htmlFor="promoterEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="promoterEmail"
                  name="promoterEmail"
                  value={values.promoterEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promoter emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.promoterEmail && touched.promoterEmail ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterEmail}
                  </p>
                ) : null}
              </div>

              <div className="">
                <label
                  htmlFor="promoterPhoneNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No.
                </label>
                <input
                  type="text"
                  id="promoterPhoneNo"
                  name="promoterPhoneNo"
                  value={values.promoterPhoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter promoter phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.promoterPhoneNo && touched.promoterPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.promoterPhoneNo}
                  </p>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <AddAddress
                  stateIsoCode={stateIsoCode}
                  setStateIsoCode={setStateIsoCode}
                  stateName={stateName}
                  setStateName={setStateName}
                  cityIsoCode={cityIsoCode}
                  setCityIsoCode={setCityIsoCode}
                  cityName={cityName}
                  setCityName={setCityName}
                />
              </div>

              <div className="md:col-span-2 relative">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="bg-gray-50 mt-2  z-0  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  onChange={handleChange}
                  value={values.promoterPassword}
                  onBlur={handleBlur}
                  placeholder="Generate the Password"
                  required
                />
                <div className="absolute w-[98%] z-30 top-9 flex justify-end items-end">
                  <p onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <AiFillEye size={25} />
                    ) : (
                      <AiFillEyeInvisible size={25} />
                    )}
                  </p>
                </div>
                {errors.password && touched.password ? (
                  <p className="font-Marcellus text-red-900 pl-2">
                    {errors.password}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center">
              <input
                checked={isChecked === SendDefaultPasswordMail.Yes}
                id="checked-checkbox"
                type="checkbox"
                value=""
                disabled={!values?.promoterEmail}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="checked-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Tick here to send a new account information message to this
                individual
              </label>
            </div>
          </div>

          <div className="w-[70%] flex md:justify-end items-end mt-3">
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="bg-slate-300 p-2"
            >
              Generate Password
            </button>
          </div>

          <div className="w-[70%] flex md:justify-end items-end mt-3 ">
            <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePromoter;
