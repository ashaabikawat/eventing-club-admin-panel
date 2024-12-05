import { useFormik } from "formik";
import React, { useState, useEffect, useRef } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
// import { superAdminEventCreationObjectSchema } from "../../../validation/YupValidation";
import {
  EventType,
  EventStatus,
  ConvinienceFeeUnit,
  EventVenueTobeAnnounced,
  IsVenueAvailable,
  IsOnlineEvent,
} from "../../../../common/helper/Enum";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineAdd, MdOutlineInfo } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import Select from "react-select";
// import DateRangePicker from "flowbite-datepicker/DateRangePicker";
import { IoTrashBinSharp } from "react-icons/io5";

// import CreateVenueModal from "./modal/CreateVenueModal";

// Api End Point Imports
import {
  FaqEndPoint,
  artistEndpoints,
  categorieEndPoint,
  eventEndPoint,
  eventTagEndPoint,
  eventTourEndPoint,
  genreEndPoint,
  organizerEndpoint,
  venueEndPoint,
} from "../../../../../services/apis";
// import CreateOrganizerModal from "./modal/CreateOrganizerModal";

import { formatDate2, formatDate3 } from "../../../../common/formatDate2";
// import UploadGalleryImg from "./UploadGalleryImg";
import { useSelector } from "react-redux";
// import EditCreatedFAQModal from "./modal/editmodal/EditCreatedFAQModal";
import AddAddress from "../../../../common/AddAddress";
import {
  indianLanguages,
  yearsOptions,
} from "../../../../superAdmin/components/sidebar/event/modalCrationData/modalOpen";
import UploadGalleryImg from "../../../../superAdmin/components/sidebar/event/UploadGalleryImg";
import CustomOption from "./customOption/CustomOption";
import CustomMenuList from "./customOption/CustomMenuList";
import {
  OtherArtistID,
  OtherCategoriesID,
  OtherEventTagID,
  OtherEventTourID,
  OtherGenreID,
} from "../../../data/noFoundSelectionId";
import CreateFAQModal from "../../../../superAdmin/components/sidebar/event/modal/CreateFAQModal";
import EditCreatedFAQModal from "../../../../superAdmin/components/sidebar/event/modal/editmodal/EditCreatedFAQModal";
import { OrganizerEventValidation } from "./eventValidation/OrganizerEventValidation";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { formatDateForInput } from "../../../../common/FormatDate";
import { BiSolidImageAdd } from "react-icons/bi";

const CreateEventOrganizer = ({ eventSelectionFlag, setEventCrationModal }) => {
  const organizerUser = useSelector((store) => store.organizerauth);
  // Image Selection and For Display

  // console.log({eventSelectionFlag})

  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [allImageFile, setAllImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  const [selectedEventType, setSelectedEventType] = useState(null);
  const [selectedLocationType, setSelectedLocationType] = useState(null);

  // Venue Api Call State
  const [venueApiCall, setVenueApiCall] = useState(false);
  const [venueData, setVenueData] = useState([]);
  const [createNewVenue, setCreateNewVenue] = useState(false);
  const [file, setFile] = useState(null);

  // Venue Online selection state and city selection state
  // Address State
  const [stateIsoCode, setStateIsoCode] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityIsoCode, setCityIsoCode] = useState(null);
  const [cityName, setCityName] = useState(null);

  // Category State
  const [categorieData, setcategorieData] = useState([]);
  const [selectedOptionsForCategory, setSelectedOptionsForCategory] = useState(
    []
  );
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [categoryID, setCategoryID] = useState([]);

  // Artist States
  const [artistData, setArtistData] = useState([]);
  const [selectedOptionsForArtist, setSelectedOptionsForArtist] = useState([]);
  const [allArtistData, setAllArtistData] = useState([]);
  const [artistID, setArtistID] = useState([]);

  // Genre States
  const [genreData, setGenreData] = useState([]);
  const [selectedOptionsForGenre, setSelectedOptionsForGenre] = useState([]);
  const [allGenreData, setAllGenreData] = useState([]);
  const [genreID, setGenreID] = useState([]);

  // FAQ states
  const [faqData, setFaqData] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [showEditFaqModal, setShowEditFaqModal] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState(null);
  const [showCreateFaqModal, setShowCreateFaqModal] = useState(false);

  // Language selection
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedLanguageValue, setSelectedLanguageValue] = useState("");

  // Age States
  const [selectedYears, setSelectedYears] = useState(null);
  const [selectedYearsValue, setSelectedYearsValue] = useState(null);

  // Event Tour States
  const [eventTourData, setEventTourData] = useState([]);
  const [selectedOptionsForEventTour, setSelectedOptionsForEventTour] =
    useState([]);
  const [allEventTourData, setAllEventTourData] = useState([]);
  const [showCreateEventTourModal, setShowCreateEventTourModal] =
    useState(false);
  const [selectedEventTourID, setSelectedEventTourID] = useState("");

  // Event Tag States
  const [allEventTags, setAllEventTags] = useState([]);
  const [selectedEventTag, setSelectedEventTag] = useState();
  const [selectedEventTagID, setSelectedEventTagID] = useState("");

  // Date and time picker
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState([]);

  // Event Status
  const [eventStatus, setEventStatus] = useState(null);

  const navigate = useNavigate();
  const [today, setToday] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
      // setToday(today);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (today) {
      const date = formatDateForInput(today.toLocaleDateString("en-US"));
      setFormattedDate(date);
    }
  }, [today]);

  console.log(
    "todays date",
    // formatDateForInput(today.toLocaleDateString("en-US"))
    today
  );
  console.log("formatted date", formattedDate);

  // Call Venue Data
  useEffect(() => {
    if (venueApiCall) {
      getAllVenueData();
    }
  }, [venueApiCall]);

  // All Venue Data
  const getAllVenueData = async () => {
    try {
      const FetchVenueData = await axios.get(
        `${venueEndPoint.ALL_VENUE_DATA_LIST}`
      );

      // console.log("FetchVenueData", FetchVenueData.data);
      setVenueData(FetchVenueData.data.data);
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

  // All Data For selection Tag
  useEffect(() => {
    getAllCategoryData();
    getAllArtistData();
    getAllGenreData();
    // getAllFaqData();
    getAllTourData();
    // getAllEventTags();
  }, []);

  // All Organizer Data For Selection

  // All Category Data For Selection
  const getAllCategoryData = async () => {
    try {
      const FetchCategorieData = await axios.get(
        `${categorieEndPoint.CATEGORIES_DATA_URL}`
      );

      // console.log("FetchCategorieData", FetchCategorieData.data);
      setcategorieData(FetchCategorieData.data.data);
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

  // All Artist Data For Selection
  const getAllArtistData = async () => {
    try {
      const FetchArtistData = await axios.get(
        `${artistEndpoints.ALL_ARTIST_LIST}`
      );

      // console.log("FetchArtistData", FetchArtistData.data);
      setArtistData(FetchArtistData.data.data);
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

  // All Genre Data For Selection
  const getAllGenreData = async () => {
    try {
      const FetchGenreData = await axios.get(`${genreEndPoint.GENRE_DATA_URL}`);

      // console.log("FetchGenreData", FetchGenreData.data);
      setGenreData(FetchGenreData.data.data);
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

  // All Event Tour Data for selection
  const getAllTourData = async () => {
    try {
      const FetchTourData = await axios.get(
        `${eventTourEndPoint.GET_ACTIVE_EVENT_TOURS}`
      );

      // console.log("FetchTourData", FetchTourData.data);
      setEventTourData(FetchTourData.data.data);
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

  // All Event Tags for selection
  // const getAllEventTags = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${eventTagEndPoint.ALL_EVENT_TAG_DATA}`
  //     );

  //     // console.log("response", response.data.data);
  //     setAllEventTags(response.data.data);
  //   } catch (error) {
  //     if (error.response) {
  //       const { status, data } = error.response;

  //       if (
  //         status === 404 ||
  //         status === 403 ||
  //         status === 500 ||
  //         status === 302 ||
  //         status === 409 ||
  //         status === 401 ||
  //         status === 400
  //       ) {
  //         console.log(error.response);
  //         toast.error(data.message);
  //       }
  //     }
  //   }
  // };

  // On Change Image Handler
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

  const initialValues = {
    eventVisibility: "",
    eventType: "1",
    bookingphonenumber: "",
    whatsappnumber: "",
    venue_id: "",
    onlineEventUrl: "",
    eventname: "",
    eventDescription: "",
    isFeatured: 0,
    eventTermsandConditions: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    eventVideoUrl: "",
    feeunit: 1,
    feevalue: "",
  };

  // Event Creation API CALLS

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
    // validationSchema: superAdminEventCreationObjectSchema,
    onSubmit: async (values) => {
      if (selectedYearsValue === null || selectedYearsValue === undefined) {
        return toast.error("Please select Age");
      }

      // Date and time validation
      if (events.length === 0) {
        return toast.error("Please select at least one event date and time");
      }

      if (selectedLanguageValue.length === 0) {
        return toast.error("Please select at least 1 language");
      }

      const formData = new FormData();
      [...allImageFile].forEach((image) => {
        formData.append("CarouselImages", image);
      });

      if (galleryImages.length !== 0) {
        [...galleryImages].forEach((image) => {
          formData.append("GalleryImages", image);
        });
      }

      formData.append("EventType", values.eventType);

      // if (values.eventType == 1) {
      //   if (
      //     values.bookingphonenumber === undefined ||
      //     values.bookingphonenumber === "" ||
      //     values.bookingphonenumber === null ||
      //     !isValidPhoneNumber(values.bookingphonenumber)
      //   ) {
      //     return toast.error(
      //       "Please Enter a valid Booking Phone Number with exactly 10 digits"
      //     );
      //   }
      //   formData.append("BookingPhoneNumber", values.bookingphonenumber);
      // } else if (values.eventType == 3) {
      //   if (
      //     values.whatsappnumber === undefined ||
      //     values.whatsappnumber === "" ||
      //     values.whatsappnumber === null ||
      //     !isValidPhoneNumber(values.whatsappnumber)
      //   ) {
      //     return toast.error(
      //       "Please Enter a valid WhatsApp Phone Number with exactly 10 digits"
      //     );
      //   }
      //   formData.append("WhatsAppPhoneNumber", values.whatsappnumber);
      // }

      formData.append("EventVisibility", values.eventVisibility);

      if (selectedLocationType === "venue") {
        if (
          values.venue_id === undefined ||
          values.venue_id === "" ||
          values.venue_id === null
        ) {
          return toast.error("Please select Venue");
        } else {
          formData.append("venue_id", values.venue_id);
          if (file !== null) {
            formData.append("VenueLayout", file);
          }
        }

        formData.append("VenueToBeAnnounced", EventVenueTobeAnnounced.No);
        formData.append("OnlineEventFlag", IsOnlineEvent.No);
        formData.append("VenueEventFlag", IsVenueAvailable.Yes);
      } else if (selectedLocationType === "online") {
        if (
          values.onlineEventUrl === undefined ||
          values.onlineEventUrl === ""
        ) {
          return toast.error("Please enter Online Event URL");
        } else {
          formData.append("Online_Event_Link", values.onlineEventUrl);
        }
        formData.append("VenueToBeAnnounced", EventVenueTobeAnnounced.No);
        formData.append("VenueEventFlag", IsVenueAvailable.No);
        formData.append("OnlineEventFlag", IsOnlineEvent.Yes);
      } else {
        if (
          stateName === null ||
          stateIsoCode === null ||
          cityName === null ||
          cityIsoCode === null
        ) {
          toast.error("Please select State, City for venue To be Announced");
          return;
        } else {
          formData.append("VenueToBeAnnouncedState", stateName);
          formData.append("VenueToBeAnnouncedStateIsoCode", stateIsoCode);
          formData.append("VenueToBeAnnouncedCity", cityName);
          formData.append("VenueToBeAnnouncedCityIsoCode", cityIsoCode);
        }

        formData.append("VenueToBeAnnounced", EventVenueTobeAnnounced.Yes);
        formData.append("VenueEventFlag", IsVenueAvailable.No);
        formData.append("OnlineEventFlag", IsOnlineEvent.No);
      }
      const category = [
        {
          category_id: categoryID.value,
        },
      ];

      formData.append("EventCategories", JSON.stringify(category));
      const artist = artistID.map((item) => ({ artist_id: item.artist_id }));
      formData.append("EventArtist", JSON.stringify(artist));
      const genre = genreID.map((item) => ({ genre_id: item.genre_id }));
      formData.append("EventGenre", JSON.stringify(genre));

      // const faq = faqID.map((item) => ({ faq_id: item.faq_id }));
      // formData.append("EventFAQs", JSON.stringify(faq));

      const languages = selectedLanguageValue.map((item) => item.value);
      formData.append("EventLanguages", JSON.stringify(languages));

      if (faqData.length !== 0) {
        const faqDatasend = faqData.map((faq) => ({
          Question: faq.Question,
          Answer: faq.Answer,
        }));
        formData.append("EventFAQs", JSON.stringify(faqDatasend));
      }

      //  if(organizerID.length === 0){
      //   return toast.error("Please select at least 1 Organizer");
      // }

      // if(artistID.length === 0){
      //   return toast.error("Please select at least 1 Artist");
      // }

      // if(genreID.length === 0){
      //   return toast.error("Please select at least 1 Genre");
      // }

      // formData.append("EventLanguage", selectedLanguageValue);
      formData.append("BestSuitedFor", selectedYearsValue);
      formData.append("EventName", values.eventname);

      if (eventSelectionFlag != 0) {
        formData.append("EventTour_id", selectedEventTourID);
      }

      // formData.append("EventTag_id", selectedEventTagID);
      formData.append("EventDescription", values.eventDescription);
      formData.append("EventTermsCondition", values.eventTermsandConditions);
      formData.append("CreatedBy", organizerUser.organizerSignupData.AdminRole);
      formData.append(
        "createduser_id",
        organizerUser.organizerSignupData.user_id
      );

      const event = events.map((item) => ({
        EventStartDate: item.EventStartDate,
        EventStartTime: item.EventStartTime,
        EventEndDate: item.EventEndDate,
        EventEndTime: item.EventEndTime,
      }));
      formData.append("EventDateTime", JSON.stringify(event));

      if (values.eventVideoUrl === !null || values.eventVideoUrl !== "") {
        formData.append("EventVedioUrl", values.eventVideoUrl);
      }

      formData.append("Status", eventStatus);
      formData.append("TourEvent", eventSelectionFlag);

      try {
        let response = await axios.post(
          `${organizerEndpoint.CREATE_EVENT_BY_ORGANIZER}`,
          formData
        );

        toast.success(response.data.message);
        setTimeout(() => {
          setEventCrationModal(false);
        }, 2000);
        resetForm();
        // setEventTagCreationModal(false);
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

  // For Location Types
  const handleLocationTypeChange = (locationType) => {
    // console.log({ locationType });
    setSelectedLocationType(locationType);
    if (locationType === "venue") {
      setVenueApiCall(true);
    }
  };

  console.log(values.eventDescription);

  // Categorie State Update and open Cration Modal for Organizer
  const handleSelectChangeCategory = (selected) => {
    setSelectedOptionsForCategory(selected);
    // const categoryID = selected.map((id) => ({ category_id: id.value }));
    setCategoryID(selected);
  };

  // Set all Category options
  useEffect(() => {
    const updateOrganizerData = () => {
      const newCategorieData = [
        ...categorieData.map((categorie) => ({
          value: categorie._id,
          label: categorie.Name,
        })),
        // createCategoryOption,
        // { value: "Not found", label: "Not found? contact admin" },
      ];
      setAllCategoriesData(newCategorieData);
    };

    updateOrganizerData();
  }, [categorieData]);

  const handleNewCategorie = (newCategorie) => {
    setcategorieData((prevData) => [...prevData, newCategorie]);
  };
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const maxSize = 500 * 1024;

    // if (/\.(jpe?g|png)$/i.test(file.name)) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setFile(file);
    //   };

    //   reader.readAsDataURL(file);
    // } else {
    //   e.target.value = "";
    //   toast.error("Invalid Image File. Please select a JPEG or PNG image.");
    // }

    if (/\.(jpe?g|png)$/i.test(file.name)) {
      if (file.size < maxSize) {
        reader.onloadend = () => {
          // setSelectedImage(file);
          // setImageUrl(reader.result);
          // setFieldValue("ProductOtherImage", file);
          setFile(file);
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      } else {
        e.target.value = "";
        toast.error("Image size should be less than 500KB");
      }
    } else {
      toast.error("Invalid Image File. Please select a JPEG or PNG image.");
    }
  };

  // Artist State Update and open Cration Modal for Organizer
  const handleSelectChangeArtist = (selected) => {
    setSelectedOptionsForArtist(selected);
    const artistID = selected.map((id) => ({ artist_id: id.value }));
    setArtistID(artistID);
  };

  // Set all Artist options
  useEffect(() => {
    const updateOrganizerData = () => {
      const newArtistData = [
        ...artistData.map((artist) => ({
          value: artist._id,
          label: artist.Name,
        })),
        // { value: "Not found", label: "Not found? contact admin" },
      ];
      setAllArtistData(newArtistData);
    };

    updateOrganizerData();
  }, [artistData]);

  const handleNewArtist = (newArtist) => {
    setArtistData((prevData) => [...prevData, newArtist]);
  };

  // Genre State Update and open Cration Modal for Organizer
  const handleSelectChangeGenre = (selected) => {
    setSelectedOptionsForGenre(selected);
    const genreID = selected.map((id) => ({ genre_id: id.value }));
    setGenreID(genreID);
  };

  useEffect(() => {
    const updateGenreData = () => {
      const newGenreData = [
        ...genreData.map((genre) => ({
          value: genre._id,
          label: genre.Name,
        })),
        // createGenreOption,
        // { value: "Not found", label: "Not found? contact admin" },
      ];
      setAllGenreData(newGenreData);
    };

    updateGenreData();
  }, [genreData]);

  const handleNewGenre = (newGenre) => {
    setGenreData((prevData) => [...prevData, newGenre]);
  };

  const customFilterOption = (option, searchText) => {
    if (option.data.search) {
      return option.data.search
        .toLowerCase()
        .includes(searchText.toLowerCase());
    }
    return false;
  };

  // Language selection
  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    setSelectedLanguageValue(selectedOption);
  };

  // Age Selection
  const handleYearsChange = (selectedOption) => {
    setSelectedYears(selectedOption);
    console.log({ selectedOption });
    setSelectedYearsValue(selectedOption.value);
  };

  // Event Tour State Update and open Cration Modal for event tour
  const handleSelectChangeEventTour = (selected) => {
    setSelectedOptionsForEventTour(selected);
    setSelectedEventTourID(selected.value);
  };

  useEffect(() => {
    const updateEventTourData = () => {
      const newEventTourData = [
        ...eventTourData.map((eventTour) => ({
          value: eventTour._id,
          label: eventTour.Name,
        })),
        // createEventTourOption,
        // { value: "Not found", label: "Not found? contact admin" },
      ];
      setAllEventTourData(newEventTourData);
    };

    updateEventTourData();
  }, [eventTourData]);

  const handleNewEventTour = (newEventTour) => {
    setEventTourData((prevData) => [...prevData, newEventTour]);
  };

  // Event Tag Selection
  // const formattedEventTags = [
  //   ...allEventTags.map((tag) => ({
  //     value: tag._id,
  //     label: tag.EventTagName,
  //   })),
  //   // createEventTagOption,
  // ];

  // const handleSelectChangeEventTag = (selected) => {
  //     setSelectedEventTag(selected);
  //     setSelectedEventTagID(selected.value);
  // };

  // const handleNewEventTag = (newEventTag) => {
  //   setAllEventTags((prevTags) => [...prevTags, newEventTag]);
  // };

  const handleChangeTime = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "startDate":
        setStartDate(value);
        break;
      case "startTime":
        setStartTime(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "endTime":
        setEndTime(value);
        break;
      default:
        break;
    }
  };

  // const handleSave = () => {
  //   // Check if any field is empty
  //   if (!startDate || !startTime || !endDate || !endTime) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   const endTimeWithSeconds = `${endTime}:00`;
  //   const startTimeWithSeconds = `${startTime}:00`;

  //   // Convert dates to Date objects for comparison
  //   const startDateTime = new Date(`${startDate}T${startTimeWithSeconds}`);
  //   const endDateTime = new Date(`${endDate}T${endTimeWithSeconds}`);

  //   // Check if end date is earlier than start date
  //   if (endDateTime < startDateTime) {
  //     toast.error(
  //       "End date and time cannot be earlier than start date and time"
  //     );
  //     return;
  //   }

  //   // Add event to array of objects
  //   const newEvent = {
  //     EventStartDate: startDate,
  //     EventStartTime: startTimeWithSeconds,
  //     EventEndDate: endDate,
  //     EventEndTime: endTimeWithSeconds,
  //   };

  //   // console.log({newEvent})

  //   // You can do something with newEvent here, like storing it in state or sending it to an API

  //   // Reset all fields to their initial state
  //   setStartDate("");
  //   setStartTime("");
  //   setEndDate("");
  //   setEndTime("");

  //   // toast.success("Event saved successfully!");

  //   setEvents([...events, newEvent]);
  // };

  const handleSave = () => {
    const currentDateTime = new Date();

    // Check if any field is empty
    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("All fields are required");
      return;
    }

    // Convert times to a format with seconds (if needed)
    const startTimeWithSeconds = `${startTime}:00`;
    const endTimeWithSeconds = `${endTime}:00`;

    // Convert date and time strings to Date objects
    const startDateTime = new Date(`${startDate}T${startTimeWithSeconds}`);
    const endDateTime = new Date(`${endDate}T${endTimeWithSeconds}`);

    // Check if the start time is in the past
    if (startDateTime < currentDateTime) {
      toast.error(
        "The event start time cannot be in the past. Please select a future start time."
      );
      return;
    }

    // Check if the end time is before the start time
    if (endDateTime < startDateTime) {
      toast.error(
        "End date and time cannot be earlier than start date and time."
      );
      return;
    }

    // Additional validation: Check if event duration is reasonable (optional)
    const eventDuration = endDateTime - startDateTime;
    const maxDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (eventDuration > maxDuration) {
      toast.error("Event duration cannot exceed 24 hours.");
      return;
    }

    // Add event to the array of events
    const newEvent = {
      EventStartDate: startDate,
      EventStartTime: startTimeWithSeconds,
      EventEndDate: endDate,
      EventEndTime: endTimeWithSeconds,
    };

    // Save the event and reset form fields
    setEvents([...events, newEvent]);
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");

    // toast.success("Event saved successfully!");
  };
  const handleDelete = (index) => {
    const newEvents = events.filter((_, i) => i !== index);
    setEvents(newEvents);
  };

  const toggleSwitch = () => {
    setFieldValue("isFeatured", values.isFeatured === 1 ? 0 : 1);
  };

  const HandlerEventStatus = (status) => {
    setEventStatus(status);
    handleSubmit();
  };

  const handleNewFAQ = (newFAQ) => {
    setFaqData((prevData) => [...prevData, newFAQ]);
  };

  const handleDeleteFAQ = (index) => {
    setFaqToDelete(index);
    setShowConfirmationModal(true);
  };

  const confirmDeleteFAQ = () => {
    setFaqData((prevData) => prevData.filter((_, i) => i !== faqToDelete));
    setShowConfirmationModal(false);
    setFaqToDelete(null);
  };

  const handleEditFAQ = (faq) => {
    console.log("inside Faq Edit");
    setShowEditFaqModal(true);
    setFaqToEdit(faq);
  };

  const handleUpdateFAQ = (updatedFAQ) => {
    setFaqData((prevData) =>
      prevData.map((faq) => (faq.id === updatedFAQ.id ? updatedFAQ : faq))
    );
    setShowEditFaqModal(false);
    setFaqToEdit(null);
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="w-full flex md:flex-row flex-col justify-between mb-8">
          {/* Left Side Data */}
          <div className="md:w-[49%] mt-4 md:mb-0 mb-6">
            <div className="w-full">
              {/* Image Selection and Display Div  */}
              <div className="relative">
                <p className="pl-2 text-lg relative text-black font-semibold">
                  Upload Carousel Images*
                </p>
                <div className="absolute  top-2 left-52 ml-2 flex flex-col items-center group">
                  <MdOutlineInfo />
                  <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                    <span className="relative w-96  rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                      The maximum allowed file size is 500kb
                    </span>
                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                  </div>
                </div>
              </div>
              <p className="pl-2 text-sm">
                First image will be used for thumbnail
              </p>
              <div className="w-[100%] h-[500px] bg-grayshade mt-[1%]">
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
                  <div className="flex w-[95%] justify-between mx-auto mt-[2%]">
                    <div className="flex flex-col">
                      <p className="py-2">
                        Only PNG or JPG Files. 500 kb max size
                      </p>
                      <p>Dimensions - 612x408</p>
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

              {/* Form Data */}

              <div className="w-full mt-8 bg-Gray85 h-auto p-3 ">
                {/* Event Visibility Div */}
                <div className=" ">
                  <div className="relative">
                    <p className="text-black  font-semibold text-xl relative">
                      Event Visibility*
                    </p>
                    <div className="absolute top-2 left-36 flex flex-col group items-center">
                      <MdOutlineInfo />
                      <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex ">
                        <span className="relative w-96 left-8 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                          Public Event: The event will be published online and
                          offline.
                          <span className="mt-2 inline-block">
                            Private Event: The event will only be held offline,
                            not visible online.
                          </span>
                        </span>
                        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[35%] flex justify-between mt-1.5">
                    <div>
                      <input
                        type="radio"
                        name="eventVisibility"
                        id="public"
                        value="1"
                        checked={values.eventVisibility === "1"}
                        onChange={handleChange}
                        className="mr-2 transform scale-150"
                      />
                      <label
                        className="text-black font-semibold"
                        htmlFor="public"
                      >
                        Public
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="eventVisibility"
                        id="private"
                        value="2"
                        checked={values.eventVisibility === "2"}
                        onChange={handleChange}
                        className="mr-2 transform scale-150"
                      />
                      <label
                        className="text-black font-semibold"
                        htmlFor="private"
                      >
                        Private
                      </label>
                    </div>
                  </div>
                </div>

                {/* Event Type commented code  */}
                {/* <div className=" mt-3 ">
                  <p className="text-black font-semibold text-xl">
                    Event Type*
                  </p>
                  <div className="w-[85%] flex justify-between mt-1.5">
                  
                    <div>
                      <input
                        type="radio"
                        name="eventType"
                        id="booking"
                        value={EventType.Booking}
                        checked={values.eventType == "1"}
                        className="mr-2 transform scale-150"
                        onChange={handleChange}
                      />
                      <label
                        className="text-black font-semibold"
                        htmlFor="booking"
                      >
                        Booking
                      </label>
                    </div>
                  </div>

              
                  {(values.eventType == EventType.Booking ||
                    values.eventType == EventType.WhatsApp) && (
                    <div className="mt-2">
                      <p>
                        {values.eventType == EventType.Booking
                          ? "Booking Phone No."
                          : "Phone Number"}
                      </p>
                      <input
                        type="text"
                        id={
                          values.eventType == EventType.Booking
                            ? "bookingphonenumber"
                            : "whatsappnumber"
                        }
                        name={
                          values.eventType == EventType.Booking
                            ? "bookingphonenumber"
                            : "whatsappnumber"
                        }
                        value={
                          values.eventType == EventType.Booking
                            ? values.bookingphonenumber
                            : values.whatsappnumber
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-gray-100 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {values.eventType == EventType.Booking &&
                      errors.bookingphonenumber &&
                      touched.bookingphonenumber ? (
                        <p className="font-Marcellus text-start text-red-900">
                          {errors.bookingphonenumber}
                        </p>
                      ) : null}
                      {values.eventType == EventType.WhatsApp &&
                      errors.whatsappnumber &&
                      touched.whatsappnumber ? (
                        <p className="font-Marcellus text-start text-red-900">
                          {errors.whatsappnumber}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div> */}

                {/*Location div  */}
                <div className="mt-3">
                  <p className="text-black font-semibold text-xl">Location*</p>
                  <div className="w-auto flex justify-between mt-1.5">
                    <button
                      type="button"
                      className={`w-[15%] py-2 ${
                        selectedLocationType === "venue"
                          ? "bg-blue-500"
                          : "bg-Gray40"
                      } text-white`}
                      onClick={() => handleLocationTypeChange("venue")}
                    >
                      Venue
                    </button>
                    <button
                      type="button"
                      className={`w-[35%] py-2 ${
                        selectedLocationType === "online"
                          ? "bg-blue-500"
                          : "bg-Gray40"
                      } text-white`}
                      onClick={() => handleLocationTypeChange("online")}
                    >
                      Online Event
                    </button>
                    <button
                      type="button"
                      className={`w-[45%] py-2 ${
                        selectedLocationType === "tba"
                          ? "bg-blue-500"
                          : "bg-Gray40"
                      } text-white`}
                      onClick={() => handleLocationTypeChange("tba")}
                    >
                      To Be Announced
                    </button>
                  </div>
                </div>

                {/* Conditionally render the input fields based on selected location type */}
                {selectedLocationType === "venue" && (
                  <div className="mt-2">
                    <div className="relative">
                      <p className="text-black relative">Venue</p>
                      <div className="absolute  top-1 left-10 ml-2 flex flex-col items-center group">
                        <MdOutlineInfo />
                        <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                          <span className="relative w-96 left-32 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                            Select Venue: Choose from our venue directory.
                            <p className="mt-2">
                              Venue Not Listed: If your venue is not listed,
                              select “Not found, contact admin.”
                            </p>
                          </span>
                          <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                        </div>
                      </div>
                    </div>
                    <select
                      className="bg-gray-100 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1"
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        console.log({ selectedValue });
                        setFieldValue("venue_id", selectedValue);
                        if (selectedValue === "create") {
                          setCreateNewVenue(true);
                        }
                      }}
                    >
                      <option value="">Select Venue</option>
                      {venueData.length > 0 &&
                        venueData.map((venue) => (
                          <option key={venue.id} value={venue._id}>
                            {venue.Name}
                          </option>
                        ))}
                      <option value="create">&#43; Create Venue</option>
                    </select>

                    <div className="mt-4">
                      <label htmlFor="">Select venue layout:</label>
                      <input
                        autoComplete="off"
                        id="File"
                        type="file"
                        placeholder="Select Only Image"
                        multiple
                        onChange={handleChangeImage}
                        className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full py-2 mb-4"
                      />
                      {/* <button
                      type="button"
                      // onClick={uploadFileHandler}
                      className="bg-green-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-green-700"
                    >
                      Upload
                    </button> */}
                    </div>
                  </div>
                )}

                {selectedLocationType === "online" && (
                  <div className="mt-2">
                    <p className="text-black">Online Event URL</p>
                    <input
                      type="text"
                      placeholder="Enter Online Event URL"
                      value={values.onlineEventUrl}
                      onChange={handleChange}
                      name="onlineEventUrl"
                      className="bg-gray-100 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1"
                    />
                  </div>
                )}

                {selectedLocationType === "tba" && (
                  <div className=" md:col-span-2  mt-4 w-full">
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
                )}

                {/* Category Div */}

                <div>
                  <div className="mt-3">
                    <p className="text-black font-semibold text-lg mb-1">
                      Select Category*
                    </p>
                    <Select
                      options={allCategoriesData}
                      className="basic-multi-select bg-Gray40"
                      classNamePrefix="select organizer"
                      onChange={handleSelectChangeCategory}
                      value={selectedOptionsForCategory}
                      components={{
                        Option: (props) => (
                          <CustomOption
                            {...props}
                            targetValue={OtherCategoriesID.NoFoundCategoriesID}
                          />
                        ),
                        MenuList: (props) => (
                          <CustomMenuList
                            {...props}
                            targetValue={OtherCategoriesID.NoFoundCategoriesID}
                          />
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Artist Div */}
                <div>
                  <div className="mt-3">
                    <p className="text-black font-semibold text-lg mb-1">
                      Select Artist*
                    </p>
                    <Select
                      isMulti
                      name="colors"
                      options={allArtistData}
                      className="basic-multi-select bg-Gray40"
                      classNamePrefix="select organizer"
                      onChange={handleSelectChangeArtist}
                      value={selectedOptionsForArtist}
                      components={{
                        Option: (props) => (
                          <CustomOption
                            {...props}
                            targetValue={OtherArtistID.NoFoundArtistID}
                          />
                        ),
                        MenuList: (props) => (
                          <CustomMenuList
                            {...props}
                            targetValue={OtherArtistID.NoFoundArtistID}
                          />
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Genre Div */}
                <div>
                  <div className="mt-3">
                    <p className="text-black font-semibold text-lg mb-1">
                      Select Genre*
                    </p>
                    <Select
                      isMulti
                      name="colors"
                      options={allGenreData}
                      className="basic-multi-select bg-Gray40"
                      classNamePrefix="select Genre"
                      onChange={handleSelectChangeGenre}
                      value={selectedOptionsForGenre}
                      components={{
                        Option: (props) => (
                          <CustomOption
                            {...props}
                            targetValue={OtherGenreID.NoFoundGenreID}
                          />
                        ),
                        MenuList: (props) => (
                          <CustomMenuList
                            {...props}
                            targetValue={OtherGenreID.NoFoundGenreID}
                          />
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Language selection */}
                <div className="mt-3">
                  <p className="text-black font-semibold text-lg mb-1">
                    Select Language*
                  </p>
                  <Select
                    isMulti
                    name="language"
                    options={indianLanguages}
                    className="basic-single-select bg-Gray40"
                    classNamePrefix="select language"
                    onChange={handleLanguageChange}
                    value={selectedLanguage}
                  />
                </div>

                {/* Age Selection  */}
                <div>
                  <div className="mt-3">
                    <p className="text-black font-semibold text-lg mb-1">
                      Select Age*
                    </p>
                    <Select
                      name="years"
                      options={yearsOptions}
                      className="basic-single-select bg-Gray40"
                      classNamePrefix="select years"
                      onChange={handleYearsChange}
                      value={selectedYears}
                    />
                  </div>
                </div>

                {/* Add Video URL  */}
                <div className="mt-4">
                  <div className="relative">
                    <label
                      htmlFor="eventVideoUrl"
                      className="block mb-2 relative text-black font-semibold text-lg text-start  "
                    >
                      Add Video URL
                    </label>
                    <div className="absolute  top-2 left-32  flex flex-col items-center group">
                      <MdOutlineInfo />
                      <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                        <span className="relative w-96 left-14 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                          Upload any YouTube link for the event teaser or
                          promotional video.
                        </span>
                        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                      </div>
                    </div>
                  </div>
                  <textarea
                    id="eventVideoUrl"
                    name="eventVideoUrl"
                    value={values.eventVideoUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={2}
                    placeholder="Enter event link here"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                  />
                  {errors.eventVideoUrl && touched.eventVideoUrl ? (
                    <p className="font-Marcellus text-start text-red-900">
                      {errors.eventVideoUrl}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/*  Right Side Data  */}
          <div className="md:w-[49%] w-full ">
            <div className="w-full">
              {/* Event Name Div */}
              <div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="eventname"
                    className="block mb-2 font-semibold text-lg   text-gray-900 "
                  >
                    Event Name*
                  </label>
                  <input
                    type="text"
                    id="eventname"
                    name="eventname"
                    value={values.eventname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                  {errors.eventname && touched.eventname ? (
                    <p className="font-Marcellus text-start text-red-900">
                      {errors.eventname}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Event Tour div */}
              {Boolean(eventSelectionFlag) && (
                <div>
                  <div className="mt-3">
                    <p className="text-black font-semibold text-lg mb-1">
                      Select Event Tour*
                    </p>
                    <Select
                      name="colors"
                      options={allEventTourData}
                      className="basic-single-select bg-Gray40"
                      classNamePrefix="select Genre"
                      onChange={handleSelectChangeEventTour}
                      value={selectedOptionsForEventTour}
                      components={{
                        Option: (props) => (
                          <CustomOption
                            {...props}
                            targetValue={OtherEventTourID.NoFoundEventTourID}
                          />
                        ),
                        MenuList: (props) => (
                          <CustomMenuList
                            {...props}
                            targetValue={OtherEventTourID.NoFoundEventTourID}
                          />
                        ),
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Event Tag div */}
              {/* <div>
                <div className="mt-3">
                  <p className="text-black font-semibold text-lg mb-1">
                    Select Event Tag*
                  </p>
                  <Select
                    name="eventtag"
                    options={formattedEventTags}
                    className="basic-single-select bg-Gray40"
                    classNamePrefix="select"
                    onChange={handleSelectChangeEventTag}
                    value={selectedEventTag}
                    isClearable
                    components={{
                        Option: (props) => (
                          <CustomOption
                            {...props}
                            targetValue= {OtherEventTagID.NoFoundEventTagID}
                          />
                        ),
                        MenuList: (props) => (
                          <CustomMenuList
                            {...props}
                            targetValue={OtherEventTagID.NoFoundEventTagID}
                          />
                        ),
                      }}
                  />
                </div>
              </div> */}

              {/* Event Description */}
              <div className="mt-4">
                <label
                  htmlFor="eventDescription"
                  className="block mb-2 text-black font-semibold text-lg text-start "
                >
                  Event Description*
                </label>
                <ReactQuill
                  id="eventDescription"
                  name="eventDescription"
                  value={values.eventDescription}
                  onChange={(value) => setFieldValue("eventDescription", value)}
                  // onBlur={handleBlur}
                  className="w-full h-52 overflow-y-scroll bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 "
                  theme="snow"
                  modules={{
                    toolbar: [
                      [
                        { font: [] },
                        { size: ["small", false, "large", "huge"] },
                      ], // Font size dropdown
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      ["clean"],
                    ],
                  }}
                />
                {errors.eventDescription && touched.eventDescription ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.eventDescription}
                  </p>
                ) : null}
              </div>

              {/* Event Terms and Conditions div*/}
              {/* <div className="mt-4">
                <label
                  htmlFor="eventTermsandConditions"
                  className="block mb-2 text-black font-semibold text-lg text-start  dark:text-white"
                >
                  Event Terms and Conditions*
                </label>
                <textarea
                  id="eventTermsandConditions"
                  name="eventTermsandConditions"
                  value={values.eventTermsandConditions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.eventTermsandConditions &&
                touched.eventTermsandConditions ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.eventTermsandConditions}
                  </p>
                ) : null}
              </div> */}
              <div className="mt-4 ">
                <label
                  htmlFor="eventTermsandConditions"
                  className="block mb-2 text-black font-semibold text-lg text-start  "
                >
                  Event Terms and Conditions*
                </label>
                <ReactQuill
                  id="eventTermsandConditions"
                  // ref={quillRef}
                  name="eventTermsandConditions"
                  value={values.eventTermsandConditions}
                  onChange={(value) =>
                    setFieldValue("eventTermsandConditions", value)
                  }
                  // onBlur={handleBlur}
                  className="w-full h-52 overflow-y-scroll border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 "
                  theme="snow"
                  modules={{
                    toolbar: [
                      [
                        { font: [] },
                        { size: ["small", false, "large", "huge"] },
                      ], // Font size dropdown
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      ["clean"],
                    ],
                  }}
                />
                {errors.eventTermsandConditions &&
                touched.eventTermsandConditions ? (
                  <p className="font-Marcellus text-start text-red-900">
                    {errors.eventTermsandConditions}
                  </p>
                ) : null}
              </div>

              {/* Add Date and Time */}

              <div>
                <div className="relative">
                  <p className="mt-2 text-lg text-black font-semibold relative">
                    Add Date & Time
                  </p>
                  <div className="absolute  top-2 left-36 ml-2 flex flex-col items-center group">
                    <MdOutlineInfo />
                    <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                      <span className="relative w-96 left-8 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                        Single Day Event: Set the start and end times.
                        <span className="mt-2 inline-block">
                          Multiple Day Event: Add another date for each day of
                          the event.
                        </span>
                      </span>
                      <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-auto bg-grayshade mb-6">
                  {/* Start Date */}
                  <div className="flex w-full">
                    <div className="p-2 flex flex-col w-[49%]">
                      <label htmlFor="date" className="mb-1.5">
                        Select Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        min={formattedDate}
                        value={startDate}
                        onChange={handleChangeTime}
                        className="bg-Gray85 py-2 px-2"
                      />
                    </div>
                    <div className="p-2 flex flex-col w-[49%]">
                      <label htmlFor="date" className="mb-1.5">
                        Select Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={startTime}
                        onChange={handleChangeTime}
                        className="bg-Gray85 py-2 px-2"
                      />
                    </div>
                  </div>

                  {/* End Date  */}
                  <div className="flex w-full">
                    <div className="p-2 flex flex-col w-[49%]">
                      <label htmlFor="date" className=" mb-1.5">
                        Select End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        min={startDate ? startDate : formattedDate}
                        value={endDate}
                        onChange={handleChangeTime}
                        className="bg-Gray85 py-2 px-2"
                      />
                    </div>
                    <div className="  p-2 flex flex-col w-[49%]">
                      <label htmlFor="date" className="mb-1.5">
                        Select End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={endTime}
                        onChange={handleChangeTime}
                        className="bg-Gray85 py-2 px-2"
                      />
                    </div>
                  </div>

                  <div className="w-[95%] flex justify-end items-end mt-5 mb-3  pb-4">
                    <button
                      className="px-5 py-2 text-white bg-Gray40"
                      type="button"
                      onClick={() => handleSave()}
                    >
                      Save
                    </button>
                  </div>

                  {events &&
                    events.map((event, index) => (
                      <div
                        key={index}
                        className="w-[96%] mx-auto py-2 flex justify-between border-b-2"
                      >
                        <p>
                          {formatDate3(event.EventStartDate)} -{" "}
                          {formatDate3(event.EventEndDate)}
                        </p>
                        <p>
                          {event.EventStartTime} - {event.EventEndTime}
                        </p>
                        <p>
                          <IoTrashBinSharp
                            onClick={() => handleDelete(index)}
                            size={25}
                          />
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Upload Gallery Section */}
              <div>
                <UploadGalleryImg setGalleryImages={setGalleryImages} />
              </div>

              {/* Manage Event FAQ */}
              <div className="mt-10">
                <div className="relative">
                  <h1 className="text-base font-semibold relative">
                    Manage Event FAQs
                  </h1>
                  <div className="absolute  top-1 left-36 ml-3 flex flex-col items-center group">
                    <MdOutlineInfo />
                    <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                      <span className="relative w-96 left-6 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                        Provide common questions and answers to offer detailed
                        information about the event.
                      </span>
                      <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-grayshade max-h-[350px] overflow-y-scroll">
                  <div className="w-[94%] mx-auto pb-4">
                    <button
                      onClick={() => setShowCreateFaqModal(true)}
                      className="px-4 py-3 mt-4 bg-Gray40 text-white"
                      type="button"
                    >
                      Add FAQ
                    </button>
                  </div>

                  {faqData &&
                    faqData.map((faq, index) => (
                      <div className="  w-[96%] mx-auto py-2 border-b-[1px] border-Gray85 ">
                        <p className="flex w-[90%] text-base text-black font-normal  ">
                          <span>Q.</span>
                          {faq.Question}
                        </p>
                        <p className="w-[90%] flex justify-end">
                          <span>
                            <IoTrashBinSharp
                              onClick={() => handleDeleteFAQ(index)}
                              size={22}
                              className="mr-2"
                            />
                          </span>
                          <span className="z-20">
                            <TbEdit
                              onClick={() => handleEditFAQ(faq)}
                              size={22}
                            />
                          </span>
                        </p>
                        <p className="flex w-[90%] -mt-2 text-base text-grayTextColor font-normal">
                          <span>A.</span>
                          {faq.Answer}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Creation Modal */}
              {showCreateFaqModal && (
                <CreateFAQModal
                  setShowCreateFaqModal={setShowCreateFaqModal}
                  onNewFAQ={handleNewFAQ}
                />
              )}

              {/* Delete Modal Conformation */}
              {showConfirmationModal && (
                <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
                  <div className="bg-white p-4 rounded-md md:w-[50%]">
                    <h2 className="text-lg font-bold">
                      Are you sure you want to delete this FAQ?
                    </h2>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => confirmDeleteFAQ()}
                        className="px-4 py-2 mr-2 text-white bg-red-600 rounded-md"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowConfirmationModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/*  Edit FAQ Modal */}
              {showEditFaqModal && (
                <EditCreatedFAQModal
                  setShowEditFaqModal={setShowEditFaqModal}
                  faqToEdit={faqToEdit}
                  onUpdateFAQ={handleUpdateFAQ}
                />
              )}

              <div className="flex  w-[100%] justify-end mt-[3%]">
                <button
                  className="py-2.5 px-3 border-[1px] border-Gray85 mr-[7%]"
                  type="button"
                  onClick={() => HandlerEventStatus(EventStatus.Draft)}
                >
                  Save as draft
                </button>
                <button
                  className="py-2.5 px-3 bg-Gray40 text-white"
                  type="button"
                  onClick={() => HandlerEventStatus(EventStatus.InReview)}
                >
                  Submit for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateEventOrganizer;
