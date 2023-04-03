import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/components/shared/schemas/LoginSchema";
import { useLoginUserMutation } from "../services/appApi";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AppContext } from "@/context/appContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const { socket } = useContext(AppContext);

  const onSubmit = (data) => {
    const { email, password } = data;
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        // socket work
        socket.emit("new-user");
        //navigate to the chat
        router.push("chat");
      }
    });
    reset();
  };

  useEffect(() => {
    if (user) {
      router.push("chat");
    }
  }, [user]);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      {!user && (
        <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-primary underline">
            Sign in
          </h1>
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-primary bg-white border rounded-md focus:border-primaryLight focus:ring-primaryLight focus:outline-none focus:ring focus:ring-opacity-40"
                {...register("email")}
              />
              <p className="text-red-600 font-normal text-[11px] leading-5 text-danger ml-2 mt-1">
                {errors.email?.message}
              </p>
            </div>
            <div className="mb-2">
              <label
                htmlFor="pass"
                className="block text-sm font-semibold text-gray-300"
              >
                Password
              </label>
              <input
                id="pass"
                type="password"
                className="block w-full px-4 py-2 mt-2 text-primary bg-white border rounded-md focus:border-primaryLight focus:ring-primaryLight focus:outline-none focus:ring focus:ring-opacity-40"
                {...register("password")}
              />
              <p className="text-red-600 font-normal text-[11px] leading-5 text-danger ml-2 mt-1">
                {errors.password?.message}
              </p>
            </div>
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-primary rounded-md hover:bg-[#37827e] focus:outline-none focus:bg-[#37827e]">
                Login
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" legacyBehavior>
              <a className="font-medium text-[#37827e] hover:underline">
                Sign up
              </a>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
