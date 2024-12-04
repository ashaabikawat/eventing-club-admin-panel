import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { eventEndPoint } from "../../../../../../services/apis";
import axios from "axios";
import { formatDateForInput } from "../../../../../common/FormatDate";
// import { toast } from "react-toastify";

const EditEventTimeDateModal = ({
  editEventDate,
  setEventEditTimeDateOpenModal,
  handleSave,
}) => {
  //   console.log({ editEventDate });

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [today, setToday] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
      // setToday(today);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (today) {
      const date = formatDateForInput(today.toLocaleDateString("en-US"));
      setFormattedDate(date);
    }
  }, [today]);

  useEffect(() => {
    if (editEventDate) {
      setStartDate(editEventDate.EventStartDate);
      setStartTime(editEventDate.EventStartTime);
      setEndDate(editEventDate.EventEndDate);
      setEndTime(editEventDate.EventEndTime);
    }
  }, [editEventDate]);

  const handleChangeTime = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "startDate":
        setStartDate(value);
        break;
      case "startTime":
        setStartTime(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "endTime":
        setEndTime(value);
        break;
      default:
        break;
    }
  };

  // const onSave = async () => {
  //   if (!startDate || !startTime || !endDate || !endTime) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   const formatTime = (time) => {
  //     const timeParts = time.split(":");
  //     if (timeParts.length === 2) {
  //       return `${time}:00`;
  //     }
  //     return time;
  //   };

  //   const newEvent = {
  //     ...editEventDate,
  //     EventStartDate: startDate,
  //     EventStartTime: formatTime(startTime),
  //     EventEndDate: endDate,
  //     EventEndTime: formatTime(endTime),
  //   };

  //   handleSave(newEvent);
  // };

  const onSave = async () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("All fields are required");
      return;
    }

    const formatTime = (time) => {
      const timeParts = time.split(":");
      if (timeParts.length === 2) {
        return `${time}:00`;
      }
      return time;
    };

    const startTimeWithSeconds = formatTime(startTime);
    const endTimeWithSeconds = formatTime(endTime);

    // Convert start and end date-time into comparable formats
    const startDateTime = new Date(`${startDate}T${startTimeWithSeconds}`);
    const endDateTime = new Date(`${endDate}T${endTimeWithSeconds}`);

    // Check if end date-time is earlier than start date-time
    if (endDateTime < startDateTime) {
      toast.error("End time cannot be earlier than start time.");
      return;
    }

    const newEvent = {
      ...editEventDate,
      EventStartDate: startDate,
      EventStartTime: startTimeWithSeconds,
      EventEndDate: endDate,
      EventEndTime: endTimeWithSeconds,
    };

    handleSave(newEvent);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4 rounded-md md:w-[50%]">
        <Toaster />
        <div>
          <p className="mt-4 text-xl text-black font-semibold">
            Update Date & Time
          </p>
          <div className="w-full mt-2 h-auto bg-grayshade mb-6">
            <div className="flex w-full">
              <div className="p-2 flex flex-col w-[49%]">
                <label htmlFor="startDate" className="mb-1.5">
                  Select Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  min={formattedDate}
                  onChange={handleChangeTime}
                  className="bg-Gray85 py-2 px-2"
                />
              </div>
              <div className="p-2 flex flex-col w-[49%]">
                <label htmlFor="startTime" className="mb-1.5">
                  Select Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={startTime}
                  onChange={handleChangeTime}
                  className="bg-Gray85 py-2 px-2"
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="p-2 flex flex-col w-[49%]">
                <label htmlFor="endDate" className="mb-1.5">
                  Select End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  min={startDate}
                  value={endDate}
                  onChange={handleChangeTime}
                  className="bg-Gray85 py-2 px-2"
                />
              </div>
              <div className="p-2 flex flex-col w-[49%]">
                <label htmlFor="endTime" className="mb-1.5">
                  Select End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={endTime}
                  onChange={handleChangeTime}
                  className="bg-Gray85 py-2 px-2"
                />
              </div>
            </div>
            <div className="w-[95%] flex justify-end items-end mt-5 mb-3 pb-4">
              <button
                className="px-5 py-2 text-white bg-Gray40"
                type="button"
                onClick={onSave}
              >
                Update
              </button>
              <button
                className="px-5 py-2 text-white bg-Gray40 ml-2"
                type="button"
                onClick={() => setEventEditTimeDateOpenModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventTimeDateModal;
