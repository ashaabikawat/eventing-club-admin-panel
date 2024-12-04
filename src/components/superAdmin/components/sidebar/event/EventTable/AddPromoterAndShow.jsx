import { useState } from "react";
// import { BsCircleFill } from "react-icons/bs";
import { IoIosAddCircle } from "react-icons/io";
import AddNewPromoterModal from "./AddNewPromoterModal";

const AddPromoterAndShow = ({ eventData }) => {
  // console.log(eventData);
  const promoterss = eventData.EventPromoter || [];
  const eventID = eventData._id;

  const [eventId, setEventId] = useState(eventID);
  const [promoters, setPromoters] = useState(promoterss);
  const [openAddPromoterModal, setOpenAddPromoterModal] = useState(false);
  const [openModalPromoterData, setOpenModalPromoterData] = useState({});

  const handlerPromoter = (promoterData) => {
    setOpenAddPromoterModal(true);
    setOpenModalPromoterData(promoterData);
  };

  const handlePromoterUpdate = (newPromoters) => {
    setPromoters(newPromoters);
  };
  // console.log("event data", eventData);

  return (
    <div>
      {promoters.length === 0 ? (
        <IoIosAddCircle
          onClick={() => handlerPromoter(promoters)}
          className="cursor-pointer ml-4"
          size={24}
        />
      ) : (
        <div className="flex items-center cursor-pointer pl-3">
          {promoters.map((_, index) => {
            if (index < 4) {
              return (
                <div
                  key={index}
                  onClick={() => handlerPromoter(promoters)}
                  className="w-5 h-5 bg-Gray85 border border-white rounded-full -mx-0.5 "
                />
              );
            }
            return null;
          })}
          {promoters.length > 4 && (
            <span className="mx-1">+{promoters.length - 4}</span>
          )}
        </div>
      )}

      {openAddPromoterModal && (
        <div>
          <AddNewPromoterModal
            setOpenAddPromoterModal={setOpenAddPromoterModal}
            openModalPromoterData={openModalPromoterData}
            eventId={eventId}
            onPromoterUpdate={handlePromoterUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default AddPromoterAndShow;
