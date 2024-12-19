export const EventVisibility = {
  Public: 1,
  Private: 2,
};

export const EventType = {
  Booking: 1,
  Registration: 2,
  WhatsApp: 3,
};

export const isEventFeatured = {
  true: 1,
  false: 0,
};

export const EventStatus = {
  Draft: 1,
  InReview: 2,
  Published: 3,
  ReviewRejected: 4,
  Completed: 5,
};

export const AdminRoles = {
  SuperAdmin: 1,
  Employee: 2,
  Organizer: 3,
  Promoter: 4,
};

export const ConvinienceFeeUnit = {
  Amount: 1,
  Percentage: 2,
};

export const EventFormat = {
  EventTour: 1,
  StandardEvent: 0,
};

export const EventVenueTobeAnnounced = {
  Yes: 1,
  No: 0,
};

export const IsVenueAvailable = {
  Yes: 1,
  No: 0,
};

export const IsOnlineEvent = {
  Yes: 1,
  No: 0,
};

export const TicketType = {
  SingleDay: 1,
  MultipleDay: 2,
  SeasonPass: 3,
  BulkTicket: 4,
};

export const TicketVisiblity = {
  All: 1,
  AllCustomers: 2,
  Promoters: 3,
};

export const TicketStatus = {
  Enable: 1,
  Disable: 2,
};

export const TicketAvailability = {
  Available: 1,
  SoldOut: 2,
};

export const ticketEnabledDisabledStatus = {
  Enable: 1,
  Disable: 0,
};

export const BulkCancelStatus = {
  Active: 1,
  Inactive: 2,
};

export const PromocodeStatus = {
  InAtive: 0,
  Active: 1,
  Expired: 2,
};

export const SendDefaultPasswordMail = {
  Yes: 1,
  No: 2,
};

export const BookingTypeOption = [
  {
    id: 1,
    value: 1,
    text: "Summary Booking ",
  },
  {
    id: 2,
    value: 2,
    text: "Transaction Booking",
  },
];

export const limit = 10;

export const userType = {
  Event: 1,
  Organizer: 2,
};

export const scanUserNum = {
  Active: 1,
  Inactive: 0,
};

export const bookingStatus = {
  Booked: 1,
  Cancelled: 2,
};

export const priority = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
];
