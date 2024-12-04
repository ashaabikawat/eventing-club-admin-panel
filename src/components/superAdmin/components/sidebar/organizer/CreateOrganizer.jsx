import toast, { Toaster } from "react-hot-toast";
import { organizerObjectSchema } from "../../../validation/YupValidation";
import { useFormik } from "formik";
import { organizerEndpoint } from "../../../../../services/apis";
import axios from "axios";
import { generatePassword } from "../../../../common/GeneratePassword";
import { copyToClipboard } from "../../../../common/CopytoClipboard";
import AddAddress from "../../../../common/AddAddress";
import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { OrganizerOwnerType } from "../../../data/EventSelection";
import { SendDefaultPasswordMail } from "../../../../common/helper/Enum";

const CreateOrganizer = ({ setOrganizerCrationModal }) => {
  const adminuser = useSelector((store) => store.auth);
  const [isChecked, setIsChecked] = useState(SendDefaultPasswordMail.No);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [clubName, setClubName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [stateIsoCode, setStateIsoCode] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityIsoCode, setCityIsoCode] = useState(null);
  const [cityName, setCityName] = useState(null);

  // console.log({selectedOption})

  const initialValues = {
    organizerFullName: "",
    organizerusername: "",
    organizerDescription: "",
    organizerEmail: "",
    organizerPhoneNo: "",
    organizerPassword: "",
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
    validationSchema: organizerObjectSchema,
    onSubmit: async (values) => {
      // Description: values.organizerDescription,

      if (
        selectedOption === "" ||
        selectedOption === undefined ||
        selectedOption === null
      ) {
        return toast.error("Please select Owner Type");
      }

      const payload = {
        // Email: values.organizerEmail,
        Password: values.organizerPassword,
        FullName: values.organizerFullName,
        Username: values.organizerusername,
        // Phone1: values.organizerPhoneNo,
        CreatedBy: adminuser.adminSignupData.AdminRole,
        createduser_id: adminuser.adminSignupData.user_id,
        Country: "India",
        CountryIsoCode: "IN",
        State: stateName,
        StateIsoCode: stateIsoCode,
        City: cityName,
        CityIsoCode: cityIsoCode,
        SendMailFlag: isChecked,
        OwnerType:
          selectedOption === "ownClub"
            ? OrganizerOwnerType.Club
            : OrganizerOwnerType.EventCompany,
      };

      if (selectedOption === "ownClub") {
        payload.CompanyName = clubName;
      } else {
        payload.CompanyName = companyName;
      }

      if (
        values.organizerEmail !== "" &&
        values.organizerEmail !== undefined &&
        values.organizerEmail !== null
      )
        payload.Email = values.organizerEmail;

      if (
        values.organizerPhoneNo !== "" &&
        values.organizerPhoneNo !== undefined &&
        values.organizerPhoneNo !== null
      )
        payload.Phone1 = values.organizerPhoneNo;

      // console.log("selectedOption", selectedOption);

      try {
        let response = await axios.post(
          `${organizerEndpoint.REGISTER_ORGANIZER_URL}`,
          payload
        );

        toast.success(response.data.message);
        resetForm();
        setIsChecked(0);
        setOrganizerCrationModal(false);
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
    setFieldValue("organizerPassword", password);
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

  const handleOptionChange = (e) => {
    // console.log({e})
    setSelectedOption(e.target.value);
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
          <div className="md:w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              <div className="flex items-center mt-4">
                <input
                  type="radio"
                  id="ownClub"
                  name="organizerType"
                  value="ownClub"
                  checked={selectedOption === "ownClub"}
                  onChange={handleOptionChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="ownClub"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Own club
                </label>
              </div>

              <div className="flex  items-center mt-4">
                <input
                  type="radio"
                  id="eventCompany"
                  name="organizerType"
                  value="eventCompany"
                  checked={selectedOption === "eventCompany"}
                  onChange={handleOptionChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="eventCompany"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Event company name
                </label>
              </div>

              {selectedOption === "ownClub" && (
                <div className="mt-2 md:col-span-2">
                  <label
                    htmlFor="clubName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Own Club Name
                  </label>
                  <input
                    type="text"
                    id="clubName"
                    name="clubName"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your club name"
                  />
                </div>
              )}

              {selectedOption === "eventCompany" && (
                <div className="mt-2 md:col-span-2">
                  <label
                    htmlFor="companyName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Event Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter event company name"
                  />
                </div>
              )}

              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="organizerFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="organizerFullName"
                  name="organizerFullName"
                  value={values.organizerFullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerFullName && touched.organizerFullName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerFullName}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="organizerFullName"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  UserName
                </label>
                <input
                  type="text"
                  id="organizerusername"
                  name="organizerusername"
                  value={values.organizerusername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer full name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerusername && touched.organizerusername ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerusername}
                  </p>
                ) : null}
              </div>

              {/* Email id  */}
              <div className="md:col-span-1">
                <label
                  htmlFor="organizerEmail"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Id
                </label>
                <input
                  type="email"
                  id="organizerEmail"
                  name="organizerEmail"
                  value={values.organizerEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer emailId "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerEmail && touched.organizerEmail ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerEmail}
                  </p>
                ) : null}
              </div>

              {/* Phone No. */}
              <div className="">
                <label
                  htmlFor="organizerPhoneNo"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone No.
                </label>
                <input
                  type="text"
                  id="organizerPhoneNo"
                  name="organizerPhoneNo"
                  value={values.organizerPhoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter organizer phone number "
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.organizerPhoneNo && touched.organizerPhoneNo ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.organizerPhoneNo}
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

              {/* Password  */}
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
                  value={values.organizerPassword}
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

            {/* Check box for send password to mail */}
            <div className="flex items-center">
              <input
                checked={isChecked === SendDefaultPasswordMail.Yes}
                id="checked-checkbox"
                type="checkbox"
                value=""
                disabled={!values?.organizerEmail}
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
            {/* <div className="flex mt-7 md:gap-2 gap-1 md:w-full md:text-lg items-center">
              <input
                type="checkbox"
                id="whatappcheck"
                className="hidden"
                checked={isChecked === 1}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="whatappcheck"
                className="relative cursor-pointer flex items-center"
              >
                <div
                  className={`w-6 h-6 border-[1px] border-text_Color2 rounded-md ${
                    isChecked === 1 ? "bg-text_Color2" : ""
                  }`}
                >
                  {isChecked === 1 && (
                    <svg
                      className="w-4 h-4 text-white absolute inset-0  sm:mt-1 mobile:mt-4 lg:mt-1.5"
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
                 Tick here to send a new account information message to this individual  
                </span>
              </label>
            </div> */}
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

export default CreateOrganizer;
