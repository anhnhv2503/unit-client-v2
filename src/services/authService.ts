import { RegisterBodyType } from "@/schema/auth.schema";
import axiosInstance from "./axiosClient";

export const login = async (email: string, password: string) => {
  return axiosInstance.post("auth/login", {
    username: email,
    password: password,
  });
};

export const sendResetPasswordEmail = async (email: string) => {
  return axiosInstance.get(`auth/send-reset-password-Code?email=${email}`);
};

export const resetPassword = async (
  email: string,
  code: string,
  password: string,
  ConfirmPassword: string
) => {
  return axiosInstance.post("auth/reset-password", {
    ConfirmPassword: ConfirmPassword,
    code: code,
    email: email,
    password: password,
  });
};

export const logout = async () => {
  return axiosInstance.post("auth/logout", {
    token: JSON.parse(localStorage.getItem("accessToken")!),
  });
};

export const register = async (values: RegisterBodyType) => {
  return axiosInstance.post("user/register", {
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
    username: values.username,
    firstName: values.firstName,
    lastName: values.lastName,
  });
};

export const confirmRegister = async (email: string, code: string) => {
  return axiosInstance.post("auth/Confirm-Signup", {
    email: email,
    confirmCode: code,
  });
};

export const resendConfirmRegister = async (email: string) => {
  return axiosInstance.get(`auth/Resend-Confirmation-Code?email=${email}`);
};

export const getOtherUserProfile = async (user_id: string) => {
  return axiosInstance.get(`user/p/${user_id}`);
};

export const updateProfile = async (form: FormData) => {
  return axiosInstance.post("user", form);
};

export const searchUser = async (searchKey: string) => {
  return axiosInstance.get(
    `user?username=${searchKey}&fields=UserName,ProfilesPicture,Bio,UserId`
  );
};

export const getAuthUserProfile = async () => {
  return axiosInstance.get("user/info");
};

export const followUser = async (form: FormData) => {
  return axiosInstance.post("user", form);
};
