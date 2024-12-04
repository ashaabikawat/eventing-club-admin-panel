import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  promoterEndpoint,
  promoterEndPointPannel,
} from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { GrMoreVertical } from "react-icons/gr";
import { limit, TicketStatus } from "../../../../common/helper/Enum";
import { useSelector } from "react-redux";
const PromoterTable = ({
  promoterData,
  setPromoterData,
  setOriginalData,
  page,
  setTotalPages,
  setOriginalTotalPages,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [promoterOpenModal, setPromoterOpenModal] = useState(false);
  const [selectedPromoterId, setSelectedPromoterId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [statusToggle, setstatusToggle] = useState(false);
  const [passwordResetModal, setPasswordResetModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const adminuser = useSelector((store) => store.auth);

  const navigate = useNavigate();

  const handleAction = (ticketId, action) => {
    setSelectedPromoterId(ticketId);
    setSelectedAction(action);
    setPromoterOpenModal(true);
    console.log(action);
  };

  const handleConfirmAction = async () => {
    try {
      const payload = {
        promoter_id: selectedPromoterId,
      };

      console.log(payload);
      let response;

      if (selectedAction === "disable") {
        response = await axios.post(
          `${promoterEndpoint.DISABLE_PROMOTRE}`,
          payload
        );
        console.log("disable");
      } else if (selectedAction === "enable") {
        response = await axios.post(
          `${promoterEndpoint.ENABLE_PROMOTER}`,
          payload
        );
        console.log("enable");
      }

      console.log(response.data);
      setstatusToggle((prev) => !prev);
      toast.success(response.data.message);
      setPromoterOpenModal(false);
      setIsModalOpen(false);
      setOpenDropdownId(null);

      // // Update the eventTicketsData state
      // setEventTicketsData((prevData) =>
      //   prevData.map((ticket) =>
      //     ticket._id === selectedTicketId
      //       ? {
      //           ...ticket,
      //           EventTicketStatus: selectedAction === "disable" ? 2 : 1,
      //         }
      //       : ticket
      //   )
      // );
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
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setPromoterOpenModal(false);
    setSelectedPromoterId(null);
    setSelectedAction(null);
    setOpenDropdownId(null);
  };

  useEffect(() => {
    getAllPromoterData();
  }, [statusToggle, page]);

  const getAllPromoterData = async () => {
    const payload = {
      page: String(page),
      limit: String(limit),
    };
    try {
      const FetchPromoterData = await axios.post(
        `${promoterEndpoint.GET_PROMOTER_PAGINATED}`,
        payload
      );

      console.log("FetchPromoterData", FetchPromoterData.data);
      setPromoterData(FetchPromoterData.data.data.PromoterData);
      setOriginalData(FetchPromoterData.data.data.PromoterData);
      setTotalPages(FetchPromoterData.data.data.totalPages);
      setOriginalTotalPages(FetchPromoterData.data.data.totalPages);
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
          console.log(error.response);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  const handleResetPassword = (id) => {
    setPasswordResetModal(true);
    setSelectedPromoterId(id);
  };

  const handleReset = async () => {
    if (password !== confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    if (confirmPass.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    const payload = {
      promoter_id: selectedPromoterId,
      new_password: confirmPass,
      CreatedBy: adminuser.adminSignupData.AdminRole,
      createduser_id: adminuser.adminSignupData.user_id,
    };
    console.log(payload);

    try {
      const response = await axios.post(
        `${promoterEndpoint.RESET_PASSWORD}`,
        payload
      );
      toast.success(response.data.message);
      setPasswordResetModal(false);
      setPassword("");
      setConfirmPass("");
      setSelectedPromoterId(null);
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
  };

  const handlerEditOrganizer = (promoterId) => {
    navigate(`/superAdmin/dashboard/promoter/${promoterId}`);
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  return (
    <>
      <Toaster />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8 md:mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Region
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone no.
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {promoterData.map((promoter, index) => {
              const isLastTwoRows =
                promoterData.length > 2 && index >= promoterData.length - 2;
              return (
                <tr
                  key={promoter._id}
                  className={` ${
                    promoter.status === TicketStatus.Enable
                      ? "hover:bg-gray-50 dark:hover:bg-gray-600 bg-white"
                      : "bg-red-200"
                  }  border-b dark:bg-gray-800 dark:border-gray-700 `}
                >
                  {/* <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${index + 1}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-${index + 1}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td> */}
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {promoter.Username}
                  </th>

                  <td className="px-6 py-4"> {promoter.FullName}</td>
                  <td className="px-6 py-4">{promoter.City}</td>
                  <td className="px-6 py-4">{promoter.Email}</td>
                  <td className="px-6 py-4">{promoter.Phone1}</td>
                  <td className="px-6 py-4">
                    {promoter.status === 1 ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 relative">
                    <p
                      onClick={() => toggleDropdown(promoter._id)}
                      className="font-medium text-blue-600  dark:text-blue-500 hover:underline cursor-pointer"
                    >
                      <GrMoreVertical size={25} />
                    </p>
                    {openDropdownId == promoter._id && (
                      <div
                        className={`absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ${
                          isLastTwoRows ? "bottom-full mb-2" : "top-full mt-2"
                        }`}
                        style={{
                          right: isLastTwoRows ? "78%" : "78%",
                          top: isLastTwoRows ? "auto" : "10%", // 'auto' for last two rows to align above
                          bottom: isLastTwoRows ? "10%" : "auto", // set bottom when one of the last two rows
                        }}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handlerEditOrganizer(promoter._id)}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            View & edit
                          </button>
                          {promoter.status === TicketStatus.Enable ? (
                            <button
                              onClick={() =>
                                handleAction(promoter._id, "disable")
                              }
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                            >
                              Inactive
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleAction(promoter._id, "enable")
                              }
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                            >
                              Active
                            </button>
                          )}
                          <button
                            onClick={() => handleResetPassword(promoter._id)}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            Reset password
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {promoterOpenModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">
                {selectedAction === "disable"
                  ? "Inactive Promoter"
                  : "Active Promoter"}
              </h2>
              <p>
                Are you sure you want to{" "}
                {selectedAction === "disable" ? "Inactive" : "Active"} this
                Promoter?
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 bg-red-600 text-white rounded mr-2"
                >
                  Yes
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {passwordResetModal && (
          <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-aut">
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              aria-hidden="true"
            ></div>

            <div
              id="static-modal"
              data-modal-backdrop="static"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed  inset-0 z-50 flex justify-center items-center w-full h-full"
            >
              <div className="relative w-full max-w-2xl max-h-full md:p-0 p-6">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 md:text-center p-6   ">
                  <div className=" rounded-t ">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white w-full">
                      Reset password
                    </h3>
                    <div className="mt-8 flex flex-col justify-between md:items-center gap-6">
                      <div className="flex md:flex-row flex-col md:items-center justify-center gap-4">
                        <label htmlFor="" className="text-xl">
                          New password:
                        </label>
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gray-50 mt-2  md:ml-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-72 p-2.5   "
                        />
                      </div>
                      <div className="flex md:flex-row flex-col md:items-center justify-center gap-4">
                        <label htmlFor="" className="text-xl">
                          Confirm password:
                        </label>
                        <input
                          type="text"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          className="bg-gray-50 mt-2 md:ml-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-72 p-2.5   "
                        />
                      </div>
                    </div>
                    <div className="flex items-center md:justify-end mt-8 gap-8">
                      <button
                        className="bg-white border border-gray-200  py-2 px-4 "
                        onClick={() => {
                          setPasswordResetModal(false);
                          setPassword("");
                          setConfirmPass("");
                          setSelectedPromoterId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-Gray40 text-white py-2 px-4 "
                        onClick={handleReset}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PromoterTable;
