import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import CreatePromoter from "./CreatePromoter";
import PromoterTable from "./PromoterTable";
import { promoterEndpoint } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Pagination } from "@mui/material";
import { limit } from "../../../../common/helper/Enum";

const Promoter = () => {
  const [promoterCrationModal, setPromoterCrationModal] = useState(false);
  const [promoterData, setPromoterData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Api For Promoter
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);

  const [totalPages, setTotalPages] = useState();
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [page, setPage] = useState(1);

  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (page !== 1) {
      setPage(1); // Reset to page 1 when search term changes
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (debouncedSearchTerm.length < 2) {
  //         toast.error("Search keyword must be at least 2 characters long.");
  //         return;
  //       }

  //       const payload = {
  //         page: String(page),
  //         limit: String(limit),
  //         search_keyword: debouncedSearchTerm,
  //       };

  //       let response = await axios.post(
  //         `${`${promoterEndpoint.SEARCH_PAGINATION}`}`,
  //         payload
  //       );

  //       console.log(response.data);
  //       setPromoterData(response.data.data.PromoterData);
  //       setTotalPages(response.data.data.totalPages);

  //       if (page > response.data.data.totalPages) {
  //         setPage(1); // Reset to the first page if the current page is out of bounds
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         const { status, data } = error.response;

  //         if (
  //           status === 404 ||
  //           status === 403 ||
  //           status === 500 ||
  //           status === 302 ||
  //           status === 409 ||
  //           status === 401 ||
  //           status === 400
  //         ) {
  //           console.log(error.response);
  //           toast.error(data.message);
  //         }
  //       }
  //     }
  //   };
  //   if (debouncedSearchTerm !== "") {
  //     if (page > 1) {
  //       // If search term changes and page is greater than 1, reset the page first
  //       setPage(1);
  //     } else {
  //       fetchData();
  //     }
  //   } else {
  //     setPromoterData(originalData);
  //     setTotalPages(originalTotalPages);
  //   }
  // }, [debouncedSearchTerm, page, limit, originalData]);

  // console.log({errors})
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedSearchTerm.length < 3) {
          toast.error("Search keyword must be at least 3 characters long.");
          return;
        }

        const payload = {
          page: String(page),
          limit: String(limit),
          search_keyword: debouncedSearchTerm,
        };
        console.log(payload);

        let response = await axios.post(
          `${promoterEndpoint.SEARCH_PAGINATION}`,
          payload
        );

        console.log(response.data);
        setPromoterData(response.data.data.PromoterData);
        setTotalPages(response.data.data.totalPages);

        // Ensure the current page is within the total pages
        if (page > response.data.data.totalPages) {
          setPage(1); // Reset to the first page if the current page is out of bounds
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
          }
        }
      }
    };

    if (debouncedSearchTerm !== "") {
      fetchData();
    } else {
      // No search term, reset to original data
      setPromoterData(originalData);
      setTotalPages(originalTotalPages);
    }
  }, [debouncedSearchTerm, page, limit, originalData]);

  return (
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Promoter"} />
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setPromoterCrationModal(!promoterCrationModal)}
          className={`w-[25%] py-2 ${
            promoterCrationModal
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center md:text-xl`}
        >
          {/* <span className="mr-2">
            {promoterCrationModal ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span>{" "} */}
          {promoterCrationModal ? "Back " : "Add Promoter"}
        </button>
      </div>
      <h1 className="md:text-3xl font-semibold text-2xl -mt-6">Promoter</h1>

      {!promoterCrationModal && (
        <div className="max-w-md mt-4 md:mt-[2%]">
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
              placeholder="Search promoter username"
            />
          </div>
        </div>
      )}

      <div>
        {promoterCrationModal ? (
          <CreatePromoter setPromoterCrationModal={setPromoterCrationModal} />
        ) : (
          <PromoterTable
            promoterData={promoterData}
            setPromoterData={setPromoterData}
            setOriginalData={setOriginalData}
            page={page}
            setTotalPages={setTotalPages}
            setOriginalTotalPages={setOriginalTotalPages}
          />
        )}
        {!promoterCrationModal && (
          <div className="flex justify-end items-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePaginationChange}
              shape="rounded"
              size="large"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Promoter;
