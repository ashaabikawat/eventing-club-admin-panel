import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import CreateFaq from "./CreateFaq";
import FaqTable from "./FaqTable";
import { FaqEndPoint } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const FAQ = () => {
  const [fAQCrationModal, setFAQCrationModal] = useState(false);
  const [faqData, setFaqData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    getAllFaqData();
  }, []);

  const getAllFaqData = async () => {
    try {
      const FetchFaqData = await axios.get(`${FaqEndPoint.ALL_FAQ_DATA_LIST}`);

      console.log("FetchFaqData", FetchFaqData.data);
      setFaqData(FetchFaqData.data.data);
      setOriginalData(FetchFaqData.data.data)
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

    // On Search Handler
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
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
        };

        let response = await axios.post(
          `${`${FaqEndPoint.FAQ_SEARCH_BY_TAG_NAME}`}`,
          payload
        );

        console.log(response.data);
        setFaqData(response.data.data);
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
      setFaqData(originalData);
    }
  }, [debouncedSearchTerm, originalData]);

  return (
    <div>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"FAQ"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => setFAQCrationModal(!fAQCrationModal)}
            className={`w-[15%] py-2 ${
              fAQCrationModal
                ? "border-2 text-Gray85 border-Gray85"
                : "bg-Gray40 text-white"
            } flex justify-center items-center text-xl`}
          >
            <span className="mr-2">
              {fAQCrationModal ? (
                <FaChevronLeft size={23} />
              ) : (
                <IoMdAdd size={23} />
              )}
            </span>{" "}
            {fAQCrationModal ? "Back " : "Create FAQ"}
          </button>
        </div>
        <h1 className="text-3xl font-semibold -mt-2">FAQ</h1>

        {!fAQCrationModal && (
          <div className="max-w-md mt-[2%]">
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
                placeholder="Search By Tag Name"
              />
            </div>
          </div>
        )}

        {
          !loading && (
            <div>{fAQCrationModal ? <CreateFaq /> : <FaqTable faqData={faqData}/>}</div>
          )
        }
        
      </div>
    </div>
  );
};

export default FAQ;
