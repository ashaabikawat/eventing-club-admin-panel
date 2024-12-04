import { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import {
  promoterEndpoint,
  eventEndPoint,
} from "../../../../../../services/apis";
import { MdPersonAddAlt1 } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Select from "react-select";

const AddNewPromoterModal = ({
  setOpenAddPromoterModal,
  openModalPromoterData,
  eventId,
  onPromoterUpdate,
}) => {
  // console.log({ openModalPromoterData });

  const [apiAllPromoterData, setApiAllPromoterData] = useState([]);
  const [allPromoterData, setAllPromoterData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [promoterID, setPromoterID] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllPromoterData();
  }, []);

  useEffect(() => {
    if (apiAllPromoterData.length > 0) {
      handlerSelectedPromoter();
    }
  }, [apiAllPromoterData]);

  const getAllPromoterData = async () => {
    try {
      const FetchPromoterData = await axios.get(
        `${promoterEndpoint.GET_ALL_PROMOTER_DATA_URL}`
      );

      // console.log("FetchPromoterData", FetchPromoterData.data);

      const allPromoterData = FetchPromoterData.data.data;
      setApiAllPromoterData(allPromoterData);
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

  const handlerSelectedPromoter = () => {
    // Extract the selected IDs
    const selectedIds = openModalPromoterData.map((option) => option._id);
    // console.log(selectedIds.length );

    // Check which selected IDs exist in apiAllPromoterData
    const matchedOptions = [];

    openModalPromoterData.forEach((options) => {
      const organizer = apiAllPromoterData.find(
        (org) => org._id === options.promoter_id
      );
      if (organizer) {
        matchedOptions.push({
          value: organizer._id,
          label: organizer.Username,
        });
      }
    });

    //  console.log({ matchedOptions });

    // Update state with matched options
    setSelectedOptions(matchedOptions);
    setPromoterID(matchedOptions);

    // Filter out matched options from apiAllPromoterData
    const updatedAllPromoterData = apiAllPromoterData
      .filter((organizer) => !selectedIds.includes(organizer._id))
      .map((organizer) => ({
        value: organizer._id,
        label: organizer.Username,
      }));

    //  console.log({ updatedAllPromoterData });

    // Update state with unmatched options
    setAllPromoterData(updatedAllPromoterData);
    setLoading(true);
  };
  const handleSelectChangePromoter = (selected) => {
    setSelectedOptions(selected);
    // const organizerIds = selected.map((id) => ({ organizer_id: id.value }));
    // console.log({ organizerIds });
    setPromoterID(selected);
  };

  const handlerAddPromoters = async () => {
    //  if(promoterID.length < 1 ){
    //     return toast.error("Please select at least one promoter")
    //  }

    const promoterIDS = promoterID.map((item) => item.value);

    const payload = {
      event_id: eventId,
      promoterIds: promoterIDS,
    };

    console.log({ payload });

    try {
      let response = await axios.post(
        `${eventEndPoint.ADD_PROMOTER_IN_EVENT}`,
        payload
      );

      console.log("response check ===>", response.data.data);
      onPromoterUpdate(response.data.data.EventPromoter);
      setPromoterID([]);
      setOpenAddPromoterModal(false);
      toast.success(response.data.message);
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

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4  rounded-md  md:w-[50%] sm:w-[70%]">
        <Toaster />
        <div className="w-[96%] mx-auto flex justify-between">
          <h1>Add Promoter</h1>
          <p
            onClick={() => setOpenAddPromoterModal(false)}
            className="cursor-pointer"
          >
            <span>
              <IoIosCloseCircle size={20} />
            </span>
          </p>
        </div>

        {loading ? (
          <div>
            <div className="mt-3">
              <p className="text-black font-semibold text-lg mb-1">
                Add Promoter
              </p>
              <Select
                isMulti
                name="promoters"
                options={allPromoterData}
                className="basic-multi-select bg-Gray40"
                classNamePrefix="select promoter"
                onChange={handleSelectChangePromoter}
                value={selectedOptions}
              />
            </div>
            <div className="mt-3 w-full flex justify-end">
              <button
                type="button"
                onClick={() => handlerAddPromoters()}
                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"
              >
                <span className="pr-1">
                  <MdPersonAddAlt1 size={18} />
                </span>
                {allPromoterData && selectedOptions.length > 0
                  ? "Update Promoter"
                  : "Add Promoter"}
              </button>
            </div>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default AddNewPromoterModal;
