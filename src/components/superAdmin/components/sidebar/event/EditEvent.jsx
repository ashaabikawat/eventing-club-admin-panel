import React, { useEffect, useState } from "react";
import {
  eventEndPoint,
  eventTagEndPoint,
  eventTourEndPoint,
  venueEndPoint,
} from "../../../../../services/apis";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import EditGalleryImages from "./EditEvent/EditGalleryImages";
import EditCarouselImage from "./EditEvent/EditCarouselImage";
import useFetchEventData from "../../../hooks/useFetchEventData";
import { superAdminEventCreationObjectSchema } from "../../../validation/YupValidation";
import {
  ConvinienceFeeUnit,
  EventStatus,
  EventType,
  EventVenueTobeAnnounced,
  IsOnlineEvent,
  IsVenueAvailable,
} from "../../../../common/helper/Enum";
import Select from "react-select";
import { indianLanguages, yearsOptions } from "./modalCrationData/modalOpen";
import { formatDate3 } from "../../../../common/formatDate2";
import { IoTrashBinSharp } from "react-icons/io5";

import EditEventTimeDateModal from "./EditEvent/EditEventTimeDateModal";
import { transformEventDateTime } from "../../../../common/transformEventDateTime";
import { TbEdit } from "react-icons/tb";
import EditFAQModal from "./EditEvent/EditFAQModal";
import EditAddnewFAQ from "./EditEvent/EditAddnewFAQ";
import { useSelector } from "react-redux";
import EditAddress from "../../../../common/EditAddress";
import ReactQuill from "react-quill";
import { MdInfoOutline, MdOutlineInfo } from "react-icons/md";

const EditEvent = () => {
  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const adminuser = useSelector((store) => store.auth);

  const { _id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({});
  const [eventGalleryImages, setEventGalleryImages] = useState([]);
  const [eventCarouselImages, setEventCarouselImages] = useState([]);
  const [eventOrganizersData, setEventOrganizersData] = useState([]);
  const [eventCategoriesData, setEventCategoriesData] = useState([]);
  const [eventArtistsData, setEventArtistsData] = useState([]);
  const [eventGenreData, setEventGenresData] = useState([]);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState(null);
  const [createNewVenue, setCreateNewVenue] = useState(false);

  // Event Status
  const [eventStatus, setEventStatus] = useState(null);

  // Venue Data
  const [venueData, setVenueData] = useState([]);
  const [allEventVenueData, setAllEventVenueData] = useState([]);
  const [selectedOptionsForVenue, setSelectedOptionsForVenue] = useState([]);
  const [selectedVenueID, setSelectedVenueID] = useState("");
  const [venueApiCall, setVenueApiCall] = useState(false);

  // Venue Image
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState("");

  // Organizer Data
  const [AllorganizerData, setAllOrganizerData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [organizerID, setOrganizerID] = useState([]);

  // Categories State
  const [selectedOptionsForCategory, setSelectedOptionsForCategory] = useState(
    []
  );
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [categoryID, setCategoryID] = useState([]);

  // Artist States
  const [selectedOptionsForArtist, setSelectedOptionsForArtist] = useState([]);
  const [allArtistData, setAllArtistData] = useState([]);
  const [artistID, setArtistID] = useState([]);

  // Genre States
  const [selectedOptionsForGenre, setSelectedOptionsForGenre] = useState([]);
  const [allGenreData, setAllGenreData] = useState([]);
  const [genreID, setGenreID] = useState([]);

  // // FAQ states
  // const [selectedOptionsForFaq, setSelectedOptionsForFaq] = useState([]);
  // const [allFaqData, setAllFaqData] = useState([]);
  // const [faqID, setFaqID] = useState([]);

  // Language selection
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedLanguageValue, setSelectedLanguageValue] = useState([]);

  // Age States
  const [selectedYears, setSelectedYears] = useState(null);
  const [selectedYearsValue, setSelectedYearsValue] = useState(null);

  // Event Tour Show or hide
  const [showEventTour, setShowEventTour] = useState(false);
  const [allEventTourData, setAllEventTourData] = useState([]);
  const [selectedOptionsForEventTour, setSelectedOptionsForEventTour] =
    useState([]);
  const [selectedEventTourID, setSelectedEventTourID] = useState("");

  // Event Tag
  const [selectedEventTag, setSelectedEventTag] = useState();
  const [selectedEventTagID, setSelectedEventTagID] = useState("");

  //  Event Date and Time
  const [eventDate, setEventDate] = useState([]);
  const [eventEditTimeDateOpenModal, setEventEditTimeDateOpenModal] =
    useState(false);
  const [editEventDate, setEditEventDate] = useState({});
  const [openDeleteEventDateModal, setOpenDeleteEventDateModal] =
    useState(false);
  const [
    selectedEventDateAndTimeForDelete,
    setSelectedEventDateAndTimeForDelete,
  ] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // FAQ DATA
  const [faqData, setFaqData] = useState([]);
  const [faqEditModal, setFaqEditModal] = useState(false);
  const [faqDataEditObject, setFaqDataEditObject] = useState({});
  const [deleteFaqDataModal, setDeleteFaqDataModal] = useState(false);
  const [deleteFaqId, setDeleteFaqId] = useState(null);
  const [showCreateFaqModal, setShowCreateFaqModal] = useState(false);

  // State City and ISO Code and Name
  const [stateIsoCode, setStateIsoCode] = useState();
  const [stateName, setStateName] = useState();
  const [cityIsoCode, setCityIsoCode] = useState();
  const [cityName, setCityName] = useState();

  // console.log({imageURL})

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const {
    organizerData,
    categorieData,
    artistData,
    genreData,
    // faqData,
    eventTourData,
    allEventTags,
    errorss,
  } = useFetchEventData();

  useEffect(() => {
    if (
      organizerData.length > 0 &&
      categorieData.length > 0 &&
      artistData.length > 0 &&
      genreData.length > 0 &&
      // faqData.length > 0 &&
      eventTourData.length > 0
      // allEventTags.length > 0
    ) {
      setAllDataFetched(true);
    }
  }, [
    organizerData,
    categorieData,
    artistData,
    genreData,
    // faqData,
    eventTourData,
    // allEventTags,
  ]);

  useEffect(() => {
    if (allDataFetched) {
      getEventDataById();
    }
  }, [allDataFetched]);

  const getEventDataById = async () => {
    try {
      const payload = {
        event_id: _id,
      };

      let response = await axios.post(
        `${eventEndPoint.GET_EVENTDATA_BY_ID}`,
        payload
      );

      console.log(response.data);

      setEventData(response.data.data);
      setEventCarouselImages(response.data.data.EventCarouselImages);
      setEventGalleryImages(response?.data?.data?.EventGalleryImages);

      // Venue Selection
      if (response.data.data.VenueEventFlag == "1") {
        setSelectedLocationType("venue");

        const imagePath =
          response?.data?.data?.Venue_layout_ImagePath?.startsWith("/")
            ? response?.data?.data?.Venue_layout_ImagePath
            : `/${response?.data?.data?.Venue_layout_ImagePath}`;
        // Add the base URL before storing the image path
        setImageURL(`${BASE_URL}${imagePath}`);
      } else if (response.data.data.OnlineEventFlag == "1") {
        setSelectedLocationType("online");
      } else {
        setSelectedLocationType("tba");
      }

      handlerCallVenueData(response.data.data.venue_id);

      // OrganizerData selection

      if (response.data.data.CreatedBy === "3") {
        const organizerDataById = response.data.data.createduser_id;
        // Convert string to array of objects
        const transformedData = [{ organizer_id: organizerDataById }];
        handlerSelectedOrganizer(transformedData);
      } else {
        const organizerDataById = response.data.data.EventOrganizers;
        handlerSelectedOrganizer(organizerDataById);
      }

      // Categories Data Selction
      const categorieDataById = response.data.data.EventCategories;
      handlerSelectedCategories(categorieDataById);

      // Artist Data Selection
      const artistDataById = response.data.data.EventArtist;
      handlerSelectedArtist(artistDataById);

      // Genre Data Selection
      const genreDataById = response.data.data.EventGenre;
      handlerSelectedGenre(genreDataById);

      // setSelectedLanguageValue(response.data.data.EventLanguage);

      // Set Event Tour Data
      const eventTourCheck = response.data.data.EventTour_id;

      setStateName(response?.data?.data?.VenueToBeAnnouncedState);
      setStateIsoCode(response?.data?.data?.VenueToBeAnnouncedStateIsoCode);
      setCityIsoCode(response?.data?.data?.VenueToBeAnnouncedCityIsoCode);
      setCityName(response?.data?.data?.VenueToBeAnnouncedCity);

      if (eventTourCheck !== null || eventTourCheck !== undefined) {
        handlerSelectEventTourData(eventTourCheck);
        setSelectedEventTourID(eventTourCheck);
      }

      // setEventDate(response.data.data.EventDateTime)
      handlerSetEventDateAndTime(response.data.data.EventDateTime);

      // Event Tag data
      // const eventTagID = response.data.data.EventTag_id;
      // handlerSelectedEventTag(eventTagID);
      // setSelectedEventTagID(eventTagID);

      const ageSelection = response.data.data.BestSuitedFor;
      handlerAgeSelection(ageSelection);

      // FAQ Data Selection
      const faqDataById = response.data.data.EventFAQs;
      setFaqData(faqDataById);

      // Language Selection
      const transformedEventLanguages = response.data.data.EventLanguages.map(
        (language) => ({
          value: language,
          label: language,
        })
      );

      setSelectedLanguage(transformedEventLanguages);

      console.log(response.data);
      setAllDataFetched(false);
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
          setAllDataFetched(false);
        }
      }
    }
  };

  const handlerCallVenueData = async (venueId) => {
    try {
      const FetchVenueData = await axios.get(
        `${venueEndPoint.ALL_VENUE_DATA_LIST}`
      );

      handlerSelectedVenueId(FetchVenueData.data.data, venueId);
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

  const handlerSelectedVenueId = (allVenueData, selectedVenuId) => {
    const selectedId = selectedVenuId;

    // console.log({allVenueData})
    // console.log({selectedVenuId})
    // Check which selected ID exists in eventTagData

    const matchedOption = allVenueData.find(
      (tag) => tag._id === selectedVenuId
    );

    const matchedOptions = matchedOption
      ? {
          value: matchedOption._id,
          label: matchedOption.Name,
        }
      : {};

    // Update state with matched options
    // console.log({ matchedOptions });
    setSelectedOptionsForVenue(matchedOptions);
    setSelectedVenueID(matchedOptions);

    // Filter out matched option from allEventTagData
    const updatedAllEventTagData = allVenueData
      .filter((tag) => tag._id !== selectedId)
      .map((tag) => ({
        value: tag._id,
        label: tag.Name,
      }));

    // console.log({updatedAllEventTagData})

    // Update state with unmatched options
    setAllEventVenueData(updatedAllEventTagData);
  };

  const handleSelectVemueId = (selected) => {
    setSelectedOptionsForVenue(selected);
    setSelectedVenueID(selected);
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const maxSize = 500 * 1024;
  //   // if (selectedFile) {
  //   //   setFile(selectedFile);
  //   // const newImageURL = URL.createObjectURL(selectedFile);
  //   // setImageURL(newImageURL);
  //   // }

  //   if (/\.(jpe?g|png)$/i.test(file.name)) {
  //     if (file.size < maxSize) {
  //       setFile(file);
  //       const newImageURL = URL.createObjectURL(selectedFile);
  //       setImageURL(newImageURL);
  //     } else {
  //       e.target.value = "";
  //       toast.error("Image size should be less than 500KB");
  //     }
  //   } else {
  //     toast.error("Invalid Image File. Please select a JPEG or PNG image.");
  //   }
  // };

  // Event Date and Time Formatting

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

  const handlerSetEventDateAndTime = (EventDateTime) => {
    // console.log({ EventDateTime });

    const transformedData = EventDateTime.map((event) => {
      const [EventEndDate, EventEndTime] = event.EventEndDateTime.split("T");
      const [EventStartDate, EventStartTime] =
        event.EventStartDateTime.split("T");

      return {
        ...event,
        EventEndDate,
        EventEndTime: EventEndTime.split(".")[0], // Removing milliseconds and Z
        EventStartDate,
        EventStartTime: EventStartTime.split(".")[0], // Removing milliseconds and Z
      };
    });

    // console.log({ transformedData });
    setEventDate(transformedData);
  };

  // Organizer function
  const handlerSelectedOrganizer = (selectedOptions) => {
    // Extract the selected IDs

    const selectedIds = selectedOptions.map((option) => option._id);

    // Check which selected IDs exist in organizerData
    const matchedOptions = [];

    selectedOptions.map((options) => {
      const organizer = organizerData.find(
        (org) => org._id == options.organizer_id
      );
      if (organizer) {
        matchedOptions.push({
          value: organizer._id,
          label: organizer.Username,
        });
      }
    });

    // Update state with matched options
    setSelectedOptions(matchedOptions);
    setOrganizerID(matchedOptions);

    // Filter out matched options from AllorganizerData
    const updatedAllorganizerData = organizerData
      .filter((organizer) => !selectedIds.includes(organizer._id))
      .map((organizer) => ({
        value: organizer._id,
        label: organizer.Username,
      }));

    // Update state with unmatched options
    setAllOrganizerData(updatedAllorganizerData);
  };

  const handleSelectChangeOrganizer = (selected) => {
    setSelectedOptions(selected);
    // const organizerIds = selected.map((id) => ({ organizer_id: id.value }));
    // console.log({ organizerIds });
    setOrganizerID(selected);
  };

  // console.log({organizerID})

  // Categories Functions
  const handlerSelectedCategories = (selectedCategoryOptions) => {
    const selectedIds = selectedCategoryOptions.map((option) => option._id);

    // Check which selected IDs exist in organizerData
    const matchedOptions = [];

    selectedCategoryOptions.map((options) => {
      const category = categorieData.find(
        (caty) => caty._id == options.category_id
      );
      if (category) {
        matchedOptions.push({
          value: category._id,
          label: category.Name,
        });
      }
    });

    // Update state with matched options
    setCategoryID(matchedOptions);
    setSelectedOptionsForCategory(matchedOptions);

    // Filter out matched options from AllorganizerData
    const updatedAllorganizerData = categorieData
      .filter((categorie) => !selectedIds.includes(categorie._id))
      .map((categorie) => ({
        value: categorie._id,
        label: categorie.Name,
      }));

    // Update state with unmatched options
    setAllCategoriesData(updatedAllorganizerData);
  };

  const handleSelectChangeCategory = (selected) => {
    setSelectedOptionsForCategory(selected);
    // const categoryID = selected.map((id) => ({ category_id: id.value }));
    console.log({ selected });
    setCategoryID(selected);
  };

  // Artist functions
  const handlerSelectedArtist = (selectedArtistOptions) => {
    // Extract the selected IDs

    const selectedIds = selectedArtistOptions.map((option) => option._id);

    // Check which selected IDs exist in organizerData
    const matchedOptions = [];

    selectedArtistOptions.map((options) => {
      const artist = artistData.find((art) => art._id == options.artist_id);
      if (artist) {
        matchedOptions.push({
          value: artist._id,
          label: artist.Name,
        });
      }
    });

    // Update state with matched options
    setSelectedOptionsForArtist(matchedOptions);
    setArtistID(matchedOptions);

    // Filter out matched options from AllorganizerData
    const updatedAllArtistData = artistData
      .filter((artist) => !selectedIds.includes(artist._id))
      .map((artist) => ({
        value: artist._id,
        label: artist.Name,
      }));

    // Update state with unmatched options
    setAllArtistData(updatedAllArtistData);
  };

  const handleSelectChangeArtist = (selected) => {
    setSelectedOptionsForArtist(selected);
    // const artistID = selected.map((id) => ({ artist_id: id.value }));
    setArtistID(selected);
  };

  // Genre Functions
  const handlerSelectedGenre = (selectedGenreOptions) => {
    // Extract the selected IDs

    const selectedIds = selectedGenreOptions.map((option) => option._id);

    // Check which selected IDs exist in organizerData
    const matchedOptions = [];

    selectedGenreOptions.map((options) => {
      const genre = genreData.find((genre) => genre._id == options.genre_id);
      if (genre) {
        matchedOptions.push({
          value: genre._id,
          label: genre.Name,
        });
      }
    });

    // Update state with matched options
    setSelectedOptionsForGenre(matchedOptions);
    setGenreID(matchedOptions);

    // Filter out matched options from AllorganizerData
    const updatedAllGenreData = genreData
      .filter((genre) => !selectedIds.includes(genre._id))
      .map((genre) => ({
        value: genre._id,
        label: genre.Name,
      }));

    // Update state with unmatched options
    setAllGenreData(updatedAllGenreData);
  };

  const handleSelectChangeGenre = (selected) => {
    setSelectedOptionsForGenre(selected);
    // const genreID = selected.map((id) => ({ genre_id: id.value }));
    setGenreID(selected);
  };

  // Language selection
  const handleLanguageChange = (selectedOption) => {
    console.log({ selectedOption });
    setSelectedLanguage(selectedOption);
    setSelectedLanguageValue(selectedOption);
  };

  // Age selection

  const handlerAgeSelection = (ageSelected) => {
    yearsOptions.forEach((option) => {
      if (option.value == ageSelected) {
        setSelectedYears(option);
        setSelectedYearsValue(option.value);
        return;
      }
    });
  };

  const handleYearsChange = (selectedOption) => {
    setSelectedYears(selectedOption);
    console.log({ selectedOption });
    setSelectedYearsValue(selectedOption.value);
  };

  // Event TagID
  // const handlerSelectedEventTag = (selectedEventTagIdapi) => {
  //   const selectedId = selectedEventTagIdapi;

  //   // Check which selected ID exists in eventTagData
  //   const matchedOption = allEventTags.find((tag) => tag._id === selectedId);

  //   const matchedOptions = matchedOption
  //     ? [
  //         {
  //           value: matchedOption._id,
  //           label: matchedOption.EventTagName,
  //         },
  //       ]
  //     : [];

  //   // console.log({matchedOptions})
  //   // Update state with matched options
  //   setSelectedEventTag(matchedOptions);

  //   // Filter out matched option from allEventTagData
  //   const updatedAllEventTagData = allEventTags
  //     .filter((tag) => tag._id !== selectedId)
  //     .map((tag) => ({
  //       value: tag._id,
  //       label: tag.Name,
  //     }));

  //   // console.log({updatedAllEventTagData})

  //   // Update state with unmatched options
  //   // setAllEventTagData(updatedAllEventTagData);
  // };

  // const formattedEventTags = [
  //   ...allEventTags?.map((tag) => ({
  //     value: tag._id,
  //     label: tag.EventTagName,
  //   })),
  // ];

  const handleSelectChangeEventTag = (selected) => {
    setSelectedEventTag(selected);
    setSelectedEventTagID(selected.value);
  };

  // Event Tour Functions

  const handlerSelectEventTourData = (eventTourId) => {
    const selectedIds = eventTourId;

    // console.log({eventTourData})
    // console.log({eventTourId})

    const matchedOptions = [];
    eventTourData.map((option) => {
      const eventTour = eventTourId == option?._id;
      if (eventTour) {
        matchedOptions.push({
          value: option._id,
          label: option.Name,
        });
      }
    });

    // console.log({ matchedOptions });

    setSelectedOptionsForEventTour(matchedOptions);
    setSelectedEventTourID(matchedOptions.value);

    const updatedAllEventTourData = eventTourData
      .filter((eventTour) => eventTourId !== selectedIds)
      .map((eventTour) => ({
        value: eventTour._id,
        label: eventTour.Name,
      }));

    // console.log({ updatedAllEventTourData });

    setAllEventTourData(updatedAllEventTourData);
    setShowEventTour(true);
  };

  const handleSelectChangeEventTour = (selected) => {
    setSelectedOptionsForEventTour(selected);
    setSelectedEventTourID(selected.value);
  };

  const initialValues = loading
    ? {
        eventVisibility: "",
        eventType: "",
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
        rejectEventRemark: "",
      }
    : {
        eventVisibility: eventData?.EventVisibility,
        eventType: eventData.EventType,
        bookingphonenumber: eventData?.BookingPhoneNumber
          ? eventData.BookingPhoneNumber
          : 9730589111,
        whatsappnumber: eventData?.WhatsAppPhoneNumber
          ? eventData.WhatsAppPhoneNumber
          : 9730589111,
        venue_id: "",
        onlineEventUrl: eventData?.Online_Event_Link,
        eventname: eventData?.EventName,
        eventDescription: eventData?.EventDescription,
        isFeatured: eventData.FeaturedEventFlag,
        eventTermsandConditions: eventData.EventTermsCondition,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        eventVideoUrl: eventData?.EventVedioUrl ?? "",
        feeunit: eventData.CreatedBy === "3" ? 1 : eventData.ConvinienceFeeUnit,
        feevalue: eventData.ConvinienceFeeValue,
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
    // validationSchema: superAdminEventCreationObjectSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (selectedYearsValue === null || selectedYearsValue === undefined) {
        return toast.error("Please select Age");
      }

      // Date and time validation

      const formData = new FormData();

      formData.append("event_id", _id);
      formData.append("EventType", values.eventType);

      const isValidPhoneNumber = (number) => {
        // Check if the number is a string of 10 digits
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(number);
      };

      if (values.eventType == 1) {
        if (isValidPhoneNumber(values.bookingphonenumber)) {
          formData.append("BookingPhoneNumber", values.bookingphonenumber);
        } else {
          toast.error(
            "Invalid Booking Phone Number: Must be a 10-digit number"
          );
          // Handle the invalid number case, e.g., by showing an error message
          return; // Stop submission if the number is invalid
        }
      } else if (values.eventType == 3) {
        if (isValidPhoneNumber(values.whatsappnumber)) {
          formData.append("WhatsAppPhoneNumber", values.whatsappnumber);
        } else {
          toast.error(
            "Invalid WhatsApp Phone Number: Must be a 10-digit number"
          );
          // Handle the invalid number case, e.g., by showing an error message
          return; // Stop submission if the number is invalid
        }
      }

      formData.append("EventVisibility", values.eventVisibility);

      if (
        values.eventVideoUrl !== null &&
        values.eventVideoUrl !== "" &&
        values.eventVideoUrl !== undefined
      ) {
        formData.append("EventVedioUrl", values.eventVideoUrl);
      }

      if (selectedLocationType === "venue") {
        console.log({ selectedVenueID });
        formData.append("venue_id", selectedVenueID.value);
        console.log(selectedVenueID.value);
        if (file !== null) {
          formData.append("VenueLayout", file);
        }
        formData.append("VenueToBeAnnounced", EventVenueTobeAnnounced.No);
        formData.append("OnlineEventFlag", IsOnlineEvent.No);
        formData.append("VenueEventFlag", IsVenueAvailable.Yes);

        console.log({ file });
      } else if (selectedLocationType === "online") {
        formData.append("Online_Event_Link", values.onlineEventUrl);
        formData.append("VenueToBeAnnounced", EventVenueTobeAnnounced.No);
        formData.append("VenueEventFlag", IsVenueAvailable.No);
        formData.append("OnlineEventFlag", IsOnlineEvent.Yes);
      } else {
        formData.append("VenueToBeAnnounced", EventVenueTobeAnnounced.Yes);
        formData.append("VenueEventFlag", IsVenueAvailable.No);
        formData.append("OnlineEventFlag", IsOnlineEvent.No);
        formData.append("VenueToBeAnnouncedState", stateName);
        formData.append("VenueToBeAnnouncedStateIsoCode", stateIsoCode);
        formData.append("VenueToBeAnnouncedCity", cityName);
        formData.append("VenueToBeAnnouncedCityIsoCode", cityIsoCode);
      }

      const organizer = organizerID.map((item) => ({
        organizer_id: item.value,
      }));
      // console.log({ organizer });
      formData.append("EventOrganizers", JSON.stringify(organizer));
      // const category = categoryID.map((item) => ({
      //   category_id: item.value
      // }));

      console.log(categoryID.value);
      const category = [
        {
          category_id: categoryID.value,
        },
      ];

      formData.append("EventCategories", JSON.stringify(category));
      const artist = artistID.map((item) => ({ artist_id: item.value }));
      formData.append("EventArtist", JSON.stringify(artist));
      const genre = genreID.map((item) => ({ genre_id: item.value }));
      formData.append("EventGenre", JSON.stringify(genre));

      const languages = selectedLanguage.map((item) => item.value);
      console.log({ languages });
      formData.append("EventLanguages", JSON.stringify(languages));

      formData.append("BestSuitedFor", selectedYearsValue);
      if (eventData.EventStatus !== "3") {
        formData.append("EventName", eventData?.EventName);
      }

      formData.append("EventTour_id", selectedEventTourID);
      formData.append("EventDescription", values.eventDescription);
      formData.append("EventTermsCondition", values.eventTermsandConditions);
      formData.append("FeaturedEventFlag", values.isFeatured);

      // formData.append("EventVedioUrl", values.eventVideoUrl);
      formData.append("ConvinienceFeeUnit", values.feeunit);
      formData.append("ConvinienceFeeValue", values.feevalue);
      if (eventStatus === EventStatus.ReviewRejected) {
        formData.append("Status", eventStatus);
        formData.append("EventRejectRemark", values.rejectEventRemark);
      } else {
        formData.append("Status", eventStatus);
      }

      formData.append("TourEvent", eventData.TourEvent);
      if (Number(values.feeunit) === 2 && values.feevalue > 100) {
        toast.error("Discount percentage should not exceed 100");
        return;
      }

      try {
        let response = await axios.post(
          `${eventEndPoint.UPDATE_EVENT_DATA}`,
          formData
        );

        toast.success(response.data.message);

        console.log(response.data.data);
        setTimeout(() => {
          navigate("/superAdmin/dashboard/event");
        }, 2000);
        setIsReviewModalOpen(false);
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

  console.log({ eventData });

  const handleLocationTypeChange = (locationType) => {
    // console.log({ locationType });
    setSelectedLocationType(locationType);
    if (locationType === "venue") {
      setVenueApiCall(true);
    }
  };

  // const handlerEditEventDateandTime = (eventDateAndTime) => {
  //   setEventEditTimeDateOpenModal(true)
  //   setEditEventDate(eventDateAndTime)
  // }

  const handleDelete = (index) => {
    setSelectedEventDateAndTimeForDelete(index);
    setOpenDeleteEventDateModal(true);
  };

  const handlerEditEventDateandTime = (eventDateAndTime) => {
    setEventEditTimeDateOpenModal(true);
    setEditEventDate(eventDateAndTime);
  };

  const handleSave = async (newEvent) => {
    const startTimeWithSeconds = `${newEvent.EventStartTime}:00`;
    const endTimeWithSeconds = `${newEvent.EventEndTime}:00`;

    // Convert dates to Date objects for comparison
    const startDateTime = new Date(
      `${newEvent.EventStartDate}T${startTimeWithSeconds}`
    );
    const endDateTime = new Date(
      `${newEvent.EventEndDate}T${endTimeWithSeconds}`
    );

    // Check if end date is earlier than start date or if end time is earlier than start time on the same day
    if (endDateTime < startDateTime) {
      toast.error(
        "End date and time cannot be earlier than start date and time"
      );
      return;
    }

    try {
      const payload = {
        event_id: newEvent.Event_id,
        eventDateTime_Id: newEvent._id,
        EventStartDate: newEvent.EventStartDate,
        EventStartTime: newEvent.EventStartTime,
        EventEndDate: newEvent.EventEndDate,
        EventEndTime: newEvent.EventEndTime,
      };

      console.log(payload);

      let response = await axios.post(
        `${eventEndPoint.UPDATE_EVENT_DATE_AND_TIME}`,
        payload
      );

      toast.success(response.data.message);

      setEventDate((prevEvents) =>
        prevEvents.map((event) =>
          event._id === newEvent._id ? newEvent : event
        )
      );

      setEventEditTimeDateOpenModal(false);
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

  // const handleSave = () => {
  //   const currentDateTime = new Date();

  //   // Check if any field is empty
  //   console.log(startDate);
  //   console.log(startTime);
  //   console.log(endDate);
  //   console.log(endTime);
  //   // if (!startDate || !startTime || !endDate || !endTime) {
  //   //   toast.error("All fields are required");
  //   //   return;
  //   // }

  //   // Convert times to a format with seconds (if needed)
  //   const startTimeWithSeconds = `${startTime}:00`;
  //   const endTimeWithSeconds = `${endTime}:00`;

  //   // Convert date and time strings to Date objects
  //   const startDateTime = new Date(`${startDate}T${startTimeWithSeconds}`);
  //   const endDateTime = new Date(`${endDate}T${endTimeWithSeconds}`);

  //   // Check if the start time is in the past
  //   if (startDateTime < currentDateTime) {
  //     toast.error(
  //       "The event start time cannot be in the past. Please select a future start time."
  //     );
  //     return;
  //   }

  //   // Check if the end time is before the start time
  //   if (endDateTime < startDateTime) {
  //     toast.error(
  //       "End date and time cannot be earlier than start date and time."
  //     );
  //     return;
  //   }

  //   // Additional validation: Check if event duration is reasonable (optional)
  //   const eventDuration = endDateTime - startDateTime;
  //   const maxDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  //   if (eventDuration > maxDuration) {
  //     toast.error("Event duration cannot exceed 24 hours.");
  //     return;
  //   }

  //   // Add event to the array of events
  //   const newEvent = {
  //     EventStartDate: startDate,
  //     EventStartTime: startTimeWithSeconds,
  //     EventEndDate: endDate,
  //     EventEndTime: endTimeWithSeconds,
  //   };

  //   // Save the event and reset form fields
  //   setEvents([...events, newEvent]);
  //   setStartDate("");
  //   setStartTime("");
  //   setEndDate("");
  //   setEndTime("");

  //   // toast.success("Event saved successfully!");
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

  const handleAddNewDate = async () => {
    // Check if any field is empty
    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("All fields are required");
      return;
    }

    // Add seconds to endTime (00 seconds)
    const endTimeWithSeconds = `${endTime}:00`;
    const startTimeWithSeconds = `${startTime}:00`;

    // Add event to array of objects

    try {
      const payload = {
        event_id: _id,
        EventStartDate: startDate,
        EventStartTime: startTimeWithSeconds,
        EventEndDate: endDate,
        EventEndTime: endTimeWithSeconds,
      };

      let response = await axios.post(
        `${eventEndPoint.CREATE_NEW_EVENT_DATE_AND_TIME}`,
        payload
      );

      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");

      toast.success(response.data.message);

      console.log(response.data.data);

      const newDateTimeFormate = transformEventDateTime(response.data.data);

      setEventDate((prevEventDate) => [...prevEventDate, newDateTimeFormate]);
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

    // Reset all fields to their initial state

    // setEvents([...events, newEvent]);
  };

  // console.log({eventDate})

  // Const delete Event Date and Time
  const confirmDeleteEventDateAndTime = async () => {
    try {
      const payload = {
        event_id: _id,
        eventDateTime_Id: selectedEventDateAndTimeForDelete,
      };

      let response = await axios.post(
        `${eventEndPoint.EVENT_DELETE_DATE_AND_TIME}`,
        payload
      );

      toast.success(response.data.message);

      setEventDate((prevEvents) =>
        prevEvents.filter(
          (event) => event._id !== selectedEventDateAndTimeForDelete
        )
      );

      setOpenDeleteEventDateModal(false);
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

  // FAQ Functions

  const handleEditFAQ = (faq) => {
    setFaqEditModal(true);
    setFaqDataEditObject(faq);
  };

  const updateFAQData = (updatedFAQ) => {
    console.log({ updatedFAQ });

    setFaqData((prevFaqData) =>
      prevFaqData.map((faq) => (faq._id === updatedFAQ._id ? updatedFAQ : faq))
    );
  };

  const confirmDeleteFAQ = (faq_id) => {
    setDeleteFaqDataModal(true);
    setDeleteFaqId(faq_id);
  };

  // Delete Faq
  const handleDeleteFAQ = async () => {
    try {
      const payload = {
        event_id: _id,
        eventFaq_Id: deleteFaqId,
      };

      let response = await axios.post(
        `${eventEndPoint.DELETE_EVENT_FAQ}`,
        payload
      );

      toast.success(response.data.message);

      setFaqData((prevFaqs) =>
        prevFaqs.filter((faq) => faq._id !== deleteFaqId)
      );

      setDeleteFaqDataModal(false);
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

  const handleNewFAQ = (newFAQ) => {
    // setFaqData((prevData) => [...prevData, newFAQ]);
    setFaqData(newFAQ);
  };

  const HandlerEventStatus = (status) => {
    setEventStatus(status);
    // console.log(status);
    handleSubmit();
  };

  // Feature Event Togle
  const toggleSwitch = () => {
    setFieldValue("isFeatured", values.isFeatured === 1 ? 0 : 1);
  };

  const openReviewModal = (status) => {
    setIsReviewModalOpen(true);
    setEventStatus(status);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const saveReview = () => {
    handleSubmit();
    // setIsReviewModalOpen(false);
  };

  const renderButtons = (status) => {
    switch (status) {
      case EventStatus.Draft:
        return (
          <div className="flex w-[94%] justify-end mt-[3%]">
            <button
              className="py-2.5 px-3 border-[1px] border-Gray85 mr-[4%]"
              type="button"
              onClick={() => HandlerEventStatus(EventStatus.Draft)}
            >
              Save as draft
            </button>
            <button
              className="py-2.5 px-3 bg-Gray40 text-white"
              type="button"
              onClick={() => HandlerEventStatus(EventStatus.Published)}
            >
              Publish
            </button>
          </div>
        );

      case EventStatus.Published:
        return (
          <div className="flex w-[94%] justify-end mt-[3%]">
            <button
              className="py-2.5 px-3 bg-Gray40 text-white"
              type="button"
              onClick={() => HandlerEventStatus(EventStatus.Published)}
            >
              Update
            </button>
          </div>
        );

      case EventStatus.InReview:
        return (
          <div className="flex w-[94%] justify-end mt-[3%]">
            <button
              className="py-2.5 px-3 border-[1px] border-Gray85 mr-[4%]"
              type="button"
              onClick={() => openReviewModal(EventStatus.ReviewRejected)}
            >
              Reject
            </button>
            <button
              className="py-2.5 px-3 bg-Gray40 text-white"
              type="button"
              onClick={() => HandlerEventStatus(EventStatus.Published)}
            >
              Publish
            </button>
            {/* Modal for Review */}
            {isReviewModalOpen && (
              <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white p-4 rounded-md md:w-[50%]">
                  <h3 className="text-black font-bold text-2xl">Send Remark</h3>
                  <textarea
                    className="w-full mt-2 p-2 border rounded-md"
                    rows="5"
                    placeholder="Enter your remark..."
                    id="rejectEventRemark"
                    name="rejectEventRemark"
                    value={values.rejectEventRemark}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      className="py-2.5 px-3 mr-4"
                      type="button"
                      onClick={closeReviewModal}
                    >
                      Close
                    </button>
                    <button
                      className="py-2.5 px-3 bg-Gray40 text-white"
                      type="button"
                      onClick={saveReview}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case EventStatus.ReviewRejected:
        return (
          <div className="flex w-[94%] justify-end mt-[3%]">
            <button
              className="py-2.5 px-3 bg-Gray40 text-white"
              type="button"
              onClick={() => navigate("/superAdmin/dashboard/event")}
            >
              Close
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Toaster />
      <div className="mt-[3%] ml-[2%]">
        <Breadcrumb path={"Event"} />
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/superAdmin/dashboard/event")}
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
        <h1 className="text-3xl font-semibold -mt-2">Edit Event</h1>
      </div>

      {/* Event Edit Section  */}

      {!loading && (
        <form className="w-full md:flex-row flex-col flex justify-between mb-8">
          {/* Left Side Data */}
          <div className="md:w-[49%] mt-4 md:mb-0 mb-6">
            <div className="relative">
              <p className="pl-4 text-lg relative text-black font-semibold">
                Update Carousel Images*
              </p>
              <div className="absolute  top-2 left-52 ml-4 flex flex-col items-center group">
                <MdInfoOutline />
                <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                  <span className="relative w-96 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                    The maximum allowed file size is 500kb
                  </span>
                  <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                </div>
              </div>
            </div>

            <p className="pl-4 text-sm">
              First image will be used for thumbnail
            </p>
            <EditCarouselImage
              eventCarouselImages={eventCarouselImages}
              setEventCarouselImages={setEventCarouselImages}
            />
            <div>
              <Toaster />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div>
                  <div className="w-full mt-4 bg-Gray85 h-auto p-3 ">
                    {/* Event Visibility Div */}
                    <div className=" ">
                      <div className="relative">
                        <p className="text-black font-semibold text-xl">
                          Event Visibility*
                        </p>
                        <div className="absolute top-2 left-36 flex flex-col group items-center">
                          <MdInfoOutline />
                          <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex ">
                            <span className="relative w-96 left-9 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                              Public Event: The event will be published online
                              and offline.
                              <span className="mt-2 inline-block">
                                Private Event: The event will only be held
                                offline, not visible online.
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
                            checked={values.eventVisibility == "1"}
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
                            checked={values.eventVisibility == "2"}
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

                    <div className=" mt-3 ">
                      <p className="text-black font-semibold text-xl">
                        Event Type*
                      </p>
                      <div className="w-[85%] flex justify-between mt-1.5">
                        {/* Event Type Booking */}
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

                        {/* Event Type Registration */}
                        <div>
                          <input
                            type="radio"
                            name="eventType"
                            id="registration"
                            value={EventType.Registration}
                            checked={values.eventType == "2"}
                            className="mr-2 transform scale-150"
                            onChange={handleChange}
                          />
                          <label
                            className="text-black font-semibold"
                            htmlFor="registration"
                          >
                            Registration
                          </label>
                        </div>

                        {/* Event Type Whatsapp */}
                        <div>
                          <input
                            type="radio"
                            name="eventType"
                            id="whatsapp"
                            value={EventType.WhatsApp}
                            checked={values.eventType == "3"}
                            className="mr-2 transform scale-150"
                            onChange={handleChange}
                          />
                          <label
                            className="text-black font-semibold"
                            htmlFor="whatsapp"
                          >
                            Whatsapp
                          </label>
                        </div>
                      </div>

                      {/* Conditionally render the input field based on selected event type */}
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
                            className="bg-gray-100 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                    </div>

                    <div className="mt-3">
                      <p className="text-black font-semibold text-xl">
                        Location*
                      </p>
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

                    {selectedLocationType === "venue" && (
                      <div className="mt-2">
                        <div className="relative">
                          <p className="text-black relative ">Venue</p>
                          <div className="absolute  top-1 left-10 ml-2 flex flex-col items-center group">
                            <MdOutlineInfo />
                            <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                              <span className="relative w-96 left-32 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                                Select Venue: Choose from our venue directory.
                              </span>
                              <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                            </div>
                          </div>
                        </div>
                        <Select
                          name="venueData"
                          options={allEventVenueData}
                          className="basic-single-select bg-Gray40"
                          classNamePrefix="select"
                          onChange={handleSelectVemueId}
                          value={selectedOptionsForVenue}
                          isClearable
                        />

                        <div className="mt-4">
                          <div>
                            <img
                              src={imageURL}
                              alt="Selected or Default"
                              className="mb-4"
                            />
                          </div>
                          <div className="mt-4">
                            <label htmlFor="">Select venue layout:</label>
                            <input
                              autoComplete="off"
                              id="File"
                              type="file"
                              accept="image/jpeg , image/png , image/jpg"
                              placeholder="Select image"
                              multiple
                              onChange={handleFileChange}
                              className="border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full py-2 mb-4"
                            />
                          </div>
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
                        <EditAddress
                          StateIsoCode={
                            eventData?.VenueToBeAnnouncedStateIsoCode
                          }
                          CityIsoCode={eventData?.VenueToBeAnnouncedCityIsoCode}
                          // State value
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

                    {/* Organizer Data */}
                    <div>
                      <div className="mt-3">
                        <p className="text-black font-semibold text-lg mb-1">
                          Organizers*
                        </p>
                        <Select
                          isMulti
                          name="colors"
                          options={AllorganizerData}
                          className="basic-multi-select bg-Gray40"
                          classNamePrefix="select organizer"
                          onChange={handleSelectChangeOrganizer}
                          value={selectedOptions}
                        />
                      </div>
                    </div>

                    {/* Category selection */}
                    <div>
                      <div className="mt-3">
                        <p className="text-black font-semibold text-lg mb-1">
                          Select Category*
                        </p>
                        <Select
                          name="colors"
                          options={allCategoriesData}
                          className="basic-multi-select bg-Gray40"
                          classNamePrefix="select organizer"
                          onChange={handleSelectChangeCategory}
                          value={selectedOptionsForCategory}
                        />
                      </div>
                    </div>

                    {/* Artist Selection */}
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
                        />
                      </div>
                    </div>

                    {/* Genre selection */}
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
                        />
                      </div>
                    </div>

                    {/* FAQ selection */}
                    {/* <div>
                      <div className="mt-3">
                        <p className="text-black font-semibold text-lg mb-1">
                          Select FAQ*
                        </p>
                        <Select
                          isMulti
                          name="colors"
                          options={allFaqData}
                          className="basic-multi-select bg-Gray40"
                          classNamePrefix="select Genre"
                          onChange={handleSelectChangeFAQ}
                          value={selectedOptionsForFaq}
                          filterOption={customFilterOption}
                        />
                      </div>
                    </div> */}

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

                    {/* Age selection */}
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

                    {/*  */}

                    <div className="flex w-[100%] justify-between mt-3">
                      <div className="w-[49%]">
                        <label
                          htmlFor="feeunit"
                          className="block mb-2 font-semibold text-lg   text-gray-900 "
                        >
                          Convenience Fee Unit*
                        </label>
                        <select
                          id="feeunit"
                          name="feeunit"
                          value={values.feeunit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        >
                          {Object.keys(ConvinienceFeeUnit).map((key) => (
                            <option key={key} value={ConvinienceFeeUnit[key]}>
                              {key}
                            </option>
                          ))}
                        </select>
                        {errors.feeunit && touched.feeunit ? (
                          <p className="font-Marcellus text-start text-red-900">
                            {errors.feeunit}
                          </p>
                        ) : null}
                      </div>

                      <div className="w-[49%]">
                        <label
                          htmlFor="feevalue"
                          className="block mb-2 font-semibold text-lg  w-full  text-gray-900 "
                        >
                          Convinience Fee Value*
                        </label>
                        <input
                          type="text"
                          id="feevalue"
                          name="feevalue"
                          value={values.feevalue}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        />
                        {errors.feevalue && touched.feevalue ? (
                          <p className="font-Marcellus text-start text-red-900">
                            {errors.feevalue}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side Data */}
          <div className="md:w-[50%]">
            {/* Event Name  */}
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

            {showEventTour && selectedEventTourID !== null && (
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
                  />
                </div>
              </div>
            )}

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
                />
              </div>
            </div> */}

            {/* Event Description */}
            <div className="mt-4">
              <label
                htmlFor="eventDescription"
                className="block mb-2 text-black font-semibold text-lg text-start  "
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
                    [{ font: [] }, { size: ["small", false, "large", "huge"] }], // Font size dropdown
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

            {/* Featured Event */}
            <div className="w-full">
              <div className="flex pb-3">
                <label
                  htmlFor="toggle"
                  className="flex items-center cursor-pointer mr-2"
                >
                  <div className="relative mt-2 mr-3">
                    <input
                      id="toggle"
                      type="checkbox"
                      className="hidden"
                      checked={values.isFeatured === 1}
                      onChange={toggleSwitch}
                    />
                    <div
                      className={`toggle-switch w-10 h-6 mt-2.5 bg-gray-300 rounded-full p-1 ${
                        values.isFeatured === 1 ? "bg-green-700" : "bg-Gray40"
                      }`}
                    >
                      <div
                        className={`toggle-thumb w-4 h-4 bg-white rounded-full shadow-md transform ${
                          values.isFeatured === 1 ? "translate-x-full" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="flex h-full justify-center items-center mt-[5%]">
                    Make As Featured Event
                  </p>
                </label>
              </div>
              {errors.isFeatured && touched.isFeatured ? (
                <p className="text-red-900">{errors.isFeatured}</p>
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

            <div className="mt-4">
              <label
                htmlFor="eventTermsandConditions"
                className="block mb-2 text-black font-semibold text-lg text-start  "
              >
                Event Terms and Conditions*
              </label>
              <ReactQuill
                id="eventTermsandConditions"
                name="eventTermsandConditions"
                value={values.eventTermsandConditions}
                onChange={(value) =>
                  setFieldValue("eventTermsandConditions", value)
                }
                // onBlur={handleBlur}
                className="w-full h-52 overflow-y-scroll bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 "
                theme="snow"
                modules={{
                  toolbar: [
                    [{ font: [] }, { size: ["small", false, "large", "huge"] }], // Font size dropdown
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

            {/* Date and Time  */}
            <div>
              <div className="relative">
                {eventData.EventStatus != "3" ? (
                  <p className="mt-4 relative text-lg text-black font-semibold">
                    Add Date & Time
                  </p>
                ) : (
                  <p className="mt-4 text-lg relative text-black font-semibold">
                    Edit Date & Time
                  </p>
                )}
                <div className="absolute  top-2 left-32 ml-4 flex flex-col items-center group">
                  <MdOutlineInfo />
                  <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                    <span className="relative w-96 left-8 rounded-md z-10 p-4 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg">
                      Single Day Event: Set the start and end times.
                      <span className="mt-2 inline-block">
                        Multiple Day Event: Add another date for each day of the
                        event.
                      </span>
                    </span>
                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                  </div>
                </div>
              </div>

              <div className="w-full h-auto bg-grayshade mb-6">
                {/* Start Date */}
                {eventData.EventStatus != "3" && (
                  <>
                    <div className="flex w-full">
                      <div className="p-2 flex flex-col w-[49%]">
                        <label htmlFor="date" className="mb-1.5">
                          Select Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
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
                          min={startDate}
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
                        onClick={() => handleAddNewDate()}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}

                {eventDate &&
                  eventDate.map((event, index) => (
                    <div
                      key={event._id}
                      className="w-[96%] mx-auto py-2 flex justify-between border-b-2"
                    >
                      <p>
                        {formatDate3(event.EventStartDate)} -{" "}
                        {formatDate3(event.EventEndDate)}
                      </p>
                      <p>
                        {event.EventStartTime} - {event.EventEndTime}
                      </p>
                      <p className="flex">
                        <span>
                          <TbEdit
                            size={25}
                            className="mr-2 cursor-pointer"
                            onClick={() => handlerEditEventDateandTime(event)}
                          />
                        </span>
                        {eventData.EventStatus != "3" && (
                          <span>
                            <IoTrashBinSharp
                              onClick={() => handleDelete(event._id)}
                              size={25}
                              className="cursor-pointer"
                            />
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Edit Date and Time  */}
            {eventEditTimeDateOpenModal && (
              <div>
                <EditEventTimeDateModal
                  editEventDate={editEventDate}
                  setEventEditTimeDateOpenModal={setEventEditTimeDateOpenModal}
                  handleSave={handleSave}
                />
              </div>
            )}

            {openDeleteEventDateModal && (
              <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white p-4 rounded-md md:w-[50%]">
                  <h2 className="text-lg font-bold">
                    Are you sure you want to delete this Event Date and Time?
                  </h2>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => confirmDeleteEventDateAndTime()}
                      className="px-4 py-2 mr-2 text-white bg-red-600 rounded-md"
                      type="button"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setOpenDeleteEventDateModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="relative">
                <h1 className="text-base relative font-semibold">
                  Manage Event FAQs*{" "}
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
                  faqData?.map((faq, index) => (
                    <div className="  w-[96%] mx-auto py-2 border-b-[1px] border-Gray85 ">
                      <p className="flex w-[90%] text-base text-black font-normal  ">
                        <span>Q.</span>
                        {faq?.Question}
                      </p>
                      <p className="w-[90%] flex justify-end">
                        <span>
                          <IoTrashBinSharp
                            onClick={() => confirmDeleteFAQ(faq._id)}
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
                        {faq?.Answer}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Create new FAQ Modal  */}
            {showCreateFaqModal && (
              <EditAddnewFAQ
                setShowCreateFaqModal={setShowCreateFaqModal}
                onNewFAQ={handleNewFAQ}
                _id={_id}
              />
            )}

            {/* Edit FAQ Modal  */}
            {faqEditModal && (
              <EditFAQModal
                faqDataEditObject={faqDataEditObject}
                setFaqEditModal={setFaqEditModal}
                _id={_id}
                updateFAQData={updateFAQData}
              />
            )}

            {deleteFaqDataModal && (
              <div className="fixed top-0 left-0 w-full h-[100vh] bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white p-4 rounded-md md:w-[50%]">
                  <h2 className="text-lg font-bold">
                    Are you sure you want to delete this Event FAQ Data?
                  </h2>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleDeleteFAQ()}
                      className="px-4 py-2 mr-2 text-white bg-red-600 rounded-md"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteFaqDataModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="relative">
                <p className="pl-2 text-lg text-black font-semibold">
                  Update Gallery Images
                </p>
                <div className="absolute  top-2 left-44 ml-6  flex flex-col items-center group">
                  <MdOutlineInfo />
                  <div className="absolute bottom-0  flex-col items-center hidden mb-5 group-hover:flex">
                    <span className="relative w-96   leading-relaxed rounded-md z-10 p-4 text-xs  text-white whitespace-no-wrap bg-black shadow-lg">
                      Share any images from past events to be displayed in the
                      gallery.
                    </span>
                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                  </div>
                </div>
              </div>
              <EditGalleryImages
                eventGalleryImages={eventGalleryImages}
                setEventGalleryImages={setEventGalleryImages}
              />
            </div>

            {renderButtons(eventData.EventStatus)}

            {/* {eventData.EventStatus == "3" ? (
              <div className="flex  w-[94%] justify-end mt-[3%]">
                <button
                  className="py-2.5 px-3 bg-Gray40 text-white"
                  type="button"
                  onClick={() => HandlerEventStatus(EventStatus.Published)}
                >
                  Update
                </button>
              </div>
            ) : (
              <div className="flex  w-[94%] justify-end mt-[3%]">
                <button
                  className="py-2.5 px-3 border-[1px] border-Gray85 mr-[4%]"
                  type="button"
                  onClick={() => HandlerEventStatus(EventStatus.Draft)}
                >
                  Save as draft
                </button>
                <button
                  className="py-2.5 px-3 bg-Gray40 text-white"
                  type="button"
                  onClick={() => HandlerEventStatus(EventStatus.Published)}
                >
                  Publish
                </button>
              </div>
            )} */}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditEvent;
