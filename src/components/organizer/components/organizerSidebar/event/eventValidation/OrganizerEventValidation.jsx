// validationUtils.js

export const OrganizerEventValidation = (
  // selectedEventTagID,
  selectedLanguageValue,
  genreID,
  artistID,
  // categoryID,
  allImageFile
  // galleryImages,
  // faqData
) => {
  const validationErrors = {
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

  if (allImageFile.length === 0) {
    return {
      fileError: "Please Select at least one image for Carousel Images section",
    };
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
