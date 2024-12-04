import * as yup from "yup";

const phoneNumberSchema = yup
  .number()
  .typeError("Please enter a valid number")
  .integer("Please enter a valid number")
  .min(1111111111, "please enter 10 digit valid number")
  .max(9999999999, "please enter 10 digit valid number")
  .required("Please enter the Phone Number");

const emailSchema = yup
  .string()
  .min(6, "Must be at least 6 characters")
  .required("Email Id is required");

const addressSchema = yup
  .string()
  .min(3)
  .max(1024)
  .required("Please enter a valid Note");

const passwordSchema = yup
  .string()
  .min(6, "Must be at least 6 characters")
  .required("Password is required");

export const promotorTicketBookingValidation = yup.object().shape({
  FullName: yup.string().min(3).max(50).required("Enter Full Name "),
  Email: emailSchema,
  PhoneNo: phoneNumberSchema,
  // Age: yup
  //   .number()
  //   .typeError("Please enter a valid number")
  //   .integer("Please enter a valid number")
  //   .min(5)
  //   .max(99)
  //   .required("Please enter the Age"),
});

export const resetPasswordObjectSchema = yup.object().shape({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const resetPasswordProfileSection = yup.object().shape({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const promoterProfileUpdateValidations = yup.object().shape({
  promoterFullName: yup
    .string()
    .min(3)
    .max(50)
    .required("Enter Promoter Name "),
  promoterPhoneNo: yup
    .number()
    .typeError("Please enter a valid number")
    .integer("Please enter a valid number")
    .min(1111111111)
    .max(9999999999)
    .nullable(),
  // .required("Please enter the Phone Number"),
});
