import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { banner, eventEndPoint } from "../../../../../services/apis";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { FaChevronLeft } from "react-icons/fa";
import Breadcrumb from "../../common/Breadcrumb";
import Select from "react-select";
import { useSelector } from "react-redux";
import { BiSolidImageAdd } from "react-icons/bi";

const BannerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState({});
  const [desktopBanner, setDesktopBanner] = useState();
  const [mobileBanner, setMobileBanner] = useState();

  const [selectedEventNames, setSelectedEventNames] = useState(null);
  const [eventNames, setEventNames] = useState([]);

  const [imageUrl, setImageUrl] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedImageMobile, setSelectedImageMobile] = useState(null);
  const [imageUrlMobile, setImageUrlMobile] = useState();

  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imagesMobile, setImagesMobile] = useState([]);
  const [allImageFileMobile, setAllImageFileMobile] = useState([]);

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  const adminuser = useSelector((store) => store.auth);

  useEffect(() => {
    getAllPublishedEventNames();
  }, []);

  const getAllPublishedEventNames = async () => {
    const payload = {
      AdminRole: adminuser.adminSignupData.AdminRole,
      user_id: adminuser.adminSignupData.user_id,
    };
    // console.log(payload);
    try {
      const FetchEventData = await axios.post(
        `${eventEndPoint.GET_ALL_PUBLISHED_EVENTS_DATA}`,
        payload
      );
      // console.log(FetchEventData.data.data);
      setEventNames(FetchEventData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBannerById();
  }, []);

  const getBannerById = async () => {
    const payload = {
      BannerSlider_id: id,
    };

    let response = await axios.post(`${banner.GET_BY_ID}`, payload);
    console.log(response.data.data);
    setDesktopBanner(response.data.data.DesktopbannerImage);
    setMobileBanner(response.data.data.MobilebannerImage);
    setSelectedEventNames(response.data.data.Event_id);
  };
  // console.log(selectedEventNames);

  // On Change Image Display
  // const handleFileChange = (e) => {
  //   const id = e.target.id;
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   const maxSize = 500 * 1024;

  //   if (/\.(jpe?g|png)$/i.test(file.name)) {
  //     if (file.size < maxSize) {
  //       reader.onloadend = () => {
  //         if (id === "desktop") {
  //           setSelectedImage(file);
  //           setImageUrl(reader.result);
  //           // setFieldValue("ProductOtherImage", file);
  //         } else {
  //           setSelectedImageMobile(file);
  //           setImageUrlMobile(reader.result);
  //           // setFieldValue("ProductOtherImage", file);
  //         }
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
    const id = e.target.id;
    const file = e.target.files[0];
    const reader = new FileReader();
    const maxSize = 500 * 1024;

    if (/\.(jpe?g|png)$/i.test(file.name)) {
      if (file.size < maxSize) {
        const img = new Image();

        img.onload = () => {
          // Validate dimensions
          const isDesktop = id === "desktop";
          const isMobile = id === "mobile";

          if (isDesktop && img.width === 2000 && img.height === 500) {
            reader.onloadend = () => {
              setSelectedImage(file);
              setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
          } else if (isMobile && img.width === 1920 && img.height === 1080) {
            reader.onloadend = () => {
              setSelectedImageMobile(file);
              setImageUrlMobile(reader.result);
            };
            reader.readAsDataURL(file);
          } else {
            toast.error(
              "Invalid image dimensions. Please upload an image with the correct dimensions."
            );
          }
        };

        img.src = URL.createObjectURL(file);
      } else {
        toast.error("Image size should be less than 500KB");
      }
    } else {
      toast.error("Invalid Image File. Please select a JPEG or PNG image.");
    }
  };

  // Add images function
  const handleAddClick = async () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    //  setImages([imageUrl]);
    //  setAllImageFile([selectedImage]);
    //  setSelectedImage();
    //  setImageUrl("");

    try {
      const formData = new FormData();

      formData.append("BannerSlider_id", id);
      formData.append("DesktopbannerImage", selectedImage);

      let response = await axios.post(`${banner.UPDATE_BY_ID}`, formData);

      toast.success(response.data.message);
      setSelectedImage();
      setImageUrl("");
      await getBannerById();
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
          // console.log(error.response);
          toast.error(data.message);
        }
      }
    }
  };

  const handleAddClickMobile = async () => {
    if (selectedImageMobile === undefined || imageUrlMobile === undefined) {
      toast.error("Please Select Image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("BannerSlider_id", id);
      formData.append("MobilebannerImage", selectedImageMobile);

      let response = await axios.post(`${banner.UPDATE_BY_ID}`, formData);

      toast.success(response.data.message);
      setSelectedImageMobile();
      setImageUrlMobile("");
      await getBannerById();
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
          // console.log(error.response);
          toast.error(data.message);
        }
      }
    }
  };

  // Remove Image Which was selected
  const handlerRemoveImage = () => {
    //  const filteredImages = allImageFile.filter((image, i) => i !== imageObj);
    //  const filteredImages1 = images.filter((image, i) => i !== imageObj);
    //  setAllImageFile(filteredImages);
    //  setImages(filteredImages1);
    setDesktopBanner(null);
  };

  const handlerRemoveImageMobile = () => {
    setMobileBanner(null);
  };

  //   const initialValues = {
  //     DesktopbannerImage: "",
  //     MobilebannerImage: "",
  //     Event_id: "",
  //   };

  //   const {
  //     values,
  //     errors,
  //     handleChange,
  //     handleSubmit,
  //     touched,
  //     handleBlur,
  //     setFieldValue,
  //     resetForm,
  //   } = useFormik({
  //     initialValues,
  //     // validationSchema: artistCreationObjectSchema,
  //     onSubmit: async (values) => {
  //       const formData = new FormData();

  //       if (allImageFile.length === 0 && allImageFileMobile.length === 0) {
  //         toast.error("Please select at least one image.");
  //         return;
  //       }

  //       [...allImageFile].forEach((image) => {
  //         formData.append("DesktopbannerImage", image);
  //       });
  //       [...allImageFileMobile].forEach((image) => {
  //         formData.append("MobilebannerImage", image);
  //       });
  //       // formData.append("Name", values.artistName);
  //       // formData.append("Email", values.artistemailId);
  //       // formData.append("Description", values.artistDescription);
  //       // formData.append("PhoneNo", values.artistPhoneNumber);

  //       // formData.append("Event_id)

  //       for (let [key, value] of formData.entries()) {
  //         console.log(`${key}:`, value);
  //       }

  //       try {
  //         let response = await axios.post(`${banner.CREATE_BANNER}`, formData);

  //         toast.success(response.data.message);
  //         resetForm();
  //         setImages([]);
  //         setTimeout(() => {
  //           setArtistCrationModal(false);
  //         }, 1000);
  //       } catch (error) {
  //         if (error.response) {
  //           const { status, data } = error.response;

  //           if (
  //             status === 404 ||
  //             status === 403 ||
  //             status === 500 ||
  //             status === 302 ||
  //             status === 409 ||
  //             status === 401 ||
  //             status === 400
  //           ) {
  //             console.log(error.response);
  //             toast.error(data.message);
  //           }
  //         }
  //       }
  //     },
  //   });

  return (
    <>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Banner"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/banner")}
            className={`w-[15%] py-2 
               "border-2 border-black text-Gray85 "
          flex justify-center items-center text-xl`}
          >
            <span className="md:mr-2">
              <FaChevronLeft size={23} />
            </span>{" "}
            Back
          </button>
        </div>
        <h1 className="md:text-3xl text-xl font-semibold -mt-2">Edit Banner</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // if (selectedImage.length === null) {
          //   toast.error("Please select at least one desktop image.");
          //   return;
          // }

          // if (selectedImageMobile.length === null) {
          //   toast.error("Please select at least one mobile image.");
          //   return;
          // }
          navigate("/superAdmin/dashboard/banner");
        }}
      >
        <div className="flex md:flex-row flex-col gap-8 md:gap-52">
          <div className="">
            <div className="m-4 text-start">
              <label className="block font-bold text-start mb-2 text-gray-500">
                Desktop Image (jpg, png, svg, jpeg)
              </label>
              <label className="block text-start mb-2 text-gray-500">
                Dimensions-2000x500
              </label>

              <div className="flex items-center justify-start w-full ">
                <label className="flex flex-col w-[300px] h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
                  <div className="flex h-full items-center justify-center">
                    <input
                      type="file"
                      id="desktop"
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
                        <BiSolidImageAdd
                          size={42}
                          className="text-gray-500  "
                        />
                        <p className=" text-gray-500">Select Image</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddClick}
                className="text-center  ml-[2%] mt-4 mb-4  p-2 text-white bg-[#868686] text-xl"
              >
                Upload Image
              </button>
            </div>
            <div className="">
              <div className="">
                <div className="">
                  {desktopBanner && (
                    <div className="">
                      <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_BASE_URL
                        }/${desktopBanner}`}
                        alt="desktop banner"
                        className="mt-2 w-72 h-52 ml-6  relative object-cover"
                      />
                      {/* You can include delete or other actions if needed */}
                      <h1
                        onClick={handlerRemoveImage}
                        className="mt-3 mb-2 text-center cursor-pointer py-2 bg-[#868686] ml-3 mr-2.5 rounded-3xl text-white"
                      >
                        Remove
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* mobile banner */}
          <div className="">
            <div className="m-4 text-start">
              <label className="inline-block font-bold text-start mb-2 text-gray-500">
                Mobile Image (jpg, png, svg, jpeg)
              </label>
              <label className="inline-block text-start mb-2 text-gray-500">
                Dimensions-1920x1080
              </label>

              <div className="flex items-center justify-start w-full">
                <label className="flex flex-col w-[300px] h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
                  <div className="flex h-full items-center justify-center">
                    <input
                      type="file"
                      id="mobile"
                      onChange={handleFileChange}
                      className="mt-1 p-2 w-full h-full border rounded-md opacity-0 absolute inset-0"
                    />
                    {selectedImageMobile && (
                      <img
                        src={imageUrlMobile}
                        alt="Selected Product Image"
                        className="object-cover w-full h-full"
                      />
                    )}
                    {!selectedImageMobile && (
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
                        <BiSolidImageAdd
                          size={42}
                          className="text-gray-500  "
                        />
                        <p className=" text-gray-500">Select Image</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddClickMobile}
                className="text-center p-2 ml-[2%] mt-4 mb-4  text-white bg-[#868686] text-xl"
              >
                Upload Image
              </button>
            </div>
            <div className="">
              <div className="">
                <div className="flex">
                  {mobileBanner && (
                    <div className="">
                      <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_BASE_URL
                        }/${mobileBanner}`}
                        alt="desktop banner"
                        className="mt-2 w-72 h-52 ml-6  relative object-cover"
                      />
                      {/* You can include delete or other actions if needed */}
                      <h1
                        onClick={handlerRemoveImageMobile}
                        className="mt-3 mb-2 text-center cursor-pointer py-2 bg-[#868686] ml-3 mr-2.5 rounded-3xl text-white"
                      >
                        Remove
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full ml-4 mt-2 gap-x-5 justify-between">
          <div className="md:w-[50%]">
            <label htmlFor="">Event Name</label>
            <Select
              styles={dropdownStyles}
              options={eventNames.map((name) => ({
                value: name._id,
                label: name.EventName,
              }))}
              value={
                eventNames.find((event) => event._id === selectedEventNames)
                  ? {
                      value: eventNames.find(
                        (event) => event._id === selectedEventNames
                      )._id,
                      label: eventNames.find(
                        (event) => event._id === selectedEventNames
                      ).EventName,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setSelectedEventNames(selectedOption?.value);
              }}
              placeholder="Select Event names"
              isClearable
            />
          </div>
        </div>
        <div className="w-[70%] flex md:justify-end items-end md:mt-0 mt-4 ">
          <button className="px-5 py-2 text-white bg-Gray40" type="submit ">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default BannerEdit;
