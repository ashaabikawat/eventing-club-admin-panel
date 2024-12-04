import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { venueEndPoint } from "../../../../../services/apis";

import toast from "react-hot-toast";
import axios from "axios";
import { limit } from "../../../../common/helper/Enum";

const VenueTable = ({
  venueData,
  setVenueData,
  setOriginalData,
  page,
  setPage,
  totalPages,
  setTotalPages,
  handlePaginationChange,
  setOriginalTotalPages,
}) => {
  const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const handlerEditVenue = (venueID) => {
    navigate(`/superAdmin/dashboard/venue/${venueID}`);
  };

  useEffect(() => {
    getAllVenueData();
  }, [page]);

  const getAllVenueData = async () => {
    const payload = {
      page: page,
      limit: String(limit),
    };
    try {
      const FetchVenueData = await axios.post(
        `${venueEndPoint.GET_ALL_PAGINATED}`,
        payload
      );

      console.log("FetchVenueData", FetchVenueData.data);
      setVenueData(FetchVenueData.data.data.VenueData);
      setOriginalData(FetchVenueData.data.data.VenueData);
      setTotalPages(FetchVenueData.data.data.totalPages);
      setOriginalTotalPages(FetchVenueData.data.data.totalPages);
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

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8 md:mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Venue Name
              </th>
              <th scope="col" className="px-6 py-3">
                Venue State
              </th>
              <th scope="col" className="px-6 py-3">
                Venue City
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {venueData?.map((venue) => (
              <tr
                key={venue._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`${BASE_URl}/${venue?.Images[0]?.image_path}`}
                    alt="Jese image"
                  />
                  <div className="ps-3">
                    <div className="md:text-base font-semibold">
                      {venue.Name}
                    </div>
                  </div>
                </th>
                <th>
                  <div className="md:text-base font-semibold md:pl-4 pl-8">
                    {venue?.State}
                  </div>
                </th>
                <th>
                  <div className="md:text-base font-semibold pl-5">
                    {venue?.City}
                  </div>
                </th>
                <th>
                  <div className="md:text-base font-semibold pl-6">
                    {venue?.createdAt && <>{venue?.createdAt.split(" ")[0]}</>}
                  </div>
                </th>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handlerEditVenue(venue?._id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenueTable;
