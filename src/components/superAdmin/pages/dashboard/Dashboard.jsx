import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
// import Artist from "../../components/sidebar/artist/Artist";
import DashboardComponent from "./DashboardComponent";

const Dashboard = () => {
  const location = useLocation();

  // console.log("location " , location )
  // const isDashboardPage = location.pathname == '/superAdmin/dashboard';

  return (
    <div className="h-[100%]">
      <SideBar />
      <div className="p-4 sm:ml-64">
        <DashboardComponent />
        <Outlet />
        {/* {isDashboardPage && <DashboardComponent/>} */}
      </div>
    </div>
  );
};

export default Dashboard;
