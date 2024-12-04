import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { artistCreationObjectSchema } from "../../../../validation/YupValidation";
import { useFormik } from "formik";
import { artistEndpoints } from "../../../../../../services/apis";
import axios from "axios";
import { FaWindowClose } from "react-icons/fa";

const CreateArtistModal = ({ setShowCreateArtistModal, onNewCategorie }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  const initialValues = {
    artistName: "",
    artistemailId: "",
    artistDescription: "",
    artistPhoneNumber: "",
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

      try {
        let response = await axios.post(
          `${artistEndpoints.ARTIST_CREATE}`,
          formData
        );

        toast.success(response.data.message);
        onNewCategorie(response.data.data);
        resetForm();
        setImages([]);
        setShowCreateArtistModal(false);
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

  const handlerModal = () => {
    setShowCreateArtistModal(false);
  };

  const handlerSaveClick = () => {
    handleSubmit();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh]  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4  rounded-md  md:w-[50%]">
        <div className="w-[98%] flex justify-between mt-[30%]">
          <p className="text-3xl pl-2 text-black font-bold mb-2">
            Create Artist
          </p>

          <p
            onClick={() => handlerModal()}
            className="flex justify-center cursor-pointer items-center"
          >
            <FaWindowClose size={30} />
          </p>
        </div>
        <div>
          <Toaster />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div>
              {/* Upload Artist Images  */}
              <div className="w-[96%] mx-auto h-[400px] bg-grayshade mt-[1%]">
                <div className="w-full">
                  <div className="flex items-center justify-start w-full ">
                    <label className="flex flex-col w-[96%] mt-[2%] mx-auto h-[200px]  hover:border-gray-300 relative bg-Gray85">
                      <div className="flex h-[90%] items-center justify-center">
                        <input
                          type="file"
                          id="productimg"
                          onChange={handleFileChange}
                          className="mt-1 p-2 w-[70%] h-[100%] border rounded-md opacity-0 absolute inset-0"
                        />
                        {selectedImage && (
                          <img
                            src={imageUrl}
                            alt="Selected Product Image"
                            className="object-fill w-full h-[110%]"
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
                    <p className="py-2">
                      Only PNG or JPG Files. 500 kb max size
                    </p>
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
                          className="object-cover relative w-24 h-24 mr-5"
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

              {/* Artist Name */}
              <div className="w-[96%] mx-auto mt-[2%]">
                <div className="w-full grid gap-6 mb-2    md:grid-cols-2">
                  {/* First Name Input Field  */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {errors.artistName && touched.artistName ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.artistName}
                      </p>
                    ) : null}
                  </div>

                  {/* Email ID Artist  */}
                  <div className="md:col-span-1">
                    <label
                      htmlFor="name"
                      className="block text-start text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      id="artistemailId"
                      name="artistemailId"
                      value={values.artistemailId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {errors.artistemailId && touched.artistemailId ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.artistemailId}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-1">
                    <label
                      htmlFor="name"
                      className="block text-start text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone No. 1
                    </label>
                    <input
                      type="text"
                      id="artistPhoneNumber"
                      name="artistPhoneNumber"
                      value={values.artistPhoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {errors.artistPhoneNumber && touched.artistPhoneNumber ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.artistPhoneNumber}
                      </p>
                    ) : null}
                  </div>

                  {/* Artist Description*/}
                  <div className="md:col-span-2 mb-4">
                    <label
                      htmlFor="artistDescription"
                      className="block mb-2 text-start text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Artist Description
                    </label>
                    <textarea
                      id="artistDescription"
                      name="artistDescription"
                      value={values.artistDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {/* {errors.artistDescription && touched.artistDescription ? (
                      <p className="font-Marcellus text-start text-red-900">
                        {errors.artistDescription}
                      </p>
                    ) : null} */}
                  </div>
                </div>
              </div>

              <div className="w-[96%] mx-auto flex justify-end items-end ">
                <button
                  className="px-5 py-2 text-white bg-Gray40"
                  type="button"
                  onClick={() => handlerSaveClick()}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArtistModal;
