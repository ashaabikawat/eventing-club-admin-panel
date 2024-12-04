import { EventVisibility } from "./helper/Enum";

export const EventVisibilityText = (visibility) => {
  return visibility == EventVisibility.Public ? "Public" : "Private";
};

export const getEventStatusText = (status) => {
  switch (status) {
    case 1:
      return "Draft";
    case 2:
      return "InReview";
    case 3:
      return "Published";
    case 4:
      return "Review Rejected";
    case 5:
      return "Completed";
    default:
      return "Unknown Status";
  }
};
