import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { artistCreationObjectSchema } from "../../../validation/YupValidation";
import { useFormik } from "formik";
import { artistEndpoints } from "../../../../../services/apis";
import axios from "axios";
import { BiSolidImageAdd } from "react-icons/bi";
import Select from "react-select";
import { priority } from "../../../../common/helper/Enum";
// import { utils } from "xlsx";

const CreateArtist = ({ setArtistCrationModal }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  const [ArtistPriority, setArtistPriority] = useState({
    value: 0,
    label: "0",
  });
  console.log(ArtistPriority?.value);
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
    validationSchema: artistCreationObjectSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      [...allImageFile].forEach((image) => {
        formData.append("Images", image);
      });
      formData.append("Name", values.artistName);
      formData.append("Email", values.artistemailId);
      formData.append("Description", values.artistDescription);
      formData.append("PhoneNo", values.artistPhoneNumber);

      if (ArtistPriority?.value) {
        formData.append("Priority", ArtistPriority?.value);
      } else {
        formData.append("Priority", 0);
      }

      if (allImageFile.length === 0) {
        toast.error("Please select at least one image");
        return;
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        let response = await axios.post(
          `${artistEndpoints.ARTIST_CREATE}`,
          formData
        );

        toast.success(response.data.message);
        resetForm();
        setImages([]);
        setTimeout(() => {
          setArtistCrationModal(false);
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
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   const maxSize = 500 * 1024;

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
  //     toast.error("Invalid I  mage File. Please select a JPEG or PNG image.");
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

  // Add images function
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

  // Remove Image Which was selected
  const handlerRemoveImage = (imageObj) => {
    const filteredImages = allImageFile.filter((image, i) => i !== imageObj);
    const filteredImages1 = images.filter((image, i) => i !== imageObj);
    setAllImageFile(filteredImages);
    setImages(filteredImages1);
  };

  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  return (
    <div>
      {/* {console.log(errors)} */}
      <Toaster />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div>
          {/* Upload Artist Images  */}
          <div className="mt-2 md:mt-0 text-start">
            <label className="block text-start mb-2 text-gray-500">
              Upload Image (jpg, png, svg, jpeg)
            </label>
            <label className="block text-start mb-2 text-gray-500">
              Dimensions-640x480
            </label>
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
            <div className="flex items-center justify-start w-full">
              <label className="flex flex-col w-[370px] h-[370px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
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
              className="text-center w-[35%] mt-4 mb-4  rounded-2xl py-2 text-white bg-[#868686] text-base md:text-2xl"
            >
              Add Image
            </button>
          </div>

          {/* Artist Name */}
          <div className="md:w-[70%] mt-[2%]">
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
                  styles={dropdownStyles}
                  options={priority.map((priority) => ({
                    value: priority.id,
                    label: priority.id,
                  }))}
                  value={ArtistPriority}
                  onChange={setArtistPriority}
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
                  type="text"
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
                  value={
                    values.artistDescription ? values.artistDescription : ""
                  }
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

export default CreateArtist;
