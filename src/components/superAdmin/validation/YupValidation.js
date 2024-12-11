import * as yup from "yup";
import AddAddress from "../../common/AddAddress";

// Define a reusable schema for validating the emailId field
const emailSchema = yup
  .string()
  .nullable()
  .min(6, "Must be at least 6 characters");
// .required("Email Id is required");

const requiredEmailSchema = yup
  .string()
  .nullable()
  .min(0, "Must be at least 6 characters")
  .required("Email Id is required");

const userNameSchema = yup
  .string()
  .min(5, "Must be at least 5 characters")
  .required("User Name is  required");

// Password filed validation Schema
const passwordSchema = yup
  .string()
  .min(6, "Must be at least 6 characters")
  .required("Password is required");

// First And Last Validation Schema
const firstLastName = yup.string().min(3).max(50).required("Enter First Name ");

// Phone Number Validation Schema
const phoneNumberSchema = yup
  .number()
  .typeError("Please enter a valid number")
  .integer("Please enter a valid number")
  .nullable()
  .min(1111111111)
  .max(9999999999);
// .required("Please enter the Phone Number");

const requiredPhoneNumberSchema = yup
  .number()
  .typeError("Please enter a valid number")
  .integer("Please enter a valid number")
  .nullable()
  .min(1111111111, "Please enter a valid number")
  .max(9999999999, "Please enter a valid number")
  .required("Please enter the Phone Number");

// Gender Selection validation schema
const genderSchema = yup.string().min(3).max(10).required("Select a gender");

// Address Validation Schema
const addressSchema = yup
  .string()
  .min(3)
  .max(1024)
  .required("Please enter a valid address");

// About and Address validation schema
const aboutSchema = yup.string().nullable().min(10);
// .required("Please Enter Description");

// Artist Name validation schema
const artistName = yup.string().min(3).max(50).required("Enter artist Name ");

// Category Name validation schema
const categoryName = yup.string().min(3).max(50).required("Enter artist Name ");

// Genre Name validation schema
const genreName = yup.string().min(3).max(50).required("Enter Genre Name ");

// Super Admin Login Object
export const loginObjectSchema = yup.object().shape({
  userName: userNameSchema,
  password: passwordSchema,
});

// Forgot password validation
export const forgotPasswordEmailObjectSchema = yup.object().shape({
  emailId: emailSchema,
});

export const resetPasswordObjectSchema = yup.object().shape({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

// Admin Profile setting validation.
export const adminProfileObjectSchema = yup.object().shape({
  firstName: firstLastName,
  lastName: firstLastName,
  phoneNumber1: phoneNumberSchema,
  phoneNumber2: phoneNumberSchema,
  emailId: emailSchema,
  gender: genderSchema,
  about: aboutSchema,
  address: addressSchema,
});

// Event Data Validation
export const superAdminEventCreationObjectSchema = yup.object().shape({
  eventVisibility: yup.number().required("Event visibility is required"),
  eventType: yup.number().required("Event visibility is required"),
  feevalue: yup
    .number()
    .typeError("Please enter a valid number")
    .required("Please enter the Convenience fee")
    .positive("Please enter a positive number")
    .test("is-decimal", "Please enter a valid decimal number", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d*\.?\d*$/.test(value.toString());
    }),
  eventname: yup.string().min(2).required("Please enter Event Name"),
  eventDescription: yup
    .string()
    .min(8)
    .required("Please enter Event Description"),
  eventTermsandConditions: yup
    .string()
    .min(8)
    .required("Please enter Event Description"),
});

// Artist Data Validation
export const artistCreationObjectSchema = yup.object().shape({
  artistName: artistName,
  artistemailId: emailSchema,
  artistPhoneNumber: phoneNumberSchema,
  artistDescription: aboutSchema,
});

// Categories Data Validation
export const categoriesObjectSchema = yup.object().shape({
  categorieName: categoryName,
  categorieDescription: aboutSchema,
});

// Genre Data Validation
export const genreObjectSchema = yup.object().shape({
  genreName: genreName,
  genreDescription: aboutSchema,
});

// Venue Data Validation
export const venueObjectSchema = yup.object().shape({
  venueName: yup.string().min(3).max(50).required("Enter Venue Name "),
  venueAddress: addressSchema,
  venueDescription: yup.string().max(1024).required("Enter Venue Description "),
  venueMapLocation: yup
    .string()
    .min(10)
    .required("Please insert Venue location corrdinates"),
});

// FAQ Data validation
export const faqObjectSchema = yup.object().shape({
  // faqTag: yup.string().min(3).max(50).required("Enter Tag name "),
  faqQuestion: yup.string().min(3).max(1024).required("Enter FAQ question"),
  faqAnswer: yup.string().min(2).max(1024).required("Enter FAQ answer"),
});

// Organizer Data Validation

export const organizerObjectSchema = yup.object().shape({
  organizerFullName: yup
    .string()
    .min(3)
    .max(50)
    .required("Enter Organizer Name "),
  organizerusername: yup
    .string()
    .min(3)
    .max(50)
    .required("Enter Organizer UserName "),
  // organizerDescription: aboutSchema,
  // organizerEmail: requiredEmailSchema,
  organizerEmail: yup.string().nullable(),
  // organizerPhoneNo: requiredPhoneNumberSchema,
  organizerPhoneNo: yup
    .number()
    .typeError("Please enter a valid number")
    .integer("Please enter a valid number")
    .nullable()
    .min(1111111111, "Please enter a valid number")
    .max(9999999999, "Please enter a valid number"),
  organizerPassword: passwordSchema,
});

// Promoter Data Validation
export const promoterObjectSchema = yup.object().shape({
  promoterFullName: yup
    .string()
    .min(3)
    .max(50)
    .required("Enter Promoter Name "),
  promoterusername: yup
    .string()
    .min(3)
    .max(50)
    .required("Enter Promoter UserName "),
  // promoterDescription: aboutSchema,
  // promoterEmail: requiredEmailSchema,
  promoterEmail: yup.string().nullable(),
  // promoterPhoneNo: requiredPhoneNumberSchema,
  promoterPhoneNo: yup
    .number()
    .typeError("Please enter a valid number")
    .integer("Please enter a valid number")
    .nullable()
    .min(1111111111, "Please enter a valid number")
    .max(9999999999, "Please enter a valid number"),
  promoterPassword: passwordSchema,
});

// Event Tour Data validation
export const eventTourObjectSchema = yup.object().shape({
  eventTourName: yup.string().min(3).max(50).required("Enter Event Tour Name "),
  eventTourDescription: yup.string().nullable(),
});

export const eventTagObjectSchema = yup.object().shape({
  eventtag: yup.string().min(3).max(50).required("Enter Event Tag Name "),
});

export const eventTicketsObjectSchema = yup.object().shape({
  // ticketType: yup.string().required("Event Type is required"),
  // ticketVisiblity: yup.string().required("Visibility is required"),
  ticketName: yup.string().required("Ticket Name is required"),
  ticketDescription: yup.string().nullable(),
  // .required("Ticket Description is required"),
  ticketPrice: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be a positive number and  zero"),
  // .positive("Price must be a positive number"),
  ticketQuantity: yup
    .number()
    .typeError("Total Quantity must be a number")
    .required("Total Quantity is required")
    .positive("Total Quantity must be a positive number")
    .integer("Total Quantity must be an integer"),
  ticketMaxLimit: yup
    .number()
    .typeError("Booking Max Limit must be a number")
    .required("Booking Max Limit is required")
    .positive("Booking Max Limit must be a positive number")
    .integer("Booking Max Limit must be an integer"),
});

export const eventBulkTicketsObjectSchema = yup.object().shape({
  ticketName: yup.string().min(2).required("Ticket Name is required"),
  customerName: yup.string().min(3).required("Customer Name is required"),
  ticketPrice: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be a positive number and  zero"),
  // .positive("Price must be a positive number"),
  ticketQuantity: yup
    .number()
    .typeError("Total Quantity must be a number")
    .required("Total Quantity is required")
    .positive("Total Quantity must be a positive number")
    .integer("Total Quantity must be an integer"),
  ticketEmailId: requiredEmailSchema,
  ticketPhoneNumber: requiredPhoneNumberSchema,
});

export const customerObjectSchema = yup.object().shape({
  customerFullName: yup
    .string()
    .min(3, "Customer name must be at least 3 characters long.")
    .max(50, "Customer name must be at most 50 characters long.")
    .required("Please enter the customer's full name."),
  // customerDescription: yup
  //   .string()
  //   .min(10, "Customer description must be at least 10 characters long.")
  //   .max(1024, "Customer description must be at most 1024 characters long.")
  //   .required("Please enter a description for the customer."),
  customerEmail: emailSchema,
  customerPhoneNo: phoneNumberSchema,
  // customerPassword: yup
  //   .string()
  //   .min(6, "Password must be at least 6 characters long.")
  //   .max(24, "Password must be at most 24 characters long.")
  //   .required("Please enter the password."),
});

export const promocodeObjectSchema = yup.object().shape({
  codeName: yup.string().min(6).max(12).required("Code name is required"),
  termsConditions: yup
    .string()
    .min(5)
    .required("Terms & conditions are required"),
});
