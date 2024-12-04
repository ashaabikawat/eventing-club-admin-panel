export const createOrganizerOption = {
  value: "CREATE_NEW",
  label: "+ Create Organizer",
};

export const createCategoryOption = {
  value: "CREATE_NEW_CATEGORY",
  label: "+ Create Category",
};

export const createArtistOption = {
  value: "CREATE_NEW_ARTIST",
  label: "+ Create New Artist",
};

export const createGenreOption = {
  value: "CREATE_NEW_GENRE",
  label: "+ Create New Genre",
};

export const createEventTourOption = {
  value: "CREATE_NEW_EVENT_TOUR",
  label: "+ Create New Event Tour",
};

export const createFAQOption = {
  value: "CREATE_NEW_FAQ",
  label: "+ Create New FAQ",
  search: "Create",
};

export const createEventTagOption = {
  value: "CREATE_NEW_EVENT_TAG",
  label: "+ Create New Event Tag",
};

export const yearsOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i + 1,
  label: i === 23 ? "24 & above years" : `${i + 1}+ years`,
}));

export const indianLanguages = [
  { value: "Assamese", label: "Assamese" },
  { value: "Bengali", label: "Bengali" },
  { value: "Bhojpuri", label: "Bhojpuri" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Hindi", label: "Hindi" },
  { value: "Kannada", label: "Kannada" },
  { value: "Kashmiri", label: "Kashmiri" },
  { value: "Konkani", label: "Konkani" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Marathi", label: "Marathi" },
  { value: "Maithili", label: "Maithili" },
  { value: "Manipuri", label: "Manipuri" },
  { value: "Nepali", label: "Nepali" },
  { value: "Odia", label: "Odia" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Sanskrit", label: "Sanskrit" },
  { value: "Sindhi", label: "Sindhi" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
  { value: "Urdu", label: "Urdu" },
  { value: "Bihari", label: "Bihari" },
  { value: "Chhattisgarhi", label: "Chhattisgarhi" },
  { value: "Dogri", label: "Dogri" },
  { value: "English", label: "English" },
  { value: "Garo", label: "Garo" },
  { value: "Haryanvi", label: "Haryanvi" },
  { value: "Ho", label: "Ho" },
  { value: "Khasi", label: "Khasi" },
  { value: "Kurukh", label: "Kurukh" },
  { value: "Lushai", label: "Lushai" },
  { value: "Magahi", label: "Magahi" },
  { value: "Meitei", label: "Meitei" },
  { value: "Mizo", label: "Mizo" },
  { value: "Nagamese", label: "Nagamese" },
  { value: "Santali", label: "Santali" },
  { value: "Tulu", label: "Tulu" },
];

export const dropdownOptions = [
  {
    id: 1,
    Value: "Today",
  },
  {
    id: 2,
    Value: "Yesterday",
  },
  {
    id: 3,
    Value: "Last 7 Days",
  },
  {
    id: 4,
    Value: "Last 1 Month",
  },
  {
    id: 5,
    Value: "Manual",
  },
  {
    id: 6,
    Value: "Reset",
  },
];
