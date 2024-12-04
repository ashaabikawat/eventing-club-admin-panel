import React, { useState } from "react";
import { RiCircleFill } from "react-icons/ri";
import PersonalDataAdmin from "./PersonalDataAdmin";
import AdminPasswordSecurity from "./AdminPasswordSecurity";
import Smtp from "./Smtp";

const AdminSettings = () => {
  const [activeComponent, setActiveComponent] = useState("PersonalData");

  const renderComponent = () => {
    if (activeComponent === "PersonalData") {
      return <PersonalDataAdmin />;
    } else if (activeComponent === "PasswordSecurity") {
      return <AdminPasswordSecurity />;
    } else if (activeComponent === "smtp") {
      return <Smtp />;
    }
  };

  return (
    <div>
      <div className="w-full  ">
        <h1 className="mt-5 pb-5 border-b-[1px] pl-5 text-3xl text-black font-semibold">
          Settings
        </h1>
      </div>
      <div className=" w-full flex md:pl-5 md:gap-0 gap-4">
        <div className="w-[30%] mt-5">
          <h1
            onClick={() => setActiveComponent("PersonalData")}
            className={`flex cursor-pointer py-2 px-2 ${
              activeComponent === "PersonalData" ? "bg-[#F5F5F5] " : ""
            }`}
          >
            <span className="mr-2">
              <RiCircleFill size={25} color="#868686" />
            </span>
            Personal data
          </h1>
          <h1
            onClick={() => setActiveComponent("PasswordSecurity")}
            className={`flex mt-2 cursor-pointer py-2 ${
              activeComponent === "PasswordSecurity" ? "bg-[#F5F5F5]" : ""
            }`}
          >
            <span className="mr-2">
              <RiCircleFill size={25} color="#868686" />
            </span>
            Password & Security
          </h1>
          <h1
            onClick={() => setActiveComponent("smtp")}
            className={`flex mt-2 cursor-pointer py-2 ${
              activeComponent === "smtp" ? "bg-[#F5F5F5]" : ""
            }`}
          >
            <span className="mr-2">
              <RiCircleFill size={25} color="#868686" />
            </span>
            SMTP details
          </h1>
        </div>

        <div className="md:w-[70%] w-[100%] border-l-2">
          <div className="mt-5 md:w-[90%] mx-4 md:mx-auto">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
