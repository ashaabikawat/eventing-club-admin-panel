import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate2 } from "../../../../common/formatDate2";

const FaqTable = ({ faqData }) => {
  const navigate = useNavigate();

  const handlerEditFaq = (faqId) => {
    navigate(`/superAdmin/dashboard/faq/${faqId}`);
  };


  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[2%]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4"></th>
              <th scope="col" className="px-6 py-3">
                Tag Name
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Question
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {faqData.map((faq, index) => (
              <tr
                key={faq._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
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
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {faq.Tag}
                </th>
                <td className="px-6 py-4">{formatDate2(faq.createdAt)}</td>
                <td className="px-6 py-4">{faq.Question}</td>
                <td className="px-6 py-4">
                  <p
                    onClick={() => handlerEditFaq(faq._id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  >
                    Edit
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FaqTable;
