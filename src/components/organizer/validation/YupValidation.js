import * as yup from "yup";

const passwordSchema = yup
  .string()
  .min(6, "Must be at least 6 characters")
  .required("Password is required");

export const organizerProfileUpdateValidations = yup.object().shape({
  organizerFullName: yup.string().min(3).max(50),
  // .required("Enter Organizer Name ")
  organizerPhoneNo: yup
    .number()
    .typeError("Please enter a valid number")
    .integer("Please enter a valid number")
    .min(1111111111)
    .max(9999999999),
  // .required("Please enter the Phone Number"),
});

export const resetPasswordProfileSection = yup.object().shape({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
