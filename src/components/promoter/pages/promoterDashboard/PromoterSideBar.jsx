import React, { useState } from "react";

import { BiSolidCalendarEvent } from "react-icons/bi";
import { TbBrandBooking, TbReportAnalytics } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

import { ImPriceTags } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

// New icons
import { NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { GrDocumentUser } from "react-icons/gr";
import { TbLogout2 } from "react-icons/tb";
import {
  setPromoterSignupData,
  setToken,
} from "../../../../slices/promoterAuthSlice";
import logo from "../../../../../public/TicketEventingClubLogo.png";

const PromoterSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const promoterUserId = useSelector(
    (store) => store.promoterauth.promoterSignupData.user_id
  );

  const handleLogout = () => {
    // Clear the Redux store
    dispatch(setPromoterSignupData(null));
    dispatch(setToken(null));

    // Clear localStorage
    localStorage.removeItem("promotertoken");

    // Redirect to promoter login page
    navigate("/promoterlogin");
  };

  return (
    <div className="overflow-auto  flex items-end justify-end px-4">
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center border border-gray-400 p-2 mt-2  ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        {isOpen ? (
          <IoMdClose size={22} />
        ) : (
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        )}
      </button>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0`}
        aria-label="SideBar"
      >
        <div className="h-full relative px-3 py-4 z-50 overflow-y-auto bg-Gray85">
          <div className="flex items-center justify-center my-3 ">
            <NavLink
              //  onClick={handleMenuItemClick}
              to="/promoter/dashboard/event"
              className="flex items-center flex-shrink-0 text-xl text-gray-800  my-2"
            >
              <img src={logo} className="h-full mr-5 sm:h-14" alt="Logo" />
            </NavLink>
          </div>
          <ul className="space-y-2 font-medium">
            {/* <NavLink to={"/organizer/dashboard"}> */}
            {/* <li>
              <button
                type="button"
                className="px-5 flex items-center w-full p-2 border-b-2 pb-4 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
              >
                <GrDocumentUser />

                <span className="flex-1 ml-3 text-xl text-left  whitespace-nowrap">
                  DashBoard
                </span>
              </button>
            </li> */}
            {/* </NavLink> */}

            <NavLink to={"/promoter/dashboard/event"}>
              <li>
                <button
                  type="button"
                  className="flex items-center text-center  mt-6 w-full p-2 px-5 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                  aria-controls="dropdown-example"
                  onClick={toggleSidebar}
                >
                  <BiSolidCalendarEvent size={23} />
                  <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                    Event
                  </span>
                </button>
              </li>
            </NavLink>

            <NavLink to={`/promoter/dashboard/event/booking/${promoterUserId}`}>
              <li>
                <button
                  type="button"
                  className="px-5 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                  aria-controls="dropdown-example"
                  onClick={toggleSidebar}
                >
                  <TbBrandBooking size={20} />
                  <span className="flex-1 ml-3 text-left text-lg whitespace-nowrap">
                    Bookings
                  </span>
                </button>
              </li>
            </NavLink>

            <NavLink to={"/promoter/dashboard/report"}>
              <li>
                <button
                  type="button"
                  className="px-5 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                  aria-controls="dropdown-example"
                  onClick={toggleSidebar}
                >
                  <TbReportAnalytics size={20} />

                  <span className="flex-1 ml-3 text-left text-lg whitespace-nowrap">
                    Reports
                  </span>
                </button>
              </li>
            </NavLink>

            <NavLink to={"/promoter/dashboard/setting"}>
              <li>
                <button
                  type="button"
                  className="px-5 flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                  aria-controls="dropdown-example"
                  onClick={toggleSidebar}
                >
                  <IoSettings size={20} />

                  <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                    Settings
                  </span>
                </button>
              </li>
            </NavLink>
          </ul>
          <div className="absolute top-[90%] w-[86%] flex justify-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-white  bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
            >
              <span className="mr-3">
                <TbLogout2 size={25} />
              </span>
              Log out
            </button>
          </div>
        </div>
      </aside>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg md:w-1/3">
            <h2 className="text-xl font-bold">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoterSideBar;
