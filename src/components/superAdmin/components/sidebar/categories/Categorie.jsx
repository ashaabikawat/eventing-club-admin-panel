import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import CreateCategories from "./CreateCategories";
import CategorieTable from "./CategorieTable";
import { categorieEndPoint } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Pagination } from "@mui/material";
import { limit } from "../../../../common/helper/Enum";

const Categorie = () => {
  const [CategorieCrationModal, setcategorieCrationModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // NEW: Track search state
  const [categorieData, setcategorieData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);
  const [originalTotalPages, setOriginalTotalPages] = useState();

  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  // Fetch initial data for Category
  // useEffect(() => {
  //   getAllCategoryData();
  // }, []);

  // // Fetch initial data for Category
  // const getAllCategoryData = async () => {
  //   try {
  //     const FetchCategorieData = await axios.get(
  //       `${categorieEndPoint.CATEGORIES_DATA_URL}`
  //     );

  //     console.log("FetchCategorieData", FetchCategorieData.data);
  //     setcategorieData(FetchCategorieData.data.data);
  //     setOriginalData(FetchCategorieData.data.data);
  //     setLoading(false)
  //   } catch (error) {
  //     if (error.response) {
  //       const { status, data } = error.response;

  //       if (
  //         status === 404 ||
  //         status === 403 ||
  //         status === 500 ||
  //         status === 302 ||
  //         status === 409 ||
  //         status === 401 ||
  //         status === 400
  //       ) {
  //         console.log(error.response);
  //         toast.error(data.message);
  //         setLoading(false)
  //       }
  //     }
  //   }
  // };

  // On Search Handler
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedSearchTerm.length < 2) {
          toast.error("Search keyword must be at least 2 characters long.");
          return;
        }

        const payload = {
          search_keyword: debouncedSearchTerm,
          page: page,
          limit: String(limit),
        };

        let response = await axios.post(
          `${`${categorieEndPoint.SEARCH_CATEGORY_PAGINATION}`}`,
          payload
        );

        // console.log(response.data);
        setcategorieData(response.data.data.CategoryData);
        setTotalPages(response.data.data.totalPages);
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
            // console.log(error.response);
            toast.error(data.message);
          }
        }
      }
    };

    if (debouncedSearchTerm !== "") {
      fetchData();
    } else {
      // No search term, reset to original data
      setcategorieData(originalData);
      setTotalPages(originalTotalPages);
    }
  }, [debouncedSearchTerm, page, limit, originalData]);

  return (
    <div className="mt-[3%] ml-[2%]">
      <Toaster />
      <Breadcrumb path={"Category"} />
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setcategorieCrationModal(!CategorieCrationModal)}
          className={`w-[25%] py-2 ${
            CategorieCrationModal
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center md:text-xl text-base`}
        >
          {/* <span className="mr-2">
            {CategorieCrationModal ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span> */}
          {CategorieCrationModal ? "Back " : "Add Category"}
        </button>
      </div>
      <h1 className="md:text-3xl text-xl font-semibold -mt-6">Category</h1>

      {!CategorieCrationModal && (
        <div className="max-w-md md:mt-[2%] mt-6">
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
              placeholder="Search By Category Name"
            />
          </div>
        </div>
      )}

      <div>
        {CategorieCrationModal ? (
          <CreateCategories
            setcategorieCrationModal={setcategorieCrationModal}
          />
        ) : (
          <CategorieTable
            isSearching={isSearching}
            categorieData={categorieData}
            setcategorieData={setcategorieData}
            setOriginalData={setOriginalData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            setTotalPages={setTotalPages}
            setOriginalTotalPages={setOriginalTotalPages}
            handlePaginationChange={handlePaginationChange}
          />
        )}
        {!CategorieCrationModal && (
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

export default Categorie;
