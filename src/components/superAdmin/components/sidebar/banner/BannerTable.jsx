import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../common/Loading";

const BannerTable = ({ banners, loading }) => {
  console.log(banners);
  const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/superAdmin/dashboard/banner/${id}`);
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4 md:mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Desktop banner
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile banner
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
              {banners?.map((banner) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">
                    <img
                      className="w-44 h-20 object-cover "
                      src={`${BASE_URl}/${banner.DesktopbannerImage}`}
                      alt="Jese image"
                    />
                  </td>
                  <td>
                    <img
                      className="w-44 h-20 object-cover"
                      src={`${BASE_URl}/${banner.MobilebannerImage}`}
                      alt="Jese image"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(banner._id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default BannerTable;
