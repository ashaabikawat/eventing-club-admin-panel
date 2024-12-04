import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useFormik } from "formik";
import { venueObjectSchema } from "../../../../validation/YupValidation";
import { venueEndPoint } from "../../../../../../services/apis";
import AddAddress from "../../../../../common/AddAddress";
import { FaWindowClose } from "react-icons/fa";

const CreateVenueModal = ({ setCreateNewVenue, setVenueData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  // Address State
  const [stateIsoCode, setStateIsoCode] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityIsoCode, setCityIsoCode] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [country, setCountry] = useState("India");
  const [countryIso2Code, setCountryIso2Code] = useState("IN");

  const [getallData, setGetAllData] = useState(false);

  const initialValues = {
    venueName: "",
    venueDescription: "",
    venueAddress: "",
    venueMapLocation: "",
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: venueObjectSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      [...allImageFile].forEach((image) => {
        formData.append("Images", image);
      });
      formData.append("Name", values.venueName);
      formData.append("Description", values.venueDescription);
      formData.append("Address", values.venueAddress);
      formData.append("Map_Location", values.venueMapLocation);
      formData.append("Country", country);
      formData.append("CountryIsoCode", countryIso2Code);
      formData.append("State", stateName);
      formData.append("StateIsoCode", stateIsoCode);
      formData.append("City", cityName);
      formData.append("CityIsoCode", cityIsoCode);

      try {
        let response = await axios.post(
          `${venueEndPoint.VENUE_CREATION_URL}`,
          formData
        );

        toast.success(response.data.message);
        setGetAllData(true);
        resetForm();
        setImages([]);
        setCreateNewVenue(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const maxSize = 500 * 1024;

    if (/\.(jpe?g|png)$/i.test(file.name)) {
      if (file.size < maxSize) {
        reader.onloadend = () => {
          setSelectedImage(file);
          setImageUrl(reader.result);
          setFieldValue("ProductOtherImage", file);
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      } else {
        toast.error("Image size should be less than 500KB");
      }
    } else {
      toast.error("Invalid Image File. Please select a JPEG or PNG image.");
    }
  };

  const handleAddClick = () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    setImages([...images, imageUrl]);
    setAllImageFile([...allImageFile, selectedImage]);
    setSelectedImage();
    setImageUrl("");
  };

  const handlerRemoveImage = (imageObj) => {
    const filteredImages = allImageFile.filter((image, i) => i !== imageObj);
    const filteredImages1 = images.filter((image, i) => i !== imageObj);
    setAllImageFile(filteredImages);
    setImages(filteredImages1);
  };

  const handlerSaveClick = () => {
    handleSubmit();
  };

  useEffect(() => {
    if (getallData) {
      getAllVenueData();
    }
  }, [getallData]);

  const getAllVenueData = async () => {
    try {
      const FetchVenueData = await axios.get(
        `${venueEndPoint.ALL_VENUE_DATA_LIST}`
      );

      console.log("FetchVenueData", FetchVenueData.data.data);
      setVenueData(FetchVenueData.data.data);
      setCreateNewVenue(false);
      // setVenueData(FetchVenueData.data.data);
      // setOriginalData(FetchVenueData.data.data);
      // setLoading(false);
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
          // setLoading(false);
        }
      }
    }
  };

  const handlerModal = () => {
    setCreateNewVenue(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-start justify-center z-50 overflow-y-scroll">
      <div className="bg-white p-4 rounded-md  md:w-[50%]">
        <div className="">
          <Toaster />
          <div className="flex justify-between mt-[2%]">
            <p className="font-bold text-lg">Upload Carousel Images*</p>
            <p
              onClick={() => handlerModal()}
              className="flex justify-center cursor-pointer items-center"
            >
              <FaWindowClose size={30} />
            </p>
          </div>
          <p className="text-Gray85 font-normal">
            First image will be used for thumbnail
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div className="w-[90%] h-[500px] bg-grayshade flex flex-col justify-start pt-4 mx-auto">
              <div className="w-full">
                <div className="flex items-center justify-start w-full ">
                  <label className="flex flex-col w-[96%]  mx-auto h-[250px]  hover:border-gray-300 relative bg-Gray85">
                    <div className="flex h-full items-center justify-center">
                      <input
                        type="file"
                        id="productimg"
                        onChange={handleFileChange}
                        className="mt-1 p-2 w-[70%] h-full border rounded-md opacity-0 absolute inset-0"
                      />
                      {selectedImage && (
                        <img
                          src={imageUrl}
                          alt="Selected Product Image"
                          className="object-fill w-full h-full"
                        />
                      )}
                      {!selectedImage && (
                        <>
                          <svg
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
                          </svg>
                          <p className="mt-20 text-gray-500">Select Image</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                <div className="flex w-[95%] justify-between mx-auto mt-[2%]">
                  <p className="py-2">Only PNG or JPG Files. 500 kb max size</p>
                  <button
                    onClick={handleAddClick}
                    type="button"
                    className="mr-[2%] px-6 py-2 bg-Gray85"
                  >
                    upload Image
                  </button>
                </div>
                <div className="flex mt-4 w-[96%] mx-auto ">
                  {images.map((image, index) => (
                    <div key={index} className="flex relative mb-4 ">
                      <img
                        src={image}
                        alt={`Selected Product Image ${index + 1}`}
                        className="object-cover relative w-36 h-36 mr-5"
                      />
                      <h1
                        onClick={() => handlerRemoveImage(index)}
                        className="absolute w-[100%] -mt-3   cursor-pointer flex justify-end items-end "
                      >
                        <span>
                          <IoMdCloseCircleOutline
                            size={25}
                            className=""
                            color="#868686"
                          />
                        </span>
                      </h1>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-[90%] mt-[2%] mx-auto">
              <div className="w-full grid gap-6 mb-6 md:grid-cols-2">
                {/* First Name Input Field  */}
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

                {/* venue Description*/}
                <div className="md:col-span-2">
                  <label
                    htmlFor="artistDescription"
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
                    rows={6}
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

                <div className=" md:col-span-2  w-full">
                  <AddAddress
                    stateIsoCode={stateIsoCode}
                    setStateIsoCode={setStateIsoCode}
                    stateName={stateName}
                    setStateName={setStateName}
                    cityIsoCode={cityIsoCode}
                    setCityIsoCode={setCityIsoCode}
                    cityName={cityName}
                    setCityName={setCityName}
                  />
                </div>

                {/* Map Location  */}

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
            <div className="w-[94%] flex justify-end items-end ">
              <button
                onClick={() => handlerSaveClick()}
                className="px-5 py-2 text-white bg-Gray40"
                type="button"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVenueModal;
