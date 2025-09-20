"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

interface ModeratorFormInput {
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function ModeratorRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ModeratorFormInput>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isMatching = password === confirmPassword;
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async (data: ModeratorFormInput) => {
    if (!token) {
      toast.error("Invite token is missing");
      return;
    }
    console.log(token);
    if (!isMatching) {
      toast.error("Passwords do not match");
      return;
    }

    const toastId = toast.loading("Registering moderator...");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://herald-hub-backend.onrender.com/auth/register/moderator",
        {
          username: data.username,
          password: data.password,
          inviteToken: token,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Moderator registered successfully!", { id: toastId });
        reset();
        router.push("/login");
      } else {
        toast.error("Registration failed. Try again.", { id: toastId });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errMsg =
        axiosError?.response?.data?.error || "Something went wrong";
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow bg-[#F4F4F4] px-4 md:px-20 py-10 md:py-40">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-around">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-1/3 max-w-md bg-[#F4F4F4] rounded-md font-poppins mt-10 md:mt-20"
        >
          <h1 className="text-3xl md:text-[38px] tracking-[0.7px] font-medium mb-6 text-center md:text-left">
            Account Registration
          </h1>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[16px]">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Please enter your username",
              })}
              className="w-full md:w-[90%] mt-1 px-4 py-3 rounded-[12px] border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
            {errors.username && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative w-full md:w-[90%]">
            <label className="block text-sm font-medium mb-1 text-[16px]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Choose a password"
              {...register("password", { required: true })}
              className="w-full mt-1 px-4 py-3 rounded-[12px] border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <div
              className="absolute right-3 top-[48px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                Password is required
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative w-full md:w-[90%]">
            <label className="block text-sm font-medium mb-1 text-[16px]">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword", { required: true })}
              className="w-full mt-1 px-4 py-3 rounded-[12px] border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <div
              className="absolute right-3 top-[48px] cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1 block">
                Confirm Password is required
              </span>
            )}
          </div>

          {/* Password Match */}
          {!isMatching && (
            <span className="text-red-600 text-xs block mb-4">
              Passwords do not match
            </span>
          )}

          {/* Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              {...register("terms", {
                required: "You must accept the terms and policy",
              })}
              className="w-4 h-4 cursor-pointer accent-green-500"
            />
            <label htmlFor="terms" className="text-sm ml-2.5">
              I accept terms and policy
            </label>
          </div>
          {errors.terms && (
            <span className="text-red-500 text-xs mb-2 block">
              {errors.terms.message}
            </span>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full md:w-[90%] bg-[#74BF44] text-white py-3 rounded-[12px] text-sm font-semibold cursor-pointer hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Right Side Image */}
        <div className="hidden md:block">
          <Image
            src="/imgs/sign-up.svg"
            alt="Moderator Illustration"
            width={700}
            height={600}
            className="w-full h-auto max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
}
