import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";

const UploadGalleryImg = ({ setGalleryImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  // On Change Image Handler
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   console.log(file);
  //   const maxSize = 500 * 1024;

  //   if (/\.(jpe?g|png)$/i.test(file.name)) {
  //     if (file.size < maxSize) {
  //       reader.onloadend = () => {
  //         setSelectedImage(file);
  //         setImageUrl(reader.result);
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

  // Add Carousel Images*
  const handleAddClick = () => {
    if (selectedImage === undefined || imageUrl === undefined) {
      toast.error("Please Select Image");
      return;
    }

    setImages([...images, imageUrl]);
    setAllImageFile([...allImageFile, selectedImage]);
    setGalleryImages([...allImageFile, selectedImage]);
    setSelectedImage();
    setImageUrl("");
  };

  // Remove Carousel Images*
  const handlerRemoveImage = (imageObj) => {
    const filteredImages = allImageFile.filter((image, i) => i !== imageObj);
    const filteredImages1 = images.filter((image, i) => i !== imageObj);
    setAllImageFile(filteredImages);
    setImages(filteredImages1);
  };

  return (
    <>
      <div className="relative">
        <h1 className="text-lg text-black font-semibold relative">
          Upload Gallery Images
        </h1>
        <div className="absolute  top-2 left-44 ml-3  flex flex-col items-center group">
          <MdOutlineInfo />
          <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
            <span className="relative w-96   leading-relaxed rounded-md z-10 p-4 text-xs  text-white whitespace-no-wrap bg-black shadow-lg">
              Share any images from past events to be displayed in the gallery.
            </span>
            <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
          </div>
        </div>
      </div>
      <div className="w-[100%] h-[450px] bg-grayshade mt-[1%]">
        <div className="w-full">
          <div className="flex items-center justify-start w-full ">
            <label className="flex flex-col w-[96%] mt-[2%] mx-auto h-[200px]  hover:border-gray-300 relative bg-Gray85">
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
          <div className="flex w-[95%] justify-between items-center mx-auto mt-[2%]">
            <div className="flex flex-col">
              <p className="py-2">Only PNG or JPG Files. 500 kb max size</p>
              <p>Dimensions - 612x408</p>
            </div>
            <button
              onClick={handleAddClick}
              type="button"
              className="mr-[2%] px-6 py-2 bg-strongBlue hover:bg-mildBlue text-white rounded-md "
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
                  className="object-cover relative w-28 h-28 mr-5"
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
    </>
  );
};

export default UploadGalleryImg;
