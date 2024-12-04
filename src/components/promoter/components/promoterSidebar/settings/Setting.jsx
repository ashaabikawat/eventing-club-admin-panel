import { RiCircleFill } from "react-icons/ri";
import PersonalData from "./PersonalData";
import PasswordSecurity from "./PasswordSecurity";
import { useState } from "react";

const Setting = () => {
  const [activeComponent, setActiveComponent] = useState("PersonalData");

  const renderComponent = () => {
    if (activeComponent === "PersonalData") {
      return <PersonalData />;
    } else if (activeComponent === "PasswordSecurity") {
      return <PasswordSecurity />;
    }
  };

  return (
    <div className="min-h-screen  ">
      <div className="w-full ">
        <h1 className="mt-5 pb-5 pl-5 text-3xl text-black font-semibold">
          Settings
        </h1>
      </div>

      <div className=" w-full  pl-5">
        {/* <div className="w-[30%] mt-5">
          <h1
            onClick={() => setActiveComponent("PersonalData")}
            className={`flex cursor-pointer py-2 ${activeComponent === 'PersonalData' ? 'bg-[#F5F5F5] ' : ''}`}
          >
            <span className="mr-2">
              <RiCircleFill size={25} color="#868686" />
            </span>
            Personal data
          </h1>
          <h1
            onClick={() => setActiveComponent("PasswordSecurity")}
            className={`flex mt-2 cursor-pointer py-2 ${activeComponent === 'PasswordSecurity' ? 'bg-[#F5F5F5]' : ''}`}
          >
            <span className="mr-2">
              <RiCircleFill size={25} color="#868686" />
            </span>
            Password & Security
          </h1>
        </div>

        <div className="w-[70%] border-l-2">
          <div className="mt-5 w-[90%] mx-auto">{renderComponent()}</div>
        </div> */}
        <div className="w-full ">
          <PasswordSecurity />
        </div>
      </div>
    </div>
  );
};

export default Setting;
