import React, { useEffect, useState } from "react";
import axios from "axios";
import { artistEndpoints } from "../../../../../services/apis";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { limit } from "../../../../common/helper/Enum";

const ArtistTable = ({
  artistsData,
  setArtistsData,
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
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!isSearching) {
  //     getAllArtistData();
  //   }
  // }, [isSearching, page]);

  useEffect(() => {
    getAllArtistData();
  }, [page]);

  const getAllArtistData = async () => {
    const payload = {
      page: page,
      limit: String(limit),
    };
    console.log(payload);
    try {
      const FetchArtistData = await axios.post(
        `${artistEndpoints.GET_ALL_PAGINATION}`,
        payload
      );

      console.log("FetchArtistData", FetchArtistData.data);
      setArtistsData(FetchArtistData.data.data.ArtistData);
      setOriginalData(FetchArtistData.data.data.ArtistData);
      setTotalPages(FetchArtistData.data.data.totalPages);
      setOriginalTotalPages(FetchArtistData.data.data.totalPages);
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

  const handlerEditArtist = (artistId) => {
    navigate(`/superAdmin/dashboard/artist/${artistId}`);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 md:mt-[2%]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone No.
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            artistsData?.map((artist) => (
              <tr
                key={artist._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`${BASE_URl}/${artist?.Images[0]?.image_path}`}
                    alt="Jese image"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {artist?.Name}
                    </div>
                    <div className="font-normal text-gray-500">
                      {artist?.Email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{artist?.Email}</td>
                <td className="px-6 py-4">{artist?.PhoneNo}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handlerEditArtist(artist._id)}
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

export default ArtistTable;
