import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { genreEndPoint } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { limit } from "../../../../common/helper/Enum";

const GenreTable = ({
  genreData,
  setgenreData,
  setOriginalData,
  page,
  setPage,
  totalPages,
  setTotalPages,
  handlePaginationChange,
  setOriginalTotalPages,
  isSearching,
}) => {
  const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isSearching) {
  //     getAllGenreData();
  //   }
  // }, [isSearching, page]);

  useEffect(() => {
    getAllGenreData();
  }, [page]);

  const getAllGenreData = async () => {
    const payload = {
      page: page,
      limit: String(limit),
    };
    try {
      const FetchGenreData = await axios.post(
        `${genreEndPoint.GET_ALL_PAGINATION}`,
        payload
      );

      console.log("FetchGenreData", FetchGenreData.data.GenreData);
      setgenreData(FetchGenreData.data.data.GenreData);
      setOriginalData(FetchGenreData.data.data.GenreData);
      setTotalPages(FetchGenreData.data.data.totalPages);
      setOriginalTotalPages(FetchGenreData.data.data.totalPages);
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

  const handlerEditArtist = (genreID) => {
    navigate(`/superAdmin/dashboard/genre/${genreID}`);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8 md:mt-[2%]">
      <Toaster />
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {genreData?.map((genre) => (
            <tr
              key={genre._id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={`${BASE_URl}/${genre.Images[0].image_path}`}
                  alt="Jese image"
                />
                <div className="ps-3">
                  <div className="text-base font-semibold">{genre.Name}</div>
                </div>
              </th>
              <td className="px-6 py-4">
                <button
                  onClick={() => handlerEditArtist(genre._id)}
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
  );
};

export default GenreTable;
