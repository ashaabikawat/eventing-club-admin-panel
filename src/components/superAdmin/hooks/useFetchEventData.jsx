import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { FaqEndPoint, artistEndpoints, categorieEndPoint, eventTagEndPoint, eventTourEndPoint, genreEndPoint, organizerEndpoint } from '../../../services/apis';


const fetchData = async (endpoint, setData, setError) => {
  try {
    const response = await axios.get(endpoint);
    setData(response.data.data || []); // Default to an empty array if no data is returned
  } catch (error) {
    setError(error);
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

const useFetchEventData = () => {
  const [organizerData, setOrganizerData] = useState([]);
  const [categorieData, setCategorieData] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [eventTourData, setEventTourData] = useState([]);
  const [allEventTags, setAllEventTags] = useState([]);

  const [organizerError, setOrganizerError] = useState(null);
  const [categorieError, setCategorieError] = useState(null);
  const [artistError, setArtistError] = useState(null);
  const [genreError, setGenreError] = useState(null);
  const [faqError, setFaqError] = useState(null);
  const [eventTourError, setEventTourError] = useState(null);
  // const [eventTagsError, setEventTagsError] = useState(null);

  useEffect(() => {
    fetchData(organizerEndpoint.GET_ALL_ORGANIZERS_DATA_URL, setOrganizerData, setOrganizerError);
    fetchData(categorieEndPoint.CATEGORIES_DATA_URL, setCategorieData, setCategorieError);
    fetchData(artistEndpoints.ALL_ARTIST_LIST, setArtistData, setArtistError);
    fetchData(genreEndPoint.GENRE_DATA_URL, setGenreData, setGenreError);
    // fetchData(FaqEndPoint.ALL_FAQ_DATA_LIST, setFaqData, setFaqError);
    fetchData(eventTourEndPoint.ALL_EVENT_TOUR_DATA_LIST, setEventTourData, setEventTourError);
    // fetchData(eventTagEndPoint.ALL_EVENT_TAG_DATA, setAllEventTags, setEventTagsError);
  }, []);

  return { 
    organizerData, 
    categorieData, 
    artistData, 
    genreData, 
    // faqData, 
    eventTourData, 
    // allEventTags, 
    errorss: {
      organizerError,
      categorieError,
      artistError,
      genreError,
      // faqError,
      eventTourError,
      // eventTagsError
    }
  };
};

export default useFetchEventData;
