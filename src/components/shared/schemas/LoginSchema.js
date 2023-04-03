import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});
