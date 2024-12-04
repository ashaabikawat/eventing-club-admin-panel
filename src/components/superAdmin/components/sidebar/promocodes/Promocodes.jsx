import { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import toast, { Toaster } from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import CreatePromocodes from "./CreatePromocodes";
import PromocodesTable from "./PromocodesTable";
import axios from "axios";
import { promocode } from "../../../../../services/apis";
import { useSelector } from "react-redux";
import { Pagination } from "@mui/material";
import { limit } from "../../../../common/helper/Enum";

const Promocodes = () => {
  const adminuser = useSelector((store) => store.auth);
  const [promoCodeCreationModal, setPromoCodeCreationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [promocodes, setPromocodes] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);
  const [originalTotalPages, setOriginalTotalPages] = useState();

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

  useEffect(() => {
    fetchPromocode();
  }, [page, !promoCodeCreationModal]);

  const fetchPromocode = async () => {
    const payload = {
      page: page,
      limit: String(limit),
    };
    // console.log(payload);
    try {
      const response = await axios.post(
        `${promocode.GET_ALL_PAGINATION}`,
        payload
      );
      console.log(response.data.data);
      setPromocodes(response.data.data.PromocodeData);
      setOriginalData(response.data.data.PromocodeData);
      setTotalPages(response.data.data.totalPages);
      setOriginalTotalPages(response.data.data.totalPages);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedSearchTerm.length < 5) {
          toast.error("Search keyword must be at least 5 characters long.");
          return;
        }

        const payload = {
          search_keyword: debouncedSearchTerm,
          page: page,
          limit: String(limit),
        };

        let response = await axios.post(
          `${`${promocode.SEARCH_PAGINATION}`}`,
          payload
        );

        // console.log(response.data);
        setPromocodes(response.data.data.PromocodeData);
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
      setPromocodes(originalData);
      setTotalPages(originalTotalPages);
    }
  }, [debouncedSearchTerm, page, limit, originalData]);

  return (
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Promocode"} />
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setPromoCodeCreationModal(!promoCodeCreationModal)}
          className={`w-[25%] py-2 ${
            promoCodeCreationModal
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center px-2 items-center md:text-xl`}
        >
          {/* <span className="mr-2">
            {promoCodeCreationModal ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span>{" "} */}
          {promoCodeCreationModal ? "Back " : "Add Promocodes"}
        </button>
      </div>
      <h1 className="md:text-3xl text-2xl font-semibold -mt-6">Promocodes</h1>

      {!promoCodeCreationModal && (
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
              placeholder="Search promocodes"
            />
          </div>
        </div>
      )}

      <div>
        {promoCodeCreationModal ? (
          <CreatePromocodes
            setPromoCodeCreationModal={setPromoCodeCreationModal}
          />
        ) : (
          <PromocodesTable promocodes={promocodes} />
        )}
        {!promoCodeCreationModal && (
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

export default Promocodes;
