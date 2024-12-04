import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { banner, eventEndPoint } from "../../../../../services/apis";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Select from "react-select";
import axios from "axios";
import { BiSolidImageAdd } from "react-icons/bi";

const CreateBanner = ({ setBannerCreation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [selectedImageMobile, setSelectedImageMobile] = useState(null);
  const [imagesMobile, setImagesMobile] = useState([]);
  const [allImageFileMobile, setAllImageFileMobile] = useState([]);
  const [imageUrlMobile, setImageUrlMobile] = useState();

  const [selectedEventNames, setSelectedEventNames] = useState(null);
  const [eventNames, setEventNames] = useState([]);

  // console.log(allImageFile);

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

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  const initialValues = {
    artistName: "",
    artistemailId: "",
    artistPhoneNumber: "",
    artistDescription: "",
  };

  // After Fill the Form Api Call
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
    // validationSchema: artistCreationObjectSchema,
    onSubmit: async (values) => {
      console.log("form submitted");
      const formData = new FormData();

      if (allImageFile.length === 0 && allImageFileMobile.length === 0) {
        toast.error("Please select at least one image.");
        return;
      }

      [...allImageFile].forEach((image) => {
        formData.append("DesktopbannerImage", image);
      });
      [...allImageFileMobile].forEach((image) => {
        formData.append("MobilebannerImage", image);
      });

      if (allImageFile.length === 0) {
        toast.error("Please select at least one desktop image.");
        return;
      }

      if (allImageFileMobile.length === 0) {
        toast.error("Please select at least one mobile image.");
        return;
      }
      // formData.append("Name", values.artistName);
      // formData.append("Email", values.artistemailId);
      // formData.append("Description", values.artistDescription);
      // formData.append("PhoneNo", values.artistPhoneNumber);
      if (selectedEventNames) {
        formData.append("Event_id", selectedEventNames.value);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        let response = await axios.post(`${banner.CREATE_BANNER}`, formData);

        toast.success(response.data.message);

        resetForm();
        setImages([]);
        setImagesMobile([]);
        setTimeout(() => {
          setBannerCreation(false);
        }, 1000);
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
  const handleAddClick = () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    setImages([imageUrl]);
    setAllImageFile([selectedImage]);
    setSelectedImage();
    setImageUrl("");
  };
  const handleAddClickMobile = () => {
    if (selectedImageMobile === undefined || imageUrlMobile === undefined) {
      toast.error("Please Select Image");
      return;
    }

    setImagesMobile([imageUrlMobile]);
    setAllImageFileMobile([selectedImageMobile]);
    setSelectedImageMobile();
    setImageUrlMobile("");
  };

  // Remove Image Which was selected
  const handlerRemoveImage = (imageObj) => {
    const filteredImages = allImageFile.filter((image, i) => i !== imageObj);
    const filteredImages1 = images.filter((image, i) => i !== imageObj);
    setAllImageFile(filteredImages);
    setImages(filteredImages1);
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit}>
        <div className="flex md:flex-row flex-col md:gap-20">
          {/* desktop banner */}
          <div className="m-4 text-start">
            <label className="block font-bold text-start mb-2 text-gray-500">
              Desktop Image (jpg, png, svg, jpeg)
            </label>
            <label className="block text-start mb-2 text-gray-500">
              Dimensions-2000x500
            </label>

            <div className="flex items-center justify-start w-full">
              <label className="flex flex-col w-[370px] h-[370px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
                <div className="flex h-full items-center justify-center">
                  <input
                    type="file"
                    // id="productimg"
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
              className="text-center w-[35%] mt-4 mb-4  rounded-2xl py-2 text-white bg-[#868686] text-lg md:text-2xl"
            >
              Add Image
            </button>
            <div className="flex">
              {images.map((image, index) => (
                <div key={index} className="flex relative mb-4 ">
                  <img
                    src={image}
                    alt={`Selected Product Image ${index + 1}`}
                    className="object-cover relative w-36 h-36 mr-5"
                  />
                  <h1
                    onClick={() => handlerRemoveImage(index)}
                    className="absolute w-[82%] mt-1.5  cursor-pointer flex justify-end items-end "
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

          {/* mobile banner */}
          <div className="m-4 text-start">
            <label className="block font-bold text-start mb-2 text-gray-500">
              Mobile Image (jpg, png, svg, jpeg)
            </label>
            <label className="block text-start mb-2 text-gray-500">
              Dimensions-1920x1080
            </label>

            <div className="flex items-center justify-start w-full">
              <label className="flex flex-col w-[370px] h-[370px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
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
                      <BiSolidImageAdd size={42} className="text-gray-500  " />
                      <p className=" text-gray-500">Select Image</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddClickMobile}
              className="text-center w-[35%] mt-4 mb-4  rounded-2xl py-2 text-white bg-[#868686] text-lg md:text-2xl"
            >
              Add Image
            </button>
            <div className="flex">
              {imagesMobile.map((image, index) => (
                <div key={index} className="flex relative mb-4 ">
                  <img
                    src={image}
                    alt={`Selected Product Image ${index + 1}`}
                    className="object-cover relative w-36 h-36 mr-5"
                  />
                  <h1
                    onClick={() => handlerRemoveImage(index)}
                    className="absolute w-[82%] mt-1.5  cursor-pointer flex justify-end items-end "
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
        <div className="flex w-full ml-4 mt-2 gap-x-5 justify-between">
          <div className="md:w-[50%]">
            <label htmlFor="">Event Name</label>
            <Select
              styles={dropdownStyles}
              options={eventNames.map((name) => ({
                value: name._id,
                label: name.EventName,
              }))}
              value={selectedEventNames}
              onChange={setSelectedEventNames}
              placeholder="Select Event names"
              isClearable
            />
          </div>
        </div>

        <div className="w-[70%] flex md:justify-end items-end md:mt-0 mt-4">
          <button className="px-5 py-2 text-white bg-Gray40" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBanner;
