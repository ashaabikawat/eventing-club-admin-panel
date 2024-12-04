// validationUtils.js

export const validateEventCreation = (
  // selectedEventTagID,
  selectedLanguageValue,
  genreID,
  artistID,
  // categoryID,
  organizerID,
  allImageFile
  // galleryImages,
  // faqData
) => {
  if (allImageFile.length === 0) {
    return {
      fileError: "Please Select at least one image for Carousel Images section",
    };
  }

  const validationErrors = {
    organizers: organizerID.length === 0 ? "Organizers field is empty" : "",
    // category: categoryID.length === 0 ? "Category field is empty" : "",
    artist: artistID.length === 0 ? "Artist field is empty" : "",
    genre: genreID.length === 0 ? "Genre field is empty" : "",
    language: !selectedLanguageValue ? "Language field is empty" : "",
    // eventTag: !selectedEventTagID ? "Event Tag field is empty" : "",
  };

  const hasError = Object.values(validationErrors).some((error) => error);

  if (hasError) {
    // Return validation errors
    return validationErrors;
  }

  // if (galleryImages.length === 0) {
  //   return {
  //     galleryError:
  //       "Please Select at least one image for Gallery Images section",
  //   };
  // }

  // if (faqData.length === 0) {
  //   return { faqError: "Please Select at least one FAQ question" };
  // }

  // No errors
  return null;
};
