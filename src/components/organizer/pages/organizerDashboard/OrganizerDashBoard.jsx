import { Outlet, useLocation } from "react-router-dom";
import OrganizerSideBar from "./OrganizerSideBar";
// import Artist from "../../components/sidebar/artist/Artist";
import OrganizerDashBoardComponent from "./OrganizerDashBoardComponent";

const OrganizerDashBoard = () => {
  return (
    <div className="h-[100%]">
      <OrganizerSideBar />
      <div className="p-4 sm:ml-64">
        <OrganizerDashBoardComponent />
        <Outlet />
      </div>
    </div>
  );
};

export default OrganizerDashBoard;
