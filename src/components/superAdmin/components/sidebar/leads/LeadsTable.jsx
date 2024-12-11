import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { leadsData } from "../../../../../services/apis";
import toast from "react-hot-toast";
import { limit } from "../../../../common/helper/Enum";
import { Pagination } from "@mui/material";
const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [originalData, setOriginalData] = useState(null);
  const [totalPages, setTotalPages] = useState();
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [page, setPage] = useState(1);

  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getAllLeads();
  }, [page]);

  const getAllLeads = async () => {
    const payload = {
      page: String(page),
      // limit: String(limit),
      limit: "2",
    };
    try {
      const response = await axios.post(
        `${leadsData.GET_ALL_PAGINATED}`,
        payload
      );
      toast.success(response.data.message);
      setLeads(response.data.data.WebsideLeadsData);
      setTotalPages(response.data.data.totalPages);
      console.log(response.data);
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
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Breadcrumb path={"Leads"} />
      <div className="max-w-md mt-6 md:mt-[2%]">
        <h1 className="md:text-4xl text-2xl mt-8 mb-6 font-bold text-black">
          Leads
        </h1>
        {/* <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
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
            // value={searchTerm}
            // onChange={handleChange}
            placeholder="Search By name "
          />
        </div> */}
      </div>

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
                Club name
              </th>
              <th scope="col" className="px-6 py-3">
                Position
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
            </tr>
          </thead>
          <tbody>
            {leads?.length >= 1 ? (
              leads?.map((lead, index) => (
                <tr
                  key={lead._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {lead.FullName}
                  </th>

                  <td className="px-6 py-4">{lead.Email}</td>
                  <td className="px-6 py-4">{lead.PhoneNumber}</td>
                  <td className="px-6 py-4">{lead.CompanyName}</td>
                  <td className="px-6 py-4">{lead.Position}</td>
                  <td className="px-6 py-4">{lead.City}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={16} className="text-center py-4">
                  <p className="font-bold">No Leads Found</p>
                </td>
              </tr>
            )}
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
    </div>
  );
};

export default LeadsTable;
