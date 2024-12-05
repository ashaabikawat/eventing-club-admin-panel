import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import { genreEndPoint } from "../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { genreObjectSchema } from "../../../validation/YupValidation";
import { BiSolidImageAdd } from "react-icons/bi";

const EditGenre = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [genreData, setGenreData] = useState({});
  const [loading, setLoading] = useState(true);
  const [genreImage, setGenreImage] = useState([]);

  // Image section

  const [imageUrl, setImageUrl] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getGenreDataById();
  }, []);

  //   Fetch Artist Data by Id
  const getGenreDataById = async () => {
    try {
      const payload = {
        genre_id: _id,
      };

      let response = await axios.post(
        `${genreEndPoint.GENRE_DATA_BY_ID_URL}`,
        payload
      );

      setGenreData(response.data.data);
      setGenreImage(response.data.data.Images);
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
        genreName: "",
        genreDescription: "",
      }
    : {
        genreName: genreData?.Name,
        genreDescription: genreData?.Description,
        genreImage: genreData?.Image,
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
    validationSchema: genreObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        genre_id: _id,
        Name: values.genreName,
        Description: values.genreDescription,
      };

      if (genreImage.length === 0) {
        toast.error("Please select at least one image to display");
        return;
      }

      try {
        let response = await axios.post(
          `${genreEndPoint.GENRE_DATA_UPDATED}`,
          payload
        );

        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/superAdmin/dashboard/genre");
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

      formData.append("genre_id", _id);
      formData.append("GenreImage", selectedImage);

      let response = await axios.post(
        `${genreEndPoint.GENRE_UPLOAD_IMAGE}`,
        formData
      );

      toast.success("Genre Image uploaded successfully");
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
        genre_id: _id,
        image_id: imageData._id,
      };

      let response = await axios.post(
        `${genreEndPoint.GENRE_IMAGE_REMOVE}`,
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

  return (
    <div>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Genre"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/genre")}
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
        <h1 className="md:text-3xl text-2xl font-semibold -mt-2">Edit Genre</h1>
      </div>

      {/* Edit Genre data */}

      <div className="">
        <div className="m-4 text-start">
          <label className="inline-block text-start mb-2 text-gray-500">
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
            className="text-center w-[25%] ml-[2%] mt-4 mb-4  py-1.5 text-white bg-[#868686] text-xl"
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
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Genre Name*
                </label>
                <input
                  type="text"
                  id="genreName"
                  name="genreName"
                  value={values.genreName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                {errors.genreName && touched.genreName ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.genreName}
                  </p>
                ) : null}
              </div>

              {/* Artist Description*/}
              <div className="md:col-span-2 mb-4">
                <label
                  htmlFor="artistDescription"
                  className="block mb-2 text-start text-sm font-medium text-gray-900 "
                >
                  Genre Description
                </label>
                <textarea
                  id="genreDescription"
                  name="genreDescription"
                  value={values.genreDescription ? values.genreDescription : ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                />
                {/* {errors.genreDescription && touched.genreDescription ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.genreDescription}
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

export default EditGenre;
