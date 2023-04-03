import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .test("len", "Not valid name", (val) => val.length >= 3),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});
