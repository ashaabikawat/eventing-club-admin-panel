import React, { useEffect, useState } from "react";
import Promoter from "./Promoter";
import Online from "./Online";
import All from "./All";

const OrganizerBooking = () => {
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

  return <div className="min-h-screen">{renderComponent()}</div>;
};

export default OrganizerBooking;
