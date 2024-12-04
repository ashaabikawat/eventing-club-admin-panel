import React, { useEffect, useState } from "react";
import ProfileImage from "../../../../assets/profile.png";
import { TfiAngleDown } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";

const PromoterDashBoardComponent = () => {
  const [openProfileSection, setProfileSection] = useState(false);
  const [today, setToday] = useState(new Date());

  // Hook to navigate to different routes
  const navigate = useNavigate();

  // Selector to get data from the Redux store
  const promoterUser = useSelector((store) => store.promoterauth);
  console.log(promoterUser);

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const daylist = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Satur"];

  const day = today.getDay();

  return (
    <div className="w-full h-auto">
      {/* Search bar section */}
      <div className="w-[100%] h-[6%] border-b-2 pb-4  relative">
        <div className="w-[96%] h-full mx-auto flex justify-between ">
          <div className="w-[80%]">
            <div className="md:w-[40%] w-full ">
              <h1 className="md:text-2xl text-xl text-black font-semibold">
                {`Welcome back, ${promoterUser?.promoterSignupData?.Username}`}
              </h1>
            </div>
          </div>
          {/* <div className="flex justify-center items-center">
            <div className="flex border-r-[1px]">
              <div id="timeHTML" className="flex mr-3 py-2 px-2 bg-Gray85 ">
                <IoCalendarOutline size={20} className="mr-1 mt-0.5" />
                {daylist[day]}, {today.getDate()}
              </div>
            </div>
            <img
              src={ProfileImage}
              className="h-11 w-11  ml-1 rounded-full"
              alt=""
            />

          </div> */}
        </div>
      </div>

      {/* Profile section */}
      {/* {openProfileSection && (
        <div className="w-[79%] flex justify-end items-end absolute">
          <div
            onMouseLeave={() => setProfileSection(false)}
            className="h-[250px] w-[30%]   bg-Gray85 "
          >
            <div className="w-[90%] h-full py-[6%] mx-auto my-auto">
              <h1 className="text-2xl font-bold pl-4">Admin Profile</h1>
              <p className="text-lg pb-4 border-b-[1px] border-black border-opacity-20 pl-4">
                {organizerUser?.organizerSignupData?.Email}
              </p>

              <div className="mt-[3%] pb-[3%] border-b-[1px] border-black border-opacity-20">
                <button
                  onClick={() => navigate("/superAdmin/dashboard/profiledata")}
                  className="flex justify-center items-center pl-4"
                >
                  <p className="w-4 h-4 rounded-full bg-Gray40  "></p>
                  <span className="pl-2 text-lg font-normal">
                    Personal Data
                  </span>
                </button>
                <button className="flex justify-center items-center mt-3  pl-4">
                  <p className="w-4 h-4 rounded-full bg-Gray40 font-normal "></p>
                  <span className="pl-2 text-lg">Settings</span>
                </button>
              </div>
              <button className="flex justify-center items-center mt-3  pl-4">
                <p className="w-4 h-4 rounded-full bg-Gray40 font-normal "></p>
                <span className="pl-2 text-lg">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PromoterDashBoardComponent;
