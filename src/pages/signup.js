import { ButtonSpinner } from "@/components/shared/spinner/ButtonSpinner";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/components/shared/schemas/RegisterSchema";
import { useSignupUserMutation } from "../services/appApi";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" },
  });
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [signupUser, { isLoading, error }] = useSignupUserMutation();

  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "f53ivazm");
    try {
      setUploadingImg(true);
      const res = await fetch(
        "  https://api.cloudinary.com/v1_1/ddn2hr9cn/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
    }
  };

  const onSubmit = async (data) => {
    const { email, password, name } = data;
    if (!image) {
      toast.error("Please upload your profile picture", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    const url = await uploadImage(image);
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        router.push("chat");
      }
    });
    reset();
  };

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      toast.error("File is too large", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
            Create Account
          </h1>
          <div className="flex justify-center">
            <div className="w-fit flex justify-center mt-8 relative">
              {imagePreview ? (
                <Image
                  width={100}
                  height={100}
                  objectFit="cover"
                  src={imagePreview}
                  alt="logo"
                  className="rounded-full"
                />
              ) : (
                <div className="w-[100px] h-[100px]">
                  <Image
                    layout="fill"
                    src={"/images/profile.jpg"}
                    alt="logo"
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="absolute bottom-0 right-0">
                <label htmlFor="image-upload">
                  <Image
                    className="cursor-pointer"
                    width={24}
                    height={24}
                    src={"/icons/add.svg"}
                    alt="logo"
                  />
                </label>
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={validateImg}
                />
              </div>
            </div>
          </div>
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-primary bg-white border rounded-md focus:border-primaryLight focus:ring-primaryLight focus:outline-none focus:ring focus:ring-opacity-40"
                {...register("name")}
              />
              <p className="text-red-600 font-normal text-[11px] leading-5 text-danger ml-2 mt-1">
                {errors.name?.message}
              </p>
            </div>
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
                {uploadingImg ? <ButtonSpinner /> : "Sign up"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center text-gray-500">
            {" "}
            Already have an account?{" "}
            <Link href="/login" legacyBehavior>
              <a className="font-medium text-[#37827e] hover:underline">
                Login
              </a>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Signup;
