import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa6";
import CreateVenue from "./CreateVenue";
import VenueTable from "./VenueTable";
import {
  venueEndPoint,
  getallcityDataEndPoint,
} from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { limit } from "../../../../common/helper/Enum";
import { Pagination } from "@mui/material";
import { TbFilter } from "react-icons/tb";
import Select from "react-select";

const Venue = () => {
  const [venueCrationModal, setVenueCrationModal] = useState(false);
  const [venueData, setVenueData] = useState([]);
  const [openFilteredPop, setOpenFilteredPop] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [originalTotalPages, setOriginalTotalPages] = useState();
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  useEffect(() => {
    if (openFilteredPop) {
      getAllCityData();
    }
  }, [openFilteredPop]);

  const getAllCityData = async () => {
    try {
      const FetchCityData = await axios.post(
        `${getallcityDataEndPoint.GET_ALL_EVENT_CITY_DATA}`
      );
      setCities(FetchCityData.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if ([400, 401, 403, 404, 409, 500].includes(status)) {
        toast.error(data.message);
      }
    }
  };

  const openEventFilterPopUp = () => {
    setOpenFilteredPop(true);
  };

  const handlePaginationChange = (event, newPage) => {
    setPage(newPage);
  };

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
          `${`${venueEndPoint.SEARCH_DATA_PAGINATED}`}`,
          payload
        );

        console.log(response.data);
        setVenueData(response.data.data.VenueData);
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
      setVenueData(originalData);
      setTotalPages(originalTotalPages);
    }
  }, [debouncedSearchTerm, page, limit, originalData]);

  const handleSearch = async (isNewSearch = false) => {
    if (isNewSearch) {
      setPage(1);
    }

    if (selectedCity === null) {
      return toast.error("Please select at least one filter");
    }

    // Initialize a new filters object
    let newFilters = { ...filters };

    // Add filters only if they are selected (not null)
    // if (selectedEventNames) {
    //   newFilters.event_id = selectedEventNames.value;
    // }

    if (selectedCity) {
      newFilters.CityName = selectedCity.value;
    }

    setFilters(newFilters);

    // Close the filtered popup
    setOpenFilteredPop(false);

    // getALLEventData();
  };

  return (
    <div className="mt-[3%] ml-[2%]">
      <Toaster />
      <Breadcrumb path={"Venue"} />
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setVenueCrationModal(!venueCrationModal)}
          className={`w-[25%] py-2 ${
            venueCrationModal
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center md:text-xl`}
        >
          {/* <span className="mr-2">
            {venueCrationModal ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span>{" "} */}
          {venueCrationModal ? "Back " : "Create Venue"}
        </button>
      </div>
      <h1 className="md:text-3xl text-2xl font-semibold -mt-6">Venue</h1>

      {!venueCrationModal && (
        <div className="max-w-md mt-6 md:mt-[2%] flex gap-4  justify-between ">
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
              placeholder="Search venue."
            />
          </div>
          <div className="flex   md:mt-0 mt-4 gap-x-4">
            <div onClick={openEventFilterPopUp} className="   ">
              <button className="border-[2px] border-Gray40 p-2">
                <TbFilter size={30} color="gray" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {venueCrationModal ? (
          <CreateVenue setVenueCrationModal={setVenueCrationModal} />
        ) : (
          <VenueTable
            venueData={venueData}
            setVenueData={setVenueData}
            setOriginalData={setOriginalData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            setTotalPages={setTotalPages}
            handlePaginationChange={handlePaginationChange}
            setOriginalTotalPages={setOriginalTotalPages}
          />
        )}

        {openFilteredPop && (
          <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-4 rounded-md md:w-[60%] lg:w-[50%] w-[90%]">
              <div className="flex justify-between">
                <h1 className="mt-2">Event Filter</h1>
                <button
                  className="bg-Gray40 text-white px-2 py-2"
                  // onClick={handleReset}
                >
                  Reset All
                </button>
              </div>

              <div className="">
                <div className="flex w-full md:flex-row flex-col mt-4 gap-x-5 justify-between">
                  <div className="md:w-[50%]">
                    <label htmlFor="">City</label>
                    <Select
                      styles={dropdownStyles}
                      options={cities.map((city) => ({
                        value: city.CityName,
                        label: city.CityName,
                      }))}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Select City"
                      isClearable
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-end gap-x-4">
                <button
                  className="mt-4 w-[25%] border-2 border-Gray40  text-black p-2 rounded-md"
                  onClick={() => setOpenFilteredPop(false)}
                >
                  Close
                </button>
                <button
                  className="mt-4 w-[25%] bg-Gray40 text-white p-2 rounded-md"
                  onClick={() => handleSearch(true)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {!venueCrationModal && (
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

export default Venue;
