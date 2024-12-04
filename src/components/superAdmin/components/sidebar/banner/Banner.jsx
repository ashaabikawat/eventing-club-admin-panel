import React, { useEffect, useState } from "react";
import { IoMdAdd, IoMdCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { artistCreationObjectSchema } from "../../../validation/YupValidation";
import { useFormik } from "formik";
import {
  artistEndpoints,
  banner,
  eventEndPoint,
} from "../../../../../services/apis";
import axios from "axios";
import Select from "react-select";
import { useSelector } from "react-redux";
import CreateBanner from "./CreateBanner";
import Breadcrumb from "../../common/Breadcrumb";
import { FaChevronLeft } from "react-icons/fa";
import BannerTable from "./BannerTable";
// import { utils } from "xlsx";

const Banner = () => {
  const [bannerCreation, setBannerCreation] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [!bannerCreation]);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${banner.GET_ALL}`);
      console.log(response.data.data);
      setBanners(response.data.data);
      setLoading(false);
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
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="mt-[3%] ml-[2%] min-h-screen">
      <Toaster />
      <Breadcrumb path={"Banner"} />
      {/* {console.log(errors)} */}
      {/* <CreateBanner /> */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setBannerCreation(!bannerCreation)}
          className={`md:w-[15%] px-2 py-2 ${
            bannerCreation
              ? "border-2 text-Gray85 border-Gray85"
              : "bg-Gray40 text-white"
          } flex justify-center items-center md:text-xl`}
        >
          {/* <span className="mr-2">
            {bannerCreation ? (
              <FaChevronLeft size={23} />
            ) : (
              <IoMdAdd size={23} />
            )}
          </span>{" "} */}
          {bannerCreation ? "Back " : "Add Banner"}
        </button>
      </div>
      <h1 className="md:text-3xl text-2xl font-semibold -mt-2">Banner</h1>

      {bannerCreation ? (
        <CreateBanner setBannerCreation={setBannerCreation} />
      ) : (
        <BannerTable
          banners={banners}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default Banner;
