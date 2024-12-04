import React, { useState } from "react";
import { eventEndPoint } from "../../../../../../services/apis";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { EventStatus } from "../../../../../common/helper/Enum";
import { BiSolidImageAdd } from "react-icons/bi";

const EditCarouselImageOrganizer = ({
  eventCarouselImages,
  setEventCarouselImages,
  eventStatusProps,
}) => {
  const [imageUrl, setImageUrl] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const { _id } = useParams();

  // Image Selection
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   const maxSize = 500 * 1024;
  //   if (/\.(jpe?g|png)$/i.test(file.name)) {
  //     if (file.size < maxSize) {
  //     }
  //     reader.onloadend = () => {
  //       setSelectedImage(file);
  //       setImageUrl(reader.result);
  //     };

  //     if (file) {
  //       reader.readAsDataURL(file);
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
          if (img.width !== 612 || img.height !== 408) {
            toast.error("Image dimensions must be 612x408.");
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

  // Add Category Image
  const handleAddClick = async () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("event_id", _id);
      formData.append("CarouselImages", selectedImage);

      let response = await axios.post(
        `${eventEndPoint.UPDATE_EVENT_CAROUSEL_IMAGE}`,
        formData
      );

      toast.success("Event Carousel Image uploaded successfully");
      setEventCarouselImages(response.data.data);
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
          toast.error(data.message);
        }
      }
    }
  };

  // Remove Category Image
  const handlerRemoveImage = async (imageData) => {
    try {
      const payload = {
        event_id: _id,
        image_id: imageData._id,
      };

      let response = await axios.post(
        `${eventEndPoint.DELETE_EVENT_CAROUSEL_IMAGE}`,
        payload
      );

      toast.success(response.data.message);

      const filteredProducts = eventCarouselImages.filter(
        (eventCarouselImages) => eventCarouselImages._id !== imageData._id
      );
      setEventCarouselImages(filteredProducts);
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
          toast.error(data.message);
        }
      }
    }
  };

  return (
    <div>
      <Toaster />
      <div className="">
        <div className="m-4 text-start">
          <label className="inline-block text-start mb-2 text-gray-500">
            Upload Image (jpg, png, svg, jpeg)
          </label>
          <div className="flex"></div>
          <div className="flex items-center justify-start w-full">
            <label className="flex flex-col w-[300px] h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 relative">
              <div className="flex h-full items-center justify-center">
                <input
                  type="file"
                  id="ProductOtherImage"
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
          {/* Conditional rendering for the Add button */}
          {(eventStatusProps === 1 || eventStatusProps === 4) && (
            <button
              type="button"
              onClick={handleAddClick}
              className="text-center w-[25%] ml-[2%] mt-4 mb-4 py-1.5 text-white bg-[#868686] text-xl"
            >
              Add new Image
            </button>
          )}
        </div>

        <div className="">
          <div className="">
            <div className="flex">
              {eventCarouselImages &&
                eventCarouselImages.map((image, index) => (
                  <div key={index} className="">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/${
                        image.image_path
                      }`}
                      alt={`Product Image ${index}`}
                      className="mt-2 w-[150px] h-[150px] px-3 relative object-cover"
                    />
                    {/* You can include delete or other actions if needed */}
                    {(eventStatusProps === 1 || eventStatusProps === 4) && (
                      <h1
                        onClick={() => handlerRemoveImage(image)}
                        className="mt-3 mb-2 text-center cursor-pointer py-2 bg-[#868686] ml-3 mr-2.5 rounded-3xl text-white"
                      >
                        Remove
                      </h1>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCarouselImageOrganizer;
