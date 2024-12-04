import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumb from "../../common/Breadcrumb";
import { useParams } from "react-router-dom";
import axios from "axios";
import { organizerEndpoint } from "../../../../../services/apis";
import formatAmount from "../../../../common/formatAmount";
import Loading from "../../../../common/Loading";
import { limit } from "../../../../common/helper/Enum";
import { Pagination } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

const Sales = () => {
  const [totalData, setTotalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [salesData, setSalesData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const [accountsModal, setAccountsModal] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState([]);
  const [paymentToggle, setPaymentToggle] = useState(false);

  //   const reversedPayments = [...paymentModalData].reverse();
  //   console.log("reverse", reversedPayments);

  const [totalPages, setTotalPages] = useState();
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    date: "",
    remark: "",
    amount: "",
  });

  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [paymentModalData]);

  const fetchData = async () => {
    const payload = {
      organizer_id: id,
    };
    try {
      const response = await axios.post(
        `${organizerEndpoint.TOTAL_DATA}`,
        payload
      );
      setTotalData(response.data.data);
      console.log(response.data.data);
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

  useEffect(() => {
    fetchOrganizerSales();
  }, [page]);

  const fetchOrganizerSales = async () => {
    const payload = {
      organizer_id: id,
      page: String(page),
      limit: String(limit),
    };

    try {
      const response = await axios.post(
        `${organizerEndpoint.GET_ALL_SALES_PAGINATED}`,
        payload
      );
      console.log(response.data.data);
      setLoading(false);
      setSalesData(response.data.data.EventsData);
      setOriginalData(response.data.data.EventsData);
      setTotalPages(response.data.data.totalPages);
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

  useEffect(() => {
    if (accountsModal) {
      fetchPayment();
    }
  }, [accountsModal]);

  const fetchPayment = async () => {
    const payload = {
      event_id: eventId,
    };

    try {
      const response = await axios.post(
        `${organizerEndpoint.GET_ALL_ORGANIZER_PAYMENTS}`,
        payload
      );
      console.log(response.data.data);
      if (response.data.data.length === 0) {
        // setAccountsModal(false);
        setPaymentModalData([]);
      }
      setPaymentModalData(response.data.data.reverse());
      console.log("try block executed");
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
          console.log("catch block executed");
          setPaymentModalData([]);
          if (error.response.data.data.length === 0 && accountsModal) {
            console.log("catch block executed");
            setAccountsModal(false);
          }
        }
      }
    }
  };
  //   console.log(paymentModalData);
  //   console.log(accountsModal);

  const handleSubmit = async () => {
    if (
      formData.date === undefined ||
      formData.date === null ||
      formData.date === ""
    ) {
      toast.error("Please select date");
      return;
    }

    if (
      formData.amount === undefined ||
      formData.amount === null ||
      formData.amount === ""
    ) {
      toast.error("Please enter amount");
      return;
    }

    const payload = {
      event_id: eventId,
      Amount: formData.amount,
      Date: formData.date,
    };
    if (formData.remark) payload.Remark = formData.remark;

    console.log(payload);

    try {
      const response = await axios.post(
        `${organizerEndpoint.ADD_PAYMENT}`,
        payload
      );
      toast.success(response.data.message);
      await fetchPayment();
      // setAccountsModal(false);
      // setEventId(null);
      setFormData({
        date: "",
        remark: "",
        amount: "",
      });
      console.log(response.data.data);
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

  const handlePaymentDelete = async (id) => {
    const payload = {
      paymentaccount_id: id,
    };

    try {
      const response = await axios.post(
        `${organizerEndpoint.DELETE_PAYMENT}`,
        payload
      );
      toast.success(response.data.message);
      try {
        await fetchPayment();
      } catch (error) {
        setAccountsModal(false);
      }
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
          //  setPaymentModalData([]);
        }
      }
    }
  };

  return (
    <>
      <div className="mt-10 ml-[2%]">
        <Toaster />
        <Breadcrumb path={"Sales"} />
        <h1 className="text-3xl font-semibold mt-8">Sales</h1>

        <div className="flex md:flex-row flex-col gap-8 w-[100%] mt-10">
          <div className="h-32 w-full bg-gray-100 flex flex-col justify-center px-4 gap-2  ">
            <p className="capitalize text-lg ">total Events</p>
            <p className="capitalize text-xl font-semibold">
              {totalData?.totalEventCount}
            </p>
          </div>
          <div className="h-32 w-full bg-gray-100 flex flex-col justify-center px-4 gap-2  ">
            <p className="capitalize text-lg ">total sales</p>
            <p className="capitalize text-xl font-semibold">
              Rs.{" "}
              {totalData?.totalSalesSum &&
                formatAmount(totalData?.totalSalesSum)}
            </p>
          </div>
          <div className="h-32 w-full bg-gray-100 flex flex-col justify-center px-4 gap-2  ">
            <p className="capitalize text-lg ">convenience fee charged</p>
            <p className="capitalize text-xl font-semibold">
              Rs.{" "}
              {totalData?.totalConvenienceFeeAmountSum &&
                formatAmount(totalData?.totalConvenienceFeeAmountSum)}
            </p>
          </div>
          <div className="h-32 w-full bg-gray-100 flex flex-col justify-center px-4 gap-2  ">
            <p className="capitalize text-lg ">pending amount</p>
            <p className="capitalize text-xl font-semibold">
              Rs.{" "}
              {totalData?.totalPendingAmountSum &&
                formatAmount(totalData?.totalPendingAmountSum)}
            </p>
          </div>
        </div>
        <div className="max-w-md mt-10">
          <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div className="w-[100%] mx-auto border-b-2 pb-4 border-Gray85">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[4%]">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {/* <th scope="col" className="p-4"></th> */}
                <th scope="col" className="px-6 py-3">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Event Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Sales
                </th>
                <th scope="col" className="px-6 py-3">
                  Online Sales
                </th>
                <th scope="col" className="px-6 py-3">
                  Promoter Sales
                </th>
                <th scope="col" className="px-6 py-3">
                  Convenience Fee
                </th>
                <th scope="col" className="px-6 py-3">
                  Pending Amount
                </th>

                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            {loading ? (
              <div className="flex  justify-center items-center  w-full mt-6 mb-12">
                {" "}
                <Loading />
              </div>
            ) : (
              <tbody>
                {salesData?.length >= 1 ? (
                  salesData?.map((eventData, index) => (
                    <tr
                      key={eventData._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {eventData.EventName}
                      </th>
                      <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                        {eventData.EventStartDate}
                      </td>

                      <td className="pl-8 py-4">
                        {formatAmount(eventData.totalSales)}
                      </td>

                      <td className=" pl-8 py-4">
                        {formatAmount(eventData.totalOnlineSales)}
                      </td>
                      <td className="px-10 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {formatAmount(eventData.totalPromoterSales)}
                      </td>
                      <td className=" px-10 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                        {formatAmount(eventData.totalConvenienceFeeAmount)}
                      </td>

                      <td className="pl-8 py-4">
                        {formatAmount(eventData.PendingAmount)}
                      </td>

                      <td className="pr-6 pl-6 py-4">
                        <span
                          className="underline cursor-pointer  "
                          onClick={() => {
                            setAccountsModal(true);
                            setEventId(eventData.event_id);
                          }}
                        >
                          Accounts
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16} className="text-center py-4">
                      <p className="font-bold">No Bookings Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          {accountsModal && (
            <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex  z-50 ">
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                aria-hidden="true"
              ></div>

              <div
                id="static-modal"
                data-modal-backdrop="static"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed  z-50 flex justify-center  w-full mt-20"
              >
                <div className="relative w-full max-w-4xl max-h-full top-0 ">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 text-center p-6  max-h-[80vh] overflow-y-auto  ">
                    <div className=" rounded-t w-full  ">
                      <div className="flex  justify-between">
                        <h3 className="text-3xl text-left font-bold text-gray-900 dark:text-white w-full">
                          Note
                        </h3>
                        <span
                          className="cursor-pointer "
                          onClick={() => {
                            setEventId(null);
                            setAccountsModal(false);
                            setFormData({
                              date: "",
                              remark: "",
                              amount: "",
                            });
                          }}
                        >
                          <IoClose size={20} />
                        </span>
                      </div>
                      <div className="flex md:flex-row flex-col gap-4 justify-between mt-8  w-full">
                        <div className="flex flex-col w-full gap-2 items-start justify-start">
                          <label
                            htmlFor="date"
                            className="mb-1.5 font-semibold"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={handleChangeFormData}
                            id="date"
                            name="date"
                            className="bg-gray-100 border w-full border-black py-2 px-2 h-14"
                          />
                        </div>

                        <div className="flex flex-col gap-2  w-full items-start justify-start">
                          <label
                            htmlFor="text"
                            className="mb-1.5 font-semibold"
                          >
                            Remark
                          </label>
                          <input
                            type="remark"
                            id="remark"
                            name="remark"
                            value={formData.remark}
                            onChange={handleChangeFormData}
                            placeholder="Remark"
                            className="bg-gray-100 border border-black py-2 px-2 w-full h-14"
                          />
                        </div>

                        <div className="flex flex-col w-full gap-2 items-start justify-start">
                          <label
                            htmlFor="date"
                            className="mb-1.5 font-semibold"
                          >
                            Received Amount
                          </label>
                          <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChangeFormData}
                            placeholder="Received Amount"
                            className="bg-gray-100 border w-full border-black py-2 px-2 h-14"
                          />
                        </div>

                        <div className="flex items-end ">
                          <button
                            className="bg-Gray40 text-white h-14 px-12 text-lg"
                            onClick={handleSubmit}
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      <div className="mt-20">
                        {/* {reversedPayments.map((payment) => ( */}
                        {paymentModalData.map((payment) => (
                          <div className="border-b border-gray-200 py-5">
                            <div className="flex gap-4 justify-between   w-full">
                              <div className="flex  flex-col w-full gap-2 items-start justify-start">
                                {/* <label
                                  htmlFor="date"
                                  className="mb-1.5 font-semibold"
                                >
                                  Date
                                </label> */}
                                <input
                                  type="date"
                                  //  id="date"
                                  //  name="date"
                                  value={payment?.Date}
                                  //  value={formatDate(payment?.Date)}
                                  className="bg-gray-100 border w-full border-black py-2 px-2 h-14"
                                />
                              </div>

                              <div className="flex flex-col gap-2  w-full items-start justify-start">
                                {/* <label
                                  htmlFor="text"
                                  className="mb-1.5 font-semibold"
                                >
                                  Remark
                                </label> */}
                                <input
                                  type="remark"
                                  //  id="remark"
                                  //  name="remark"
                                  placeholder="Remark"
                                  value={payment?.Remark}
                                  className="bg-gray-100 border border-black py-2 px-2 w-full h-14"
                                />
                              </div>

                              <div className="flex flex-col w-full gap-2 items-start justify-start">
                                {/* <label
                                  htmlFor="date"
                                  className="mb-1.5 font-semibold"
                                >
                                  Received Amount
                                </label> */}
                                <input
                                  type="text"
                                  //  id="amount"
                                  //  name="amount"
                                  //  placeholder="Received Amount"
                                  value={`Rs.${payment.AmountRecived}`}
                                  className="bg-gray-100 text-black border w-full border-black py-2 px-2 h-14"
                                />
                              </div>

                              <div className="flex items-start justify-center ">
                                <button
                                  className="  h-14 px-12 text-lg"
                                  onClick={() =>
                                    handlePaymentDelete(payment._id)
                                  }
                                >
                                  <AiOutlineDelete size={28} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center mt-6">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePaginationChange}
          shape="rounded"
          size="large"
        />
      </div>
    </>
  );
};

export default Sales;
