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

export const register = async (
  email: string,
  password: string,
  confirmPasword: string
) => {
  return axiosInstance.post("auth/SignUp", {
    email: email,
    password: password,
    confirmPassword: confirmPasword,
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

export const getUserProfile = async (user_id: string, isLogin: boolean) => {
  if (isLogin) {
    return axiosInstance.get(`user/p`);
  }
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

export const getUserAvatar = async () => {
  return axiosInstance.get("user/info");
};

export const followUser = async (form: FormData) => {
  return axiosInstance.post("user", form);
};
