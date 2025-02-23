import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { artistEndpoints } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { artistCreationObjectSchema } from "../../../validation/YupValidation";
import { BiSolidImageAdd } from "react-icons/bi";
import Select from "react-select";
import { priority } from "../../../../common/helper/Enum";

const EditArtist = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [artistData, setArtistData] = useState({});
  const [loading, setLoading] = useState(true);
  const [artistImage, setArtistImage] = useState([]);

  // Image section

  const [imageUrl, setImageUrl] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };
  useEffect(() => {
    getArtistDataById();
  }, []);

  //   Fetch Artist Data by Id
  const getArtistDataById = async () => {
    try {
      const payload = {
        artist_id: _id,
      };

      let response = await axios.post(
        `${artistEndpoints.ARTIST_GET_BY_ID}`,
        payload
      );

      setArtistData(response.data.data);
      setArtistImage(response.data.data.Images);
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
          console.log(error.message);
          toast.error(data.message);
          setLoading(false);
        }
      }
    }
  };

  const initialValues = loading
    ? {
        artistName: "",
        artistemailId: "",
        artistDescription: "",
        artistPhoneNumber: "",
        artistPriority: "",
      }
    : {
        artistName: artistData?.Name,
        artistemailId: artistData?.Email,
        artistPhoneNumber: artistData?.PhoneNo,
        artistDescription: artistData?.Description,
        artistImage: artistData?.Image,
        artistPriority: artistData?.Priority,
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
    validationSchema: artistCreationObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        artist_id: _id,
        Name: values.artistName,
        Email: values.artistemailId,
        Description: values.artistDescription,
        PhoneNo: values.artistPhoneNumber,
        Priority: values.artistPriority,
      };

      if (values.artistPriority === null) {
        payload.Priority = 0;
      }
      if (artistImage.length === 0) {
        toast.error("Please select at least one image to display");
        return;
      }
      console.log(payload);

      try {
        let response = await axios.post(
          `${artistEndpoints.ARTIST_DATA_UPDATED}`,
          payload
        );
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/superAdmin/dashboard/artist");
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

  //   // console.log("File ==========> ", file);
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
          if (img.width !== 640 || img.height !== 480) {
            toast.error("Image dimensions must be 640x480.");
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

  //   Add Artist Image
  const handleAddClick = async () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    //  setAllImageFile(selectedImage)

    try {
      const formData = new FormData();

      formData.append("artist_id", _id);
      formData.append("ArtistImage", selectedImage);

      let response = await axios.post(
        `${artistEndpoints.ARTIST_UPLOAD_IMAGE}`,
        formData
      );

      toast.success("Artist Image uploaded successfully");
      // console.log(response.data);
      setArtistImage(response.data.data);
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
          // console.log(error.response);
          toast.error(data.message);
        }
      }
    }
  };

  console.log("priority", values.artistPriority);
  //   Remove Artist Image
  const handlerRemoveImage = async (imageData) => {
    try {
      // console.log(imageData);

      const payload = {
        artist_id: _id,
        image_id: imageData._id,
      };

      let response = await axios.post(
        `${artistEndpoints.ARTIST_IMAGE_REMOVE}`,
        payload
      );

      toast.success(response.data.message);

      const fillteredProducts = artistImage.filter(
        (artistImage) => artistImage._id !== imageData._id
      );
      setArtistImage(fillteredProducts);
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

  //Search Artist By Name

  return (
    <div>
      <Toaster />
      {/* {console.log(errors)} */}
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Artist"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/artist")}
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
        <h1 className="text-3xl font-semibold -mt-2">Edit Artist</h1>
      </div>

      {/* Edit Artist data */}

      <div className="">
        <div className="m-4 text-start">
          <label className="block text-start mb-2 text-gray-500">
            Upload Image (jpg, png, svg, jpeg)
          </label>
          <label className="block text-start mb-2 text-gray-500">
            Dimensions-640x480
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
            className="text-center w-[25%] ml-[2%] mt-4 mb-4  py-1.5 text-white bg-[#868686] text-xl"
          >
            Upload Image
          </button>
        </div>

        <div className="">
          <div className="">
            <div className="flex">
              {artistImage &&
                artistImage.map((image, index) => (
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
          <div className="md:w-[70%] w-full mt-[2%]">
            <div className="md:w-[70%] grid gap-6 mb-6 md:grid-cols-2">
              {/* First Name Input Field  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Artist Name*
                </label>
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={values.artistName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {errors.artistName && touched.artistName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.artistName}
                  </p>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Priority
                </label>
                <Select
                  id="artistPriority"
                  name="artistPriority"
                  styles={dropdownStyles}
                  options={priority.map((priority) => ({
                    value: priority.id,
                    label: priority.id,
                  }))}
                  value={
                    priority.find((p) => p.id === values?.artistPriority)
                      ? {
                          label: priority.find(
                            (p) => p.id === values.artistPriority
                          ).id,
                          value: values.artistPriority,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFieldValue(
                      "artistPriority",
                      selectedOption?.value || null
                    )
                  }
                  isClearable
                  placeholder="Select Artist Priority"
                />
              </div>

              {/* Email ID Artist  */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Email
                </label>
                <input
                  type="email"
                  id="artistemailId"
                  name="artistemailId"
                  value={values.artistemailId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {/* {errors.artistemailId && touched.artistemailId ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.artistemailId}
                  </p>
                ) : null} */}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Phone No.
                </label>
                <input
                  type="number"
                  id="artistPhoneNumber"
                  name="artistPhoneNumber"
                  value={values.artistPhoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {/* {errors.artistPhoneNumber && touched.artistPhoneNumber ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.artistPhoneNumber}
                  </p>
                ) : null} */}
              </div>

              {/* Artist Description*/}
              <div className="md:col-span-2 mb-4">
                <label
                  htmlFor="artistDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Artist Description
                </label>
                <textarea
                  id="artistDescription"
                  name="artistDescription"
                  value={values.artistDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                />
                {/* {errors.artistDescription && touched.artistDescription ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.artistDescription}
                  </p>
                ) : null} */}
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

export default EditArtist;
