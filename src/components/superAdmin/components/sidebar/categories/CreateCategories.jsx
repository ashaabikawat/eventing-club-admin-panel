import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import { useFormik } from "formik";
import { categoriesObjectSchema } from "../../../validation/YupValidation";
import { categorieEndPoint } from "../../../../../services/apis";
import { BiSolidImageAdd } from "react-icons/bi";
import { priority } from "../../../../common/helper/Enum";

const CreateCategories = ({ setcategorieCrationModal }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [categoryPriority, setCategoryPriority] = useState({
    value: 0,
    label: "0",
  });

  const initialValues = {
    categorieName: "",
    categorieDescription: "",
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
    validationSchema: categoriesObjectSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      [...allImageFile].forEach((image) => {
        formData.append("CategoryImages", image);
      });
      formData.append("Name", values.categorieName);
      formData.append("Description", values.categorieDescription);

      if (categoryPriority?.value) {
        formData.append("Priority", categoryPriority?.value);
      } else {
        formData.append("Priority", 0);
      }

      try {
        let response = await axios.post(
          `${categorieEndPoint.CATEGORIE_CREATION_URL}`,
          formData
        );

        toast.success(response.data.message);
        resetForm();
        setImages([]);
        setcategorieCrationModal(false);
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
            // alert(data.message);
            toast.error(data.message);
          }
        }
      }
    },
  });

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
  const dropdownStyles = {
    control: (styles) => ({ ...styles, marginBottom: "1rem" }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: "170px", // Limit the height of the dropdown
      overflowY: "auto", // Add a scrollbar
    }),
  };

  return (
    <div className="md:mt-[4%] mt-8">
      <Toaster />
      <p className="font-bold text-lg">Upload Carousel Images*</p>
      <p className="text-Gray85 font-normal">
        First image will be used for thumbnail
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="md:w-[70%] h-[500px] bg-grayshade mt-[1%]">
          <div className="w-full">
            <div className="flex items-center justify-start w-full ">
              <label className="flex flex-col w-[96%] mt-[2%] mx-auto h-[250px]  hover:border-gray-300 relative bg-Gray85">
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
            <div className="flex w-[95%] justify-between mx-auto mt-[2%]">
              <div>
                <p className="py-2">Only PNG or JPG Files. 500 kb max size</p>
                <p className="">Dimensions-1024x812</p>
              </div>
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

        <div className="md:w-[70%] mt-[2%]">
          <div className="md:w-[70%] grid gap-6 mb-6 md:grid-cols-2">
            {/* First Name Input Field  */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-start text-sm font-medium text-gray-900 "
              >
                Category Name*
              </label>
              <input
                type="text"
                id="categorieName"
                name="categorieName"
                value={values.categorieName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
              {errors.categorieName && touched.categorieName ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.categorieName}
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
                value={categoryPriority}
                onChange={setCategoryPriority}
                isClearable
                placeholder="Select Category Priority"
              />
            </div>

            {/* Artist Description*/}
            <div className="md:col-span-2 mb-4">
              <label
                htmlFor="artistDescription"
                className="block mb-2 text-start text-sm font-medium text-gray-900"
              >
                Category Description
              </label>
              <textarea
                id="categorieDescription"
                name="categorieDescription"
                value={
                  values.categorieDescription ? values.categorieDescription : ""
                }
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
              />
              {/* {errors.categorieDescription && touched.categorieDescription ? (
                <p className="font-Marcellus text-start text-red-900">
                  {errors.categorieDescription}
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
      </form>
    </div>
  );
};

export default CreateCategories;
