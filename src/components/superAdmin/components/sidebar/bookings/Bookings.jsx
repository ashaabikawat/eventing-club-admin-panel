import React, { useEffect, useState } from "react";
import Promoter from "./Promoter";
import Online from "./Online";
import All from "./All";

const Bookings = () => {
  const [selectedEventType, setSelectedEventType] = useState("All");

  const renderComponent = () => {
    switch (selectedEventType) {
      case "All":
        return (
          <All
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
          />
        );
      case "Promoter":
        return (
          <Promoter
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
          />
        );
      case "Online":
        return (
          <Online
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
          />
        );
      default:
        return (
          <All
            setSelectedEventType={setSelectedEventType}
            selectedEventType={selectedEventType}
          />
        );
    }
  };

  return (
    // <div>
    //   <Toaster />
    //   <div className="w-[94%] mx-auto">
    //     <div className="flex justify-between">
    //       <h1 className="text-4xl mt-5 mb-6 font-bold text-black">Bookings</h1>
    //       <div className="mt-5 mb-6">
    //         <button
    //           onClick={() => DownloadReportHandler()}
    //           className="bg-[#666666]  w-56 text-white py-2 px-4 rounded"
    //         >
    //           Download Report{" "}
    //         </button>
    //       </div>
    //     </div>
    //     <div className="w-[100%]  flex justify-between">
    //       <div className="relative flex items-center w-[50%] h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-black ">
    //         <div className="grid place-items-center h-full w-12 text-gray-300">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             className="h-6 w-6"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth="2"
    //               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    //             />
    //           </svg>
    //         </div>

    //         <input
    //           className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
    //           type="text"
    //           id="search"
    //           value={searchTerm}
    //           onChange={handleChange}
    //           placeholder="Search By Customer Name and Booking ID"
    //         />
    //       </div>

    //       <div className="flex gap-x-4">
    //         <div
    //           onClick={openEventFilterPopUp}
    //           className=" px-3 py-1 border-[2px] border-Gray40 "
    //         >
    //           <button className="">
    //             <TbFilter size={30} color="gray" />
    //           </button>
    //         </div>

    //         {isManual && (
    //           <div className="flex">
    //             <input
    //               type="date"
    //               className="mr-3 h-12 px-2 border border-gray-300 rounded-lg"
    //               value={startDate}
    //               onChange={(e) => handleManualDateChange(e, "start")}
    //             />
    //             <input
    //               type="date"
    //               className="border  h-12 px-2 border-gray-300 rounded-lg"
    //               value={endDate}
    //               onChange={(e) => handleManualDateChange(e, "end")}
    //             />
    //             <button
    //               onClick={handleManualSubmit}
    //               className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
    //             >
    //               Apply
    //             </button>
    //           </div>
    //         )}

    //         <div className="relative inline-block text-left">
    //           <button
    //             id="dropdownDefaultButton"
    //             onClick={toggleDropdownFiltered}
    //             className="text-semiBlack  border-[2px] border-semiBlack   font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center "
    //             type="button"
    //           >
    //             Dropdown button
    //             <BsChevronDown
    //               className="w-2.5 h-2.5 ms-3"
    //               aria-hidden="true"
    //             />
    //           </button>

    //           {isOpen && (
    //             <div
    //               id="dropdown"
    //               className="z-10 absolute right-0 mt-2 w-44  bg-white  divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
    //             >
    //               <ul
    //                 className="py-2 text-sm text-gray-700 dark:text-gray-200"
    //                 aria-labelledby="dropdownDefaultButton"
    //               >
    //                 {dropdownOptions.map((option, index) => (
    //                   <>
    //                     <li
    //                       onClick={() => handleDateSelection(option.Value)}
    //                       key={index}
    //                     >
    //                       <span className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
    //                         {option.Value}
    //                       </span>
    //                     </li>
    //                   </>
    //                 ))}
    //               </ul>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {/* <Promoter  /> */}

    //   <div className="flex mt-8 gap-x-11 w-[100%] mx-auto">
    //     {tabs.map((event) => (
    //       <div key={event.id}>
    //         <button
    //           onClick={() => setSelectedEventType(event.EventType)}
    //           className={` px-2 py-1 ${
    //             event.EventType === selectedEventType
    //               ? "bg-gray-200 px-2 py-1 rounded-md"
    //               : ""
    //           } `}
    //         >
    //           {event.EventType}
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    //   {renderComponent()}
    //   {openFilteredPop && (
    //     <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
    //       <div className="bg-white p-4 rounded-md md:w-[60%] lg:w-[50%] sm:w-[70%]">
    //         <div className="flex justify-between">
    //           <h1 className="mt-2">Event Filter</h1>
    //           <button
    //             className="bg-Gray40 text-white px-2 py-2"
    //             onClick={handleReset}
    //           >
    //             Reset All
    //           </button>
    //         </div>
    //         {/* Dropdowns */}
    //         <div className="">
    //           <div className="flex w-full mt-4 gap-x-5 justify-between">
    //             <div className="w-[50%]">
    //               <label htmlFor="">City</label>
    //               <Select
    //                 styles={dropdownStyles}
    //                 options={cities.map((city) => ({
    //                   value: city.CityName,
    //                   label: city.CityName,
    //                 }))}
    //                 value={selectedCity}
    //                 onChange={setSelectedCity}
    //                 placeholder="Select City"
    //                 isClearable
    //               />
    //             </div>

    //             <div className="w-[50%]">
    //               <label htmlFor="">Venue</label>
    //               <Select
    //                 styles={dropdownStyles}
    //                 options={venues.map((venue) => ({
    //                   value: venue._id,
    //                   label: venue.Name,
    //                 }))}
    //                 value={selectedVenue}
    //                 onChange={setSelectedVenue}
    //                 placeholder="Select Venue"
    //                 isClearable
    //               />
    //             </div>
    //           </div>
    //           <div className="flex w-full mt-4 gap-x-5 justify-between">
    //             <div className="w-[50%]">
    //               <label htmlFor="">Organizers</label>
    //               <Select
    //                 styles={dropdownStyles}
    //                 options={organizer.map((organizer) => ({
    //                   value: organizer._id,
    //                   label: organizer.Username,
    //                 }))}
    //                 value={selectedOrganizer}
    //                 onChange={setSelectedOrganizer}
    //                 placeholder="Select Organizer"
    //                 isClearable
    //               />
    //             </div>

    //             <div className="w-[50%]">
    //               <label htmlFor="">Promoters</label>
    //               <Select
    //                 styles={dropdownStyles}
    //                 options={promoters.map((promoters) => ({
    //                   value: promoters._id,
    //                   label: promoters.Username,
    //                 }))}
    //                 value={selectedPromoter}
    //                 onChange={setSelectedPromoter}
    //                 placeholder="Select Promoter"
    //                 isClearable
    //               />
    //             </div>
    //           </div>

    //           <div className="flex w-full mt-2 gap-x-5 justify-between">
    //             <div className="w-[50%]">
    //               <label htmlFor="">Event Name</label>
    //               <Select
    //                 styles={dropdownStyles}
    //                 options={eventNames.map((name) => ({
    //                   value: name._id,
    //                   label: name.EventName,
    //                 }))}
    //                 value={selectedEventNames}
    //                 onChange={setSelectedEventNames}
    //                 placeholder="Select Event names"
    //                 isClearable
    //               />
    //             </div>
    //           </div>
    //         </div>
    //         {/* Search Button */}
    //         <div className="w-full flex justify-end gap-x-4">
    //           <button
    //             className="mt-4 w-[25%] border-2 border-Gray40  text-black p-2 rounded-md"
    //             onClick={() => setOpenFilteredPop(false)}
    //           >
    //             Close
    //           </button>
    //           <button
    //             className="mt-4 w-[25%] bg-Gray40 text-white p-2 rounded-md"
    //             onClick={handleSearch}
    //           >
    //             Search
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="min-h-screen">{renderComponent()}</div>
  );
};

export default Bookings;
