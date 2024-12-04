import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumb from "../../common/Breadcrumb";
import { FaChevronLeft } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import CreateScannerUser from "./CreateScannerUser";
import ScannerUserTable from "./ScannerUserTable";
import axios from "axios";
import { scanUser } from "../../../../../services/apis";

const ScannerUser = () => {
  const [userCreation, setUserCreation] = useState(false);
  const [users, setUser] = useState([]);
  const [statusToggle, setstatusToggle] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [!userCreation, statusToggle]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${scanUser.GET_ALL}`);
      console.log(response.data.data);
      setUser(response.data.data);
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
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Scanner user"} />
      <div className="w-full flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setUserCreation(!userCreation)}
          className={`md:w-[25%] w-[30%] py-2 ${
            userCreation
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center md:text-xl md:px-0 px-2`}
        >
          {/* <span className="mr-2">
            {userCreation ? <FaChevronLeft size={23} /> : <IoMdAdd size={23} />}
          </span>{" "} */}
          {userCreation ? "Back " : "Add Scanner user"}
        </button>
      </div>
      <h1 className="md:text-3xl text-xl font-semibold -mt-6">Scanner User</h1>
      <div>
        {userCreation ? (
          <CreateScannerUser setUserCreation={setUserCreation} />
        ) : (
          <ScannerUserTable users={users} setstatusToggle={setstatusToggle} />
        )}
      </div>
    </div>
  );
};

export default ScannerUser;
