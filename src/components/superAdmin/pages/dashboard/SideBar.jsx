import React, { useState } from "react";

import { BiSolidCalendarEvent } from "react-icons/bi";
import { MdOutlineArticle } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { TbBrandBooking, TbLogout2 } from "react-icons/tb";
import { VscOrganization } from "react-icons/vsc";
import { MdSell } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { MdEventNote } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { FcRules } from "react-icons/fc";
import { FaQuestion } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
// New icons
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IoSettings } from "react-icons/io5";
import { GrDocumentUser } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdEventSeat } from "react-icons/md";
import { handleLogout } from "../../../../reducer/persistorStore/reduxstore";
import logo from "../../../../../public/EC Logo White Name-01 (1).svg";
import { FaImage } from "react-icons/fa";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { RiCouponLine } from "react-icons/ri";
import { FaUserLarge } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { RiMapPinFill } from "react-icons/ri";
import { MdTour } from "react-icons/md";
import { PiUserSoundBold } from "react-icons/pi";
import { MdCategory } from "react-icons/md";
import { BsCalendarEventFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutOnClick = () => {
    handleLogout();
    setShowModal(false);
    // Redirect to superadmin login page
    navigate("/superadmin");
  };

  const adminUserId = useSelector(
    (store) => store.auth.adminSignupData.user_id
  );
  // console.log(adminUserId);

  return (
    <>
      <div className="overflow-auto  flex items-end justify-end px-4 ">
        <button
          data-drawer-target="sidebar-multi-level-sidebar"
          data-drawer-toggle="sidebar-multi-level-sidebar"
          aria-controls="sidebar-multi-level-sidebar"
          type="button"
          className="inline-flex items-center border border-gray-400 p-2 mt-2  ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-hoverColor focus:outline-none focus:ring-2 focus:ring-gray-200 "
          // className="inline-flex justify-end  w-full items-center p-2 mt-2  text-sm rounded-lg sm:hidden   "
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
          <div className="h-full px-3 py-4 overflow-y-auto bg-strongBlue">
            <div className="flex items-center justify-center my-3 ">
              <NavLink
                //  onClick={handleMenuItemClick}
                to="/superAdmin/dashboard/event"
                className="flex items-center flex-shrink-0 text-xl text-gray-800  my-2"
              >
                <img
                  src={logo}
                  className="h-full w-52 mr-5 sm:h-14"
                  alt="Logo"
                />
              </NavLink>
            </div>
            <ul className="space-y-2 font-medium">
              {/* <NavLink to={"/superAdmin/dashboard"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 border-b-2 pb-4 text-white transition duration-75 rounded-lg group hover:bg-hoverColor dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                  >
                    <GrDocumentUser />

                    <span className="flex-1 ml-3 text-xl text-left  whitespace-nowrap">
                      DashBoard
                    </span>
                  </button>
                </li>
              </NavLink> */}

              <NavLink to={"/superAdmin/dashboard/event"}>
                <li>
                  <button
                    type="button"
                    className="flex items-center text-center w-full text-white p-2 px-5 transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <BsCalendarEventFill size={20} />
                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Event
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/artist"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2  text-white transition duration-75 rounded-lg group hover:bg-hoverColor  "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <FaUserLarge size={20} />
                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Artist
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/categorie"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <BiSolidCategoryAlt size={20} />
                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Categories
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/genre"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center  w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <MdCategory size={20} />

                    <span className="flex-1 ml-3 text-left text-lg whitespace-nowrap">
                      Genre
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/eventtour"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <MdTour size={20} />
                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Event Tour
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/venue"}>
                <li>
                  <button
                    type="button"
                    className=" px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor  "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <RiMapPinFill size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Venue
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={`/superAdmin/dashboard/bookings`}>
                <li>
                  <button
                    type="button"
                    className=" px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <TbBrandBooking size={20} />

                    <span className="flex-1 text-lg ml-3 text-left whitespace-nowrap">
                      Booking
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/organizer"}>
                <li>
                  <button
                    type="button"
                    className=" px-5  flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <VscOrganization size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Organizer
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/promoter"}>
                <li>
                  <button
                    type="button"
                    className="px-5  flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <PiUserSoundBold size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Promoter
                    </span>
                  </button>
                </li>
              </NavLink>

              {/* <NavLink to={""}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                  >
                    <GrUserWorker size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Employee
                    </span>
                  </button>
                </li>
              </NavLink> */}

              <NavLink to={"/superAdmin/dashboard/customer"}>
                <li>
                  <button
                    type="button"
                    className=" px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <FaCircleUser size={20} />
                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Customer
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/promocodes"}>
                <li>
                  <button
                    type="button"
                    className=" px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <RiCouponLine size={20} />

                    <span className="flex-1 ml-3 text-left text-lg whitespace-nowrap">
                      Promocode
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/report"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
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

              <NavLink to={"/superAdmin/dashboard/banner"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <FaImage size={20} />

                    <span className="flex-1 ml-3 text-left text-lg whitespace-nowrap">
                      Banner
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superAdmin/dashboard/scannerUser"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <MdOutlineQrCodeScanner size={20} />

                    <span className="flex-1 ml-3 text-left text-lg whitespace-nowrap">
                      Scanner user
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superadmin/dashboard/leads"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
                    aria-controls="dropdown-example"
                    onClick={toggleSidebar}
                  >
                    <MdLeaderboard size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Leads
                    </span>
                  </button>
                </li>
              </NavLink>

              <NavLink to={"/superadmin/dashboard/settings"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor "
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

              <div className=" w-[86%] flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-white mt-6 bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2"
                >
                  <span className="mr-3">
                    <TbLogout2 size={25} />
                  </span>
                  Log out
                </button>
              </div>

              {/* <NavLink to={"/superAdmin/dashboard/faq"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                  >
                    <FaQuestion size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      FAQ
                    </span>
                  </button>
                </li>
              </NavLink> */}
              {/* <NavLink to={"/superAdmin/dashboard/eventtag"}>
                <li>
                  <button
                    type="button"
                    className="px-5 flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-hoverColor dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                  >
                    <ImPriceTags size={20} />

                    <span className="flex-1 ml-3 text-lg text-left whitespace-nowrap">
                      Event Tags
                    </span>
                  </button>
                </li>
              </NavLink> */}
            </ul>
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
                  onClick={handleLogoutOnClick}
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
    </>
  );
};

export default SideBar;
