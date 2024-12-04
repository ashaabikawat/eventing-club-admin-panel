const BASE_URl = import.meta.env.VITE_REACT_APP_BASE_URL;

// AUTH ENDPOINTS
export const authendpoints = {
  LOGIN_API: BASE_URl + "/superadmin/login",
  SUPER_ADMIN_DATA: BASE_URl + "/superadmin/getAll",
  FORGOT_PASSWORD_API: BASE_URl + "/getpasswordresetlink",
};

export const dashboard = {
  ADMIN_PROFILE_API: BASE_URl + "/superadmin/getById ",
  ADMIN_PROFILE_UPDATE_API: BASE_URl + "/superadmin/updateProfile",
  ADMIN_CHANGE_PASSWORD: BASE_URl + "/superadmin/changepassword",
};

// Artist Creation
export const artistEndpoints = {
  ARTIST_CREATE: BASE_URl + "/artist/register",
  ALL_ARTIST_LIST: BASE_URl + "/artist/getall",
  ARTIST_GET_BY_ID: BASE_URl + "/artist/getbyId",
  ARTIST_UPLOAD_IMAGE: BASE_URl + "/artist/upload/image",
  ARTIST_IMAGE_REMOVE: BASE_URl + "/artist/deleteArtist/image",
  ARTIST_DATA_UPDATED: BASE_URl + "/artist/update/data",
  ARTIST_SEARCH_BY_NAME: BASE_URl + "/artist/getArtistDataBySearchKeyword",
  GET_ALL_PAGINATION: BASE_URl + "/artist/getallpaginatedData",
  SEARCH_ARTIST_PAGINATION: BASE_URl + "/artist/getPaginatedSearch",
};

// CategoriesAPI
export const categorieEndPoint = {
  CATEGORIE_CREATION_URL: BASE_URl + "/category/create",
  CATEGORIES_DATA_URL: BASE_URl + "/category/getall",
  CATEGORIES_DATA_BY_ID_URL: BASE_URl + "/category/getbyId",
  CATEGORIES_UPLOAD_IMAGE: BASE_URl + "/category/upload/image",
  CATEGORIES_IMAGE_REMOVE: BASE_URl + "/category/deleteCategory/image",
  CATEGORIES_DATA_UPDATED: BASE_URl + "/category/update/data",
  CATEGORIE_SEARCH_BY_NAME:
    BASE_URl + "/category/getCategoryDataBySearchKeyword",
  GET_ALL_PAGINATION: BASE_URl + "/category/getallpaginatedData",
  SEARCH_CATEGORY_PAGINATION: BASE_URl + "/category/getPaginatedSearch",
};

// GenreAPI
export const genreEndPoint = {
  GENRE_CREATION_URL: BASE_URl + "/genre/create",
  GENRE_DATA_URL: BASE_URl + "/genre/getall",
  GENRE_DATA_BY_ID_URL: BASE_URl + "/genre/getById",
  GENRE_UPLOAD_IMAGE: BASE_URl + "/genre/upload/image",
  GENRE_IMAGE_REMOVE: BASE_URl + "/genre/deleteGenre/image",
  GENRE_DATA_UPDATED: BASE_URl + "/genre/update/data",
  GENRE_SEARCH_BY_NAME: BASE_URl + "/genre/getGenreDataBySearchKeyword",
  GET_ALL_PAGINATION: BASE_URl + "/genre/getallpaginatedData",
  SEARCH_GENRE_PAGINATION: BASE_URl + "/genre/getPaginatedSearch",
};

// Venue APi service
export const venueEndPoint = {
  VENUE_CREATION_URL: BASE_URl + "/venue/create",
  ALL_VENUE_DATA_LIST: BASE_URl + "/venue/getall",
  VENUE_GET_DATA_BY_ID: BASE_URl + "/venue/getById",
  VENUE_UPLOAD_IMAGE: BASE_URl + "/venue/upload/image",
  VENUE_IMAGE_REMOVE: BASE_URl + "/venue/deleteVenue/image",
  VENUE_DATA_UPDATED: BASE_URl + "/venue/update/data",
  VENUE_SEARCH_BY_NAME: BASE_URl + "/venue/getVenueDataBySearchKeyword",

  GET_ALL_PAGINATED: BASE_URl + "/venue/getAllPaginatedData",
  SEARCH_DATA_PAGINATED: BASE_URl + "/venue/getPaginatedSearch",
};

export const FaqEndPoint = {
  FAQ_CREATION_URL: BASE_URl + "/faq/create",
  ALL_FAQ_DATA_LIST: BASE_URl + "/faq/getall",
  FAQ_GET_DATA_BY_ID: BASE_URl + "/faq/getById",
  FAQ_DATA_UPDATED: BASE_URl + "/faq/update",
  FAQ_SEARCH_BY_TAG_NAME: BASE_URl + "/faq/getFaqDataBySearchKeyword",
};

// Organizer API Endpoints
export const organizerEndpoint = {
  REGISTER_ORGANIZER_URL: BASE_URl + "/organizer/register",
  GET_ALL_ORGANIZERS_DATA_URL: BASE_URl + "/organizer/getAll",
  GET_ORGANIZER_DATA_BY_ID_URL: BASE_URl + "/organizer/getById",
  UPDATE_ORGANIZER_PROFILE: BASE_URl + "/organizer/updateProfile",
  UPDATE_ORGANIZER_DATA_URL: BASE_URl + "/events/organizer/update",
  DELETE_ORGANIZER_DATA_URL: BASE_URl + "/organizer/delete",
  PROFILE_CHANGE_PASSWORD: BASE_URl + "/organizer/changepassword",
  SEARCH_ORGANIZER_BY_ORGANIZER_NAME:
    BASE_URl + "/organizer/getOrganizerDataBySearchKeyword",
  ORGANIZER_LOGIN_API_URL: BASE_URl + "/organizer/login",
  CREATE_EVENT_BY_ORGANIZER: BASE_URl + "/events/organizer/create",
  GET_ALL_EVENTS_DATA_BY_ORGANIZER: BASE_URl + "/events/getAll",
  GET_ALL_PUBLISHED_EVENTS_DATA_BY_ORGANIZER:
    BASE_URl + "/events/getPublishEvents",
  GET_ALL_DRAFT_EVENTS_DATA_BY_ORGANIZER: BASE_URl + "/events/getDraftEvents",
  GET_ALL_TBREVIVE_EVENTS_DATA_BY_ORGANIZER:
    BASE_URl + "/events/getReviewEvents",
  GET_ALL_SUPER_ADMIN_SELF_CREATED_EVENTS_BY_ORGANIZER:
    BASE_URl + "/events/getSuperAdminSelfCreatedEvents",
  GET_ALL_REJECTED_EVENTS_DATA_BY_ORGANIZER:
    BASE_URl + "/events/getRejectedEvents",
  ORGANIZER_FORGOT_PASSWORD_SEND_EMAIL:
    BASE_URl + "/organizer/getpasswordresetlink",
  ORGANIZER_FORGOT_PASSWORD_RESET_PASSWORD:
    BASE_URl + "/organizer/resetPassword/",
  FILTER_EVENT_BOOKING_DATA_BY_NAME_AND_DATE_IN_PROMOTER:
    BASE_URl +
    "/eventticketsbooking/getEventSummaryBookingsDatabyFilterforSuperAdminOrganizer",

  GET_ALL_TRANSACTION_BOOKING_DATA_BY_EVENT_AND_ORGANIZER_ID:
    BASE_URl +
    "/eventticketsbooking/getEventTransactionBookingsDataforSuperAdminOrganizer",
  GET_ALL_SUMMARY_BOOKING_DATA_BY_EVENT_AND_ORGANIZER_ID:
    BASE_URl +
    "/eventticketsbooking/getEventSummaryBookingsDataforSuperAdminOrganizer",
  DOWNLOAD_EXECEL_REPORT_OF_TRANSACTION_BOOKING_FOR_ORGANIZER_ID:
    BASE_URl +
    "/eventticketsbooking/getEventTransactionExcelReportforSuperAdminOrganizer",
  DOWNLOAD_EXECEL_REPORT_OF_SUMMARY_BOOKING_FOR_ORGANIZER_ID:
    BASE_URl +
    "/eventticketsbooking/getEventSummaryExcelReportbyFilterforSuperAdminOrganizer",

  // enable organizer

  ENABLE_ORGNAIZER: BASE_URl + "/organizer/enable",

  // DISABLE ORGANIZER
  DISABLE_ORGANIZER: BASE_URl + "/organizer/disable",

  // password reset
  PASSWORD_RESET: BASE_URl + "/organizer/updatepassword",

  // get alll paginated organizer

  GET_ORGANIZER_PAGINATED: BASE_URl + "/organizer/getallpaginatedData",

  // search organizer paginated
  SEARCH_PAGINATION: BASE_URl + "/organizer/getPaginatedSearch",

  // total organizer data

  TOTAL_DATA: BASE_URl + "/organizer/totalSalesData",

  // get alll paginated organizer sales
  GET_ALL_SALES_PAGINATED: BASE_URl + "/organizer/salesData",

  // get all payments
  GET_ALL_ORGANIZER_PAYMENTS: BASE_URl + "/organizer/getAllEventsPayment",

  // add payment
  ADD_PAYMENT: BASE_URl + "/organizer/addPayment",

  // delete payment
  DELETE_PAYMENT: BASE_URl + "/organizer/deleteEventPayment",

  // get all venues,cities and promoters
  GET_ALL_VENUES_CITIES_PROMOTERS:
    BASE_URl + "/events/getVenueCitiesandPromoterDataforEvents",
};

// Promoter API Endpoint
export const promoterEndpoint = {
  REGISTER_PROMOTER_URL: BASE_URl + "/promoter/register",
  GET_ALL_PROMOTER_DATA_URL: BASE_URl + "/promoter/getAll",
  GET_PROMOTER_DATA_BY_ID_URL: BASE_URl + "/promoter/getById",
  UPDATE_PROMOTER_DATA_URL: BASE_URl + "/promoter/updateProfile",
  DELETE_PROMOTER_DATA_URL: BASE_URl + "/organizer/delete",
  SEARCH_PROMOTER_BY_PROMOTER_NAME:
    BASE_URl + "/promoter/getPromoterDataBySearchKeyword",
  EVENT_REPORT_BY_DATE_AND_SEARCH:
    BASE_URl + "/events/getEventsByNameandDateTime",

  // enable promoter
  ENABLE_PROMOTER: BASE_URl + "/promoter/enable",

  // DISABLE PROMOTER
  DISABLE_PROMOTRE: BASE_URl + "/promoter/disable",

  // RESET PASSWORD
  RESET_PASSWORD: BASE_URl + "/promoter/updatepassword",

  // pagination promoter

  GET_PROMOTER_PAGINATED: BASE_URl + "/promoter/getallpaginatedData",

  // search promoter paginated
  SEARCH_PAGINATION: BASE_URl + "/promoter/getPaginatedSearch",
};

export const eventTourEndPoint = {
  EVENT_TOUR_CREATION_URL: BASE_URl + "/eventtour/create",
  ALL_EVENT_TOUR_DATA_LIST: BASE_URl + "/eventtour/getall",
  EVENT_TOUR_GET_DATA_BY_ID: BASE_URl + "/eventtour/getbyId",
  EVENT_TOUR_UPLOAD_IMAGE: BASE_URl + "/eventtour/upload/image",
  EVENT_TOUR_IMAGE_REMOVE: BASE_URl + "/eventtour/deleteEventTour/image",
  EVENT_TOUR_DATA_UPDATED: BASE_URl + "/eventtour/update/data",
  EVENT_TOUR_SEARCH_BY_NAME:
    BASE_URl + "/eventtour/getEventTourDataBySearchKeyword",

  GET_ALL_PAGINATION: BASE_URl + "/eventtour/getallpaginatedData",
  SEARCH_EVENTTOUR_PAGINATION: BASE_URl + "/eventtour/getPaginatedSearch",

  // enable
  ENABLE_TOUR: BASE_URl + "/eventtour/enable",

  // DISABLE
  DISABLE_TOUR: BASE_URl + "/eventtour/disable",

  // GET ACTIVE EVENT TOURS
  GET_ACTIVE_EVENT_TOURS: BASE_URl + "/eventtour/getActiveEventTours",
};

export const eventTagEndPoint = {
  EVENT_TAG_CREATION_URL: BASE_URl + "/eventsTags/create",
  ALL_EVENT_TAG_DATA: BASE_URl + "/eventsTags/getAll",
  EDIT_EVENT_TAG_DATA: BASE_URl + "/eventsTags/update",
};

export const eventEndPoint = {
  CREATE_EVENT_BY_ADMIN: BASE_URl + "/events/superAdmin/create",
  GET_ALL_EVENTS_DATA_BY_ADMIN: BASE_URl + "/events/getAll",
  GET_EVENTDATA_BY_ID: BASE_URl + "/events/getbyId",
  UPDATE_EVENT_CAROUSEL_IMAGE: BASE_URl + "/events/upload/carouselimg",
  DELETE_EVENT_CAROUSEL_IMAGE: BASE_URl + "/events/delete/carouselimg",
  UPDATE_EVENT_GALLERY_IMAGE: BASE_URl + "/events/upload/galleryimg",
  DELETE_EVENT_GALLERY_IMAGE: BASE_URl + "/events/delete/galleryimg",
  UPDATE_EVENT_DATE_AND_TIME: BASE_URl + "/events/update/DateTime",
  CREATE_NEW_EVENT_DATE_AND_TIME: BASE_URl + "/events/add/DateTime",
  EVENT_DELETE_DATE_AND_TIME: BASE_URl + "/events/delete/DateTime",
  EDIT_EVENT_FAQ_: BASE_URl + "/events/update/Faq",
  DELETE_EVENT_FAQ: BASE_URl + "/events/delete/Faq",
  CREATE_NEW_FAQ_FOR_EDIT_EVENT: BASE_URl + "/events/add/Faq",
  UPDATE_EVENT_DATA: BASE_URl + "/events/superAdmin/update",
  ADD_PROMOTER_IN_EVENT: BASE_URl + "/events/addpromoter",

  // All Events Data Called By Perticular Event Status Api
  GET_ALL_PUBLISHED_EVENTS_DATA: BASE_URl + "/events/getPublishEvents",
  GET_ALL_DRAFT_EVENTS_DATA: BASE_URl + "/events/getDraftEvents",
  GET_ALL_TBREVIVE_EVENTS_DATA: BASE_URl + "/events/getReviewEvents",
  GET_ALL_SUPER_ADMIN_SELF_CREATED_EVENTS:
    BASE_URl + "/events/getSuperAdminSelfCreatedEvents",
  GET_ALL_REJECTED_EVENTS_DATA: BASE_URl + "/events/getRejectedEvents",

  // enable event
  ENABLE_EVENT: BASE_URl + "/events/enableEvent",

  // DISABLE EVENT
  DISABLE_EVENT: BASE_URl + "/events/disableEvent",

  // pagination
  GET_ALL_PAGINATION: BASE_URl + "/events/getAllPaginated",

  GET_PUBLISH_EVENTS_PAGINATED: BASE_URl + "/events/getPaginatedPublishEvents",

  GET_DRAFT_EVENTS_PAGINATION: BASE_URl + "/events/getPaginatedDraftEvents",

  GET_TBR_EVENTS_PAGINATION: BASE_URl + "/events/getPaginatedReviewEvents",

  GET_SELF_EVENTS_PAGINATION:
    BASE_URl + "/events/getPaginatedSuperAdminSelfCreatedEvents",

  GET_REJECTED_EVENTS_PAGINATION:
    BASE_URl + "/events/getPaginatedRejectedEvents",

  // completed events
  COMPLETED_EVENTS: BASE_URl + "/events/getCompletedEvents",

  // get event promoter
  GET_EVENT_PROMOTER: BASE_URl + "/events/getEventPromoters",
};

export const eventsticketsByEventId = {
  GET_ALL_EVENTS_TICKETS_BY_EVENT_ID:
    BASE_URl + "/eventstickets/getAllEventTickets",
  CREATE_EVENT_TICKETS: BASE_URl + "/eventstickets/create",
  CREATE_EVENT_BULK_COMPOUND:
    BASE_URl + "/eventbulktickets/createBulkTicketForEvent",
};

export const eventbulktickets = {
  GET_ALL_EVENT_BULK_TICKETS:
    BASE_URl + "/eventbulktickets/getBulkTicketsOfEvent",
  SEARCH_BULK_EVENT_TICKETS:
    BASE_URl + "/eventbulktickets/getBulkTicketsByNameSearch",
  CANCEL_BULK_EVENT_TICKETS: BASE_URl + "/eventbulktickets/cancelBukTicket",
  DOWNLOAD_BULK_EVENT_TICKETS:
    BASE_URl + "/eventbulktickets/exportBulkTicketBookingIds",
  FILTER_EVENT_BULK_TICKET_BY_NAME:
    BASE_URl + "/eventbulktickets/getBulkTicketsByNameFilter",
  FILTER_EVENT_BULK_TICKET_BY_DATE:
    BASE_URl + "/eventbulktickets/getBulkTicketsByDateFilter",
  FILTER_EVENT_BULK_TICKET_BY_DATE_AND_NAME:
    BASE_URl + "/eventbulktickets/getBulkTicketsByFilter",
};

export const normalEventTickets = {
  GET_NORMAL_EVENT_TICKET_BY_ID:
    BASE_URl + "/eventstickets/getEventTicketDetailsById",
  UPDATE_NORMAL_EVENT_TICKET_BY_ID:
    BASE_URl + "/eventstickets/updateEventTicketById",
  GET_SERACH_TICKET_BY_EVENT_ID:
    BASE_URl + "/eventstickets/getTicketsByTicketNameSearch",
  DISABLE_ENABLE_EVENT_TICKET_BY_TICKET_ID:
    BASE_URl + "/eventstickets/disableEventTicket",
  ENABLE_EVENT_TICKET_BY_TICKET_ID:
    BASE_URl + "/eventstickets/enableEventTicket",
  SOLD_OUT_EVENT_TICKET_TO_AVAILABLE_TICKET:
    BASE_URl + "/eventstickets/updateAvailabilityToAvailable",
  AVAILABLE_TICKET_TO_SOLD_OUT_EVENT_TICKET:
    BASE_URl + "/eventstickets/updateAvailabilityToSoldOut",
  // FILTER_NORMAL_EVENT_TICKET_BY_DATE:
  //   BASE_URl + "/eventstickets/getTicketsbyEventDate",
  // FILTER_NORMAL_EVENT_TICKET_BY_NAME:
  //   BASE_URl + "/eventstickets/getEventTicketsDatabyTicketName",
  FILTER_NORMAL_EVENT_TICKET_BY_DATE_AND_NAME:
    BASE_URl + "/eventstickets/getTicketsByFilter",
  UPDATE_NORMAL_EVENT_TICKET: BASE_URl + "/eventstickets/updateEventTicketById",
};

export const websiteCustomer = {
  CREATE_CUSTOMER_WEBSITE:
    BASE_URl + "/websitecustomers/customerRegistrationBySuperAdmin",
  GET_ALL_CUSTOMER_DATA: BASE_URl + "/websitecustomers/getall",

  // get all paginated
  GET_CUSTOMERS_PAGINATED:
    BASE_URl + "/websitecustomers/getAllPaginatedCustomersData",

  // search paginated
  SEARCH_PAGINATED:
    BASE_URl + "/websitecustomers/getCustomerDataBySearchKeywordPaginated",

  CUSTOMER_BOOKINGS: BASE_URl + "/websitecustomers/getCustomerBookings",
};

// aLL Promoter End Point
export const promoterEndPointPannel = {
  LOGIN_PROMOTER_URL: BASE_URl + "/promoter/login",
  GET_ALL_EVENTS_DATA_BY_PROMOTER:
    BASE_URl + "/events/getAllEventsForPromotersDashboard",
  GET_ALL_EVENT_DATE_BY_EVENT_ID: BASE_URl + "/events/getbyId",
  GET_PROMOTER_TICKET_DATA_BY_EVENT_DATE:
    BASE_URl + "/eventstickets/getPromoterTicketsbyEventDate",
  BOOKING_TICKET_BY_PROMOTER:
    BASE_URl + "/eventticketsbooking/BookEventTicketsByPromoter",
  PROMOTER_FORGOT_PASSWORD_SEND_EMAIL:
    BASE_URl + "/promoter/getpasswordresetlink",
  PROMOTER_FORGOT_PASSWORD_RESET_PASSWORD:
    BASE_URl + "/promoter/resetPassword/",
  PROMOTER_CHANGE_PASSWORD_IN_PROFILE: BASE_URl + "/promoter/changepassword",
  GET_PROMOTER_PROFILE_DATA_BY_ID: BASE_URl + "/promoter/getById",
  UPDATE_PROMOTER_DATA_PROFILE_DATA: BASE_URl + "/promoter/updateProfile",
  GET_ALL_PROMOTER_EVENT_BOOKING_DATA_BY_EVENT_ID:
    BASE_URl + "/eventticketsbooking/getEventSummaryBookingsDataByPromoterId",
  FILTER_EVENT_BOOKING_DATA_BY_NAME_AND_DATE_IN_PROMOTER:
    BASE_URl + "/eventticketsbooking/getEventSummaryBookingsDatabyFilter",
  GET_ALL_TRANSACTION_BOOKING_DATA_BY_EVENY_AND_PROMOTER_ID:
    BASE_URl +
    "/eventticketsbooking/getEventTransactionBookingsDataByPromoterId",
  DOWNLOAD_EXECEL_REPORT_OF_SUMMARY_BOOKING:
    BASE_URl + "/eventticketsbooking/getEventSummaryExcelReportbyFilter",
  DOWNLOAD_EXECEL_REPORT_OF_TRANSACTION_BOOKING:
    BASE_URl +
    "/eventticketsbooking/getEventTransactionExcelReportByPromoterId",
  GET_BOOKING_DATA: BASE_URl + "/eventticketsbooking/getPromoterLatestBookings",
  GET_SEASON_PASS: BASE_URl + "/eventstickets/getPromoterSeasonPass",
};

export const getallcityDataEndPoint = {
  GET_ALL_EVENT_CITY_DATA: BASE_URl + "/events/getAllEventCities",
};

// super admin booking api
export const booking = {
  GET_PROMOTER_BOOKINGS:
    BASE_URl +
    "/eventticketsbooking/getPromoterLatestBookingsForSuperAdminOrganizer",
  CANCEL_BOOKINGS: BASE_URl + "/eventticketsbooking/cancelEventTicket",
  RESEND_BOOKINGS: BASE_URl + "/eventticketsbooking/resendEventTicket",
  GET_ONLINE_BOOKINGS:
    BASE_URl +
    "/eventticketsbooking/getOnlineLatestBookingsForSuperAdminOrganizer",
  GET_ALL_BOOKINGS:
    BASE_URl +
    "/eventticketsbooking/getAllLatestBookingsForSuperAdminOrganizer",
  DOWNLOAD_ONLINE_EXCEL:
    BASE_URl +
    "/eventticketsbooking/downloadExcelOnlineLatestBookingsForSuperAdminOrganizer",
  DOWNLOAD_PROMOTER_EXCEL:
    BASE_URl +
    "/eventticketsbooking/downloadPromoterLatestBookingsForSuperAdminOrganizer",
  DOWNLOAD_ALL_EXCEL:
    BASE_URl +
    "/eventticketsbooking/downloadExcelAllLatestBookingsForSuperAdminOrganizer",
};

export const promocode = {
  CREATE_PROMOCODE: BASE_URl + "/promocode/create",
  GET_ALL: BASE_URl + "/promocode/getAll",
  GET_BY_ID: BASE_URl + "/promocode/getById",
  SEARCH_BY_KEYWORD: BASE_URl + "/promocode/searchKeyword",
  GET_ALL_PAGINATION: BASE_URl + "/promocode/getallpaginatedData",
  ENABLE_PROMOCODE: BASE_URl + "/promocode/enablePromocode",
  DISABLE_PROMOCODE: BASE_URl + "/promocode/disablePromocode",

  SEARCH_PAGINATION: BASE_URl + "/promocode/getPaginatedSearch",
};

export const banner = {
  CREATE_BANNER: BASE_URl + "/homepagebannerslider/create",
  GET_ALL: BASE_URl + "/homepagebannerslider/getAll",
  UPDATE_BY_ID: BASE_URl + "/homepagebannerslider/updatebyId",
  GET_BY_ID: BASE_URl + "/homepagebannerslider/getById",
};

export const scanUser = {
  REGISTER: BASE_URl + "/scanneruser/register",
  GET_ALL: BASE_URl + "/scanneruser/getAll",
  ENABLE_USER: BASE_URl + "/scanneruser/enable",
  DISABLE_USER: BASE_URl + "/scanneruser/disable",
  RESET_PASSWORD: BASE_URl + "/scanneruser/updatePassword",
  GET_BY_ID: BASE_URl + "/scanneruser/getById",

  UPDATE_USER: BASE_URl + "/scanneruser/updateScannerUserDetailsbyId",
};

export const smtpDetails = {
  GET_ALL: BASE_URl + "/smtp/get",
  REGISTER: BASE_URl + "/smtp/register",
  UPDATE_BY_ID: BASE_URl + "/smtp/updatebyId",
};
