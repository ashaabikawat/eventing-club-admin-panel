import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { venueEndPoint } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { venueObjectSchema } from "../../../validation/YupValidation";
import EditAddress from "../../../../common/EditAddress";
import { BiSolidImageAdd } from "react-icons/bi";

const EditVenue = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [venueData, setVenueData] = useState({});
  const [loading, setLoading] = useState(true);
  const [genreImage, setGenreImage] = useState([]);

  // Image section

  const [imageUrl, setImageUrl] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  // State City and ISO Code and Name
  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();

  useEffect(() => {
    getVenueDataById();
  }, []);

  //   Fetch Artist Data by Id
  const getVenueDataById = async () => {
    try {
      const payload = {
        venue_id: _id,
      };

      let response = await axios.post(
        `${venueEndPoint.VENUE_GET_DATA_BY_ID}`,
        payload
      );

      setVenueData(response.data.data);
      setGenreImage(response.data.data.Images);
      setStateIsoCode(response.data.data.StateIsoCode);
      setStateName(response.data.data.State);
      setCityIsoCode(response.data.data.CityIsoCode);
      setCityName(response.data.data.City);

      console.log(response.data);
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

  const initialValues = loading
    ? {
        venueName: "",
        venueDescription: "",
        venueAddress: "",
        venueMapLocation: "",
      }
    : {
        venueName: venueData?.Name,
        venueDescription: venueData?.Description,
        venueAddress: venueData.Address,
        venueMapLocation: venueData?.Map_Location,
        genreImage: venueData?.Image,
      };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: venueObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        venue_id: _id,
        Name: values.venueName,
        Description: values.venueDescription,
        Address: values.venueAddress,
        Map_Location: values.venueMapLocation,
        Country: venueData.Country,
        CountryIsoCode: venueData.CountryIsoCode,
        State: stateName,
        StateIsoCode: stateIsoCode,
        City: cityName,
        CityIsoCode: String(cityIsoCode),
      };

      console.log("payload", payload);

      if (genreImage.length === 0) {
        toast.error("Please select at least one image to display");
        return;
      }

      try {
        let response = await axios.post(
          `${venueEndPoint.VENUE_DATA_UPDATED}`,
          payload
        );

        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/superAdmin/dashboard/venue");
        }, 2000);
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
    },
  });

  // Image Selection
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   const maxSize = 500 * 1024;
  //   console.log("File ==========> ", file);

  //   if (/\.(jpe?g|png)$/i.test(file.name)) {
  //     if (file.size < maxSize) {
  //       reader.onloadend = () => {
  //         setSelectedImage(file);
  //         setImageUrl(reader.result);
  //         setFieldValue("ProductOtherImage", file);
  //       };

  //       if (file) {
  //         reader.readAsDataURL(file);
  //       }
  //     } else {
  //       toast.error("Image size should be less than 500KB");
  //     }
  //   } else {
  //     toast.error("Invalid Image File. Please select a JPEG or PNG image.");
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const maxSize = 500 * 1024; // 500KB

    if (/\.(jpe?g|png)$/i.test(file.name)) {
      if (file.size < maxSize) {
        const img = new Image(); // Create a new Image object
        img.src = URL.createObjectURL(file); // Create a URL for the image file

        img.onload = () => {
          // Check dimensions
          if (img.width !== 1024 || img.height !== 812) {
            toast.error("Image dimensions must be 1024x812.");
          } else {
            // Proceed if dimensions are valid
            reader.onloadend = () => {
              setSelectedImage(file);
              setImageUrl(reader.result);
              setFieldValue("ProductOtherImage", file);
            };

            reader.readAsDataURL(file); // Read the image file
          }
        };

        img.onerror = () => {
          toast.error("Invalid image file.");
        };
      } else {
        toast.error("Image size should be less than 500KB");
      }
    } else {
      toast.error("Invalid Image File. Please select a JPEG or PNG image.");
    }
  };

  //   Add Category  Image
  const handleAddClick = async () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("venue_id", _id);
      formData.append("VenueImage", selectedImage);

      let response = await axios.post(
        `${venueEndPoint.VENUE_UPLOAD_IMAGE}`,
        formData
      );

      toast.success("Venue Image uploaded successfully");
      console.log(response.data);
      setGenreImage(response.data.data);
      setSelectedImage();
      setImageUrl("");
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

  //   Remove Category Image
  const handlerRemoveImage = async (imageData) => {
    try {
      console.log(imageData);

      const payload = {
        venue_id: _id,
        image_id: imageData._id,
      };

      let response = await axios.post(
        `${venueEndPoint.VENUE_IMAGE_REMOVE}`,
        payload
      );

      toast.success(response.data.message);

      const fillteredProducts = genreImage.filter(
        (genreImage) => genreImage._id !== imageData._id
      );
      setGenreImage(fillteredProducts);
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

  // // console.log("stateIsoCode", stateIsoCode);
  // // console.log("stateName", stateName);
  // console.log("cityIsoCode", cityIsoCode);
  // console.log("cityName", cityName);

  return (
    <div>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Venue"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/venue")}
            className={`w-[15%] py-2 
               "border-2 border-black text-Gray85 "
          flex justify-center items-center text-xl`}
          >
            <span className="mr-2">
              <FaChevronLeft size={23} />
            </span>{" "}
            Back
          </button>
        </div>
        <h1 className="text-3xl font-semibold -mt-2">Edit Venue</h1>
      </div>

      {/* Edit Genre data */}

      <div className="">
        <div className="m-4 text-start">
          <label className="block text-start mb-2 text-gray-500">
            Upload Image (jpg, png, svg, jpeg)
          </label>
          <label className="block text-start mb-2 text-gray-500">
            Dimensions-1024x812
          </label>
          <div className="flex"></div>
          <div className="flex items-center justify-start w-full">
            <label className="flex flex-col w-[300px] h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
              <div className="flex h-full items-center justify-center">
                <input
                  type="file"
                  id="productimg"
                  onChange={handleFileChange}
                  className="mt-1 p-2 w-full h-full border rounded-md opacity-0 absolute inset-0"
                />
                {selectedImage && (
                  <img
                    src={imageUrl}
                    alt="Selected Product Image"
                    className="object-cover w-full h-full"
                  />
                )}
                {!selectedImage && (
                  <div className="flex items-center flex-col">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-gray-400 group-hover:text-gray-600 absolute"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                    <BiSolidImageAdd size={42} className="text-gray-500  " />
                    <p className=" text-gray-500">Select Image</p>
                  </div>
                )}
              </div>
            </label>
          </div>
          <button
            type="button"
            onClick={handleAddClick}
            className="text-center md:w-[25%] ml-[2%] mt-4 mb-4 p-2 md:py-1.5 text-white bg-[#868686] text-xl"
          >
            Add new Image
          </button>
        </div>

        <div className="">
          <div className="">
            <div className="flex">
              {genreImage &&
                genreImage.map((image, index) => (
                  <div key={index} className="">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/${
                        image.image_path
                      }`}
                      alt={`Product Image ${index}`}
                      className="mt-2 w-[150px] h-[150px] px-3 relative object-cover"
                    />
                    {/* You can include delete or other actions if needed */}
                    <h1
                      onClick={() => handlerRemoveImage(image)}
                      className="mt-3 mb-2 text-center cursor-pointer py-2 bg-[#868686] ml-3 mr-2.5 rounded-3xl text-white"
                    >
                      Remove
                    </h1>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Data */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="">
          <div className="md:w-[70%] mt-[2%]">
            <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
              {/* Category Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Venue Name*
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="venueName"
                  value={values.venueName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.venueName && touched.venueName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.venueName}
                  </p>
                ) : null}
              </div>

              {/* Artist Description*/}
              <div className="md:col-span-2 mb-4">
                <label
                  htmlFor="venueDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Venue Description*
                </label>
                <textarea
                  id="venueDescription"
                  name="venueDescription"
                  value={values.venueDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.venueDescription && touched.venueDescription ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.venueDescription}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2 ">
                <label
                  htmlFor="artistDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Address*
                </label>
                <textarea
                  id="venueAddress"
                  name="venueAddress"
                  value={values.venueAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.venueAddress && touched.venueAddress ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.venueAddress}
                  </p>
                ) : null}
              </div>

              <div className="w-[100%] md:col-span-2">
                <EditAddress
                  StateIsoCode={venueData.StateIsoCode}
                  CityIsoCode={venueData.CityIsoCode}
                  // State value
                  // stateIsoCode={stateIsoCode}
                  setStateIsoCode={setStateIsoCode}
                  // stateName={stateName}
                  setStateName={setStateName}
                  // cityIsoCode={cityIsoCode}
                  setCityIsoCode={setCityIsoCode}
                  // cityName={cityName}
                  setCityName={setCityName}
                />
              </div>

              <div className="md:col-span-2 ">
                <label
                  htmlFor="artistDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                >
                  Map Location*
                </label>
                <textarea
                  id="venueMapLocation"
                  name="venueMapLocation"
                  value={values.venueMapLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.venueMapLocation && touched.venueMapLocation ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.venueMapLocation}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-[70%] flex md:justify-end items-end ">
            <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVenue;
