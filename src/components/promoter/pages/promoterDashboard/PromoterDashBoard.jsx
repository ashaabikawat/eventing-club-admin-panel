import { Outlet, useLocation } from "react-router-dom";
import PromoterSideBar from "./PromoterSideBar";
// import Artist from "../../components/sidebar/artist/Artist";
import PromoterDashBoardComponent from "./PromoterDashBoardComponent";


const PromoterDashBoard = () => {
  return (
     <div className="h-[100%]">
      <PromoterSideBar />
      <div className="p-4 sm:ml-64">
        <PromoterDashBoardComponent />
        <Outlet />
      </div>
    </div>
  )
}

export default PromoterDashBoard