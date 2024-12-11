import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import {
  categorieEndPoint,
  websiteCustomer,
} from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import CreateCustomer from "./CreateCustomer";
import CustomerTable from "./CustomerTable";
import { Pagination } from "@mui/material";
import { limit } from "../../../../common/helper/Enum";

const Customer = () => {
  // const [customerCrationModal, setCustomerCrationModal] = useState(false);
  const [categorieData, setcategorieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [allCustomersData, setAllCustomersData] = useState([]);

  const [totalPages, setTotalPages] = useState();
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [page, setPage] = useState(1);
  // useEffect(() => {
  //   getAllCategoryData();
  // }, []);

  // Fetch initial data for Customer

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

  // const handleChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 700);

  //   return () => clearTimeout(delay);
  // }, [searchTerm]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (debouncedSearchTerm.length < 2) {
  //         toast.error("Search keyword must be at least 2 characters long.");
  //         return;
  //       }

  //       const payload = {
  //         search_keyword: debouncedSearchTerm,
  //       };

  //       let response = await axios.post(
  //         `${`${categorieEndPoint.CATEGORIE_SEARCH_BY_NAME}`}`,
  //         payload
  //       );

  //       console.log(response.data);
  //       setcategorieData(response.data.data);
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
  //     fetchData();
  //   } else {
  //     setcategorieData(originalData);
  //   }
  // }, [debouncedSearchTerm, originalData]);
  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

  // const handleChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (debouncedSearchTerm.length < 3) {
  //         toast.error("Search keyword must be at least 3 characters long.");
  //         return;
  //       }

  //       const payload = {
  //         page: String(page),
  //         limit: String(limit),
  //         search_keyword: debouncedSearchTerm,
  //       };
  //       console.log(payload);

  //       let response = await axios.post(
  //         `${websiteCustomer.SEARCH_PAGINATED}`,
  //         payload
  //       );

  //       console.log(response.data);
  //       setAllCustomersData(response.data.data.customersData);
  //       setTotalPages(response.data.data.totalPages);

  //       // Ensure the current page is within the total pages
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
  //       // Otherwise, fetch data as normal
  //       fetchData();
  //     }
  //   } else {
  //     // No search term, reset to original data
  //     setAllCustomersData(originalData);
  //     setTotalPages(originalTotalPages);
  //   }
  // }, [debouncedSearchTerm, page, limit, originalData]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (debouncedSearchTerm.length < 3) {
  //         toast.error("Search keyword must be at least 3 characters long.");
  //         return;
  //       }

  //       const payload = {
  //         page: String(page),
  //         limit: String(limit),
  //         search_keyword: debouncedSearchTerm,
  //       };
  //       console.log(payload);

  //       let response = await axios.post(
  //         `${websiteCustomer.SEARCH_PAGINATED}`,
  //         payload
  //       );

  //       console.log(response.data);
  //       setAllCustomersData(response.data.data.customersData);
  //       setTotalPages(response.data.data.totalPages);

  //       // Ensure the current page is within the total pages
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
  //     // Fetch data without resetting page if page change is triggered by pagination
  //     fetchData();
  //   } else {
  //     // Reset to original data when search is cleared
  //     setAllCustomersData(originalData);
  //     setTotalPages(originalTotalPages);
  //   }
  // }, [debouncedSearchTerm, page, limit, originalData]);

  // useEffect(() => {
  //   // Reset to page 1 when search term changes
  //   setPage(1);
  // }, [debouncedSearchTerm]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (debouncedSearchTerm.length < 3) {
  //         toast.error("Search keyword must be at least 3 characters long.");
  //         return;
  //       }

  //       const payload = {
  //         page: String(page),
  //         limit: String(limit),
  //         search_keyword: debouncedSearchTerm,
  //       };
  //       console.log(payload);

  //       let response = await axios.post(
  //         `${websiteCustomer.SEARCH_PAGINATED}`,
  //         payload
  //       );

  //       console.log(response.data);
  //       setAllCustomersData(response.data.data.customersData);
  //       setTotalPages(response.data.data.totalPages);

  //       // Ensure the current page is within the total pages
  //       // if (page > response.data.data.totalPages) {
  //       //   setPage(1); // Reset to the first page if the current page is out of bounds
  //       // }
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

  //   // Conditionally call fetchData if search term is valid and we're not resetting the page unnecessarily
  //   if (debouncedSearchTerm !== "") {
  //     fetchData();
  //   } else {
  //     setAllCustomersData(originalData);
  //     setTotalPages(originalTotalPages);
  //   }
  // }, [debouncedSearchTerm, page, limit]);

  // useEffect(() => {
  //   // Reset to page 1 when search term changes
  //   if (debouncedSearchTerm !== "") {
  //     setPage(1); // Only reset page to 1 when search term changes
  //   }
  // }, [debouncedSearchTerm]);

  // const fetchData = async (currentPage) => {
  //   try {
  //     if (debouncedSearchTerm.length < 3) {
  //       toast.error("Search keyword must be at least 3 characters long.");
  //       return;
  //     }

  //     const payload = {
  //       page: String(currentPage),
  //       limit: String(limit),
  //       search_keyword: debouncedSearchTerm,
  //     };
  //     console.log(payload);

  //     let response = await axios.post(
  //       `${websiteCustomer.SEARCH_PAGINATED}`,
  //       payload
  //     );

  //     console.log(response.data);
  //     setAllCustomersData(response.data.data.customersData);
  //     setTotalPages(response.data.data.totalPages);

  //     // Ensure the current page is within the total pages
  //     if (currentPage > response.data.data.totalPages) {
  //       setPage(1); // Reset to the first page if the current page is out of bounds
  //     }
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
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (debouncedSearchTerm !== "" && debouncedSearchTerm.length >= 3) {
  //     fetchData(page); // Call fetchData with the current page
  //   } else {
  //     // No search term, reset to original data
  //     setAllCustomersData(originalData);
  //     setTotalPages(originalTotalPages);
  //   }
  // }, [debouncedSearchTerm, page, limit, originalData]);

  // useEffect(() => {
  //   // Reset to page 1 when the search term changes
  //   if (debouncedSearchTerm !== "") {
  //     setPage(1);
  //   }
  // }, [debouncedSearchTerm]);

  // useEffect(() => {
  //   // Fetch data when the page is reset to 1 after the search term changes
  //   if (debouncedSearchTerm !== "" && page === 1) {
  //     fetchData(1); // Ensure we're fetching data for page 1
  //   }
  // }, [page]); // Only triggers when the page changes

  const fetchData = async (currentPage) => {
    if (debouncedSearchTerm.length < 3) {
      toast.error("Search keyword must be at least 3 characters long.");
      return;
    }

    const payload = {
      page: String(currentPage),
      limit: String(limit),
      search_keyword: debouncedSearchTerm,
    };

    try {
      const response = await axios.post(
        `${websiteCustomer.SEARCH_PAGINATED}`,
        payload
      );
      setAllCustomersData(response.data.data.customersData);

      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status >= 400) {
          toast.error(data.message);
        }
      }
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchData(page);
    } else {
      // Reset to original data when the search term is cleared
      setAllCustomersData(originalData);
      setTotalPages(originalTotalPages); // Adjust total pages based on original data
    }
  }, [debouncedSearchTerm, page, originalData]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (page !== 1) {
      setPage(1); // Reset to page 1 when search term changes
    }
  };

  return (
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Customer"} />
      {/* <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setCustomerCrationModal(!customerCrationModal)}
          className={`w-[25%] py-2 ${
            customerCrationModal
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center text-xl`}
        >
          <span className="mr-2">
            {customerCrationModal ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span>{" "}
          {customerCrationModal ? "Back " : "Create Customer"}
        </button>
      </div>
      <h1 className="text-3xl font-semibold -mt-6">Customer</h1> */}

      {/* {!customerCrationModal && ( */}
      <div className="max-w-md mt-6 md:mt-[2%]">
        <h1 className="md:text-4xl text-2xl mt-8 mb-6 font-bold text-black">
          Customers
        </h1>
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
            placeholder="Search By customer Name"
          />
        </div>
      </div>
      {/* )} */}

      {!loading && (
        <div>
          <CustomerTable
            allCustomersData={allCustomersData}
            setAllCustomersData={setAllCustomersData}
            setOriginalData={setOriginalData}
            page={page}
            setTotalPages={setTotalPages}
            setOriginalTotalPages={setOriginalTotalPages}
          />

          {/* {customerCrationModal ? (
            <CreateCustomer />
          ) : (
""            // <CustomerTable categorieData={categorieData} />
          )} */}
        </div>
      )}
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

export default Customer;
