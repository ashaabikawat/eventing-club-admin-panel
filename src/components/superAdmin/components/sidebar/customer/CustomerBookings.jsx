import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Breadcrumb from "../../common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { booking, websiteCustomer } from "../../../../../services/apis";
import { Pagination } from "@mui/material";
import { limit } from "../../../../common/helper/Enum";

const CustomerBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [page, setPage] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    const payload = {
      customer_id: id,
      page: String(page),
      limit: String(limit),
    };
    const response = await axios.post(
      `${websiteCustomer.CUSTOMER_BOOKINGS}`,
      payload
    );
    console.log(response.data);
    setBookings(response.data.data.BookingsData);
    setOriginalData(response.data.data.BookingsData);
    setTotalPages(response.data.data.totalPages);
  };

  return (
    <>
      <div className="mt-[3%] ml-[2%]">
        <Toaster />
        <Breadcrumb path={"Booking"} />
      </div>
      <div className="ml-[2%] flex justify-between mt-10">
        <h1 className="md:text-3xl text-xl font-semibold">
          Customer booking details
        </h1>
        <button
          className="border-2 text-Gray85 border-Gray85 py-2 px-6 text-xl"
          onClick={() => navigate("/superAdmin/dashboard/customer")}
        >
          Back
        </button>
      </div>
      <div className="max-w-md mt-8 md:mt-[2%] ml-[2%]">
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
            placeholder="Search By Booking id"
          />
        </div>

        {/* table */}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8 md:mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                Booking Id
              </th>
              <th scope="col" className="px-6 py-3">
                Event name
              </th>
              <th scope="col" className="px-6 py-3">
                Ticket name
              </th>
              <th scope="col" className="px-6 py-3">
                Quanity
              </th>
              <th scope="col" className="px-6 py-3">
                Ticket date
              </th>
              <th scope="col" className="px-6 py-3">
                venue
              </th>
              <th scope="col" className="px-6 py-3">
                Ticket price
              </th>
              <th scope="col" className="px-6 py-3">
                Total price
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking, index) => (
              <tr key={booking._id}>
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
                  {booking.Booking_id}
                </th>

                <td className="px-6 py-4">{booking.EventName}</td>
                <td className="px-6 py-4">{booking.TicketName}</td>
                <td className="px-6 py-4">{booking.TicketQuantity}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                  {new Date(booking.EventDate).toLocaleDateString("en-In", {
                    day: "numeric",
                    month: "short", // Use "short" to get the abbreviated month name like "Feb"
                    year: "numeric",
                    timeZone: "UTC", // Ensure the date is in UTC
                  })}
                </td>
                <td className="px-6 py-4">{booking.EventVenue}</td>
                <td className="px-6 py-4">{booking.TicketPrice}</td>
                <td className="px-6 py-4">{booking.TotalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default CustomerBookings;
