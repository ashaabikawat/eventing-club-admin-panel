import React, { useEffect, useState } from "react";
import { websiteCustomer } from "../../../../../services/apis";
import axios from "axios";
import { limit } from "../../../../common/helper/Enum";
import { useNavigate } from "react-router-dom";

const CustomerTable = ({
  allCustomersData,
  setOriginalData,
  setAllCustomersData,
  page,
  setTotalPages,
  setOriginalTotalPages,
}) => {
  useEffect(() => {
    getAllCustomersData();
  }, [page]);

  const navigate = useNavigate();

  const getAllCustomersData = async () => {
    const payload = {
      page: String(page),
      limit: String(limit),
    };
    try {
      const FetchOrganizerData = await axios.post(
        `${websiteCustomer.GET_CUSTOMERS_PAGINATED}`,
        payload
      );

      console.log("FetchOrganizerData", FetchOrganizerData.data);
      setAllCustomersData(FetchOrganizerData.data.data.customerData);
      setTotalPages(FetchOrganizerData.data.data.totalPages);
      setOriginalTotalPages(FetchOrganizerData.data.data.totalPages);
      setOriginalData(FetchOrganizerData.data.data.customerData);
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

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 md:mt-[2%]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>

            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone no.
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allCustomersData?.map((customer, index) => (
            <tr
              key={customer._id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {customer.CustomerName}
              </th>

              <td className="px-6 py-4">{customer.Email}</td>
              <td className="px-6 py-4">{customer.MobileNumber}</td>
              <td
                className="px-6 py-4 underline cursor-pointer"
                onClick={() =>
                  navigate(
                    `/superAdmin/dashboard/customer/bookings/${customer._id} `
                  )
                }
              >
                Bookings
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
