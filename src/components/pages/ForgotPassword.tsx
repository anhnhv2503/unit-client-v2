import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ForgotPasswordBody,
  ForgotPasswordBodyType,
} from "@/schema/auth.schema";
import { sendResetPasswordEmail } from "@/services/authService";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  useDocumentTitle("Sign In");
  const nav = useNavigate();

  const {
    register: forgotPassword,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
  });

  const onSubmit: SubmitHandler<ForgotPasswordBodyType> = async (data) => {
    try {
      console.log(data);
      const response = await sendResetPasswordEmail(data.email);
      console.log(response);

      toast.success("Password reset code sent successful");
      setTimeout(() => {
        nav(`/reset-password?email=${data.email}`);
      }, 1000);
      reset();
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.Message || "An unknown error occurred";
      toast.error(errorMessage);

      console.log(error);
    }
  };

  return (
    <div
      className={`flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-500 h-screen`}
    >
      <Toaster />
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => nav(-1)} // Navigate back
          className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Button>
      </div>
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg ">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          FORGOT PASSWORD
        </h2>
        <div className="space-y-3">
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                {...forgotPassword("email")}
                id="email"
                className="w-full mt-1 p-6 input input-bordered bg-white text-black border-gray-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className=" mt-0 text-red-500 ">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div>
              {isSubmitting ? (
                <>
                  <div className="flex justify-center my-5">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <Button className=" w-full p-6 dark:bg-black dark:text-white dark:hover:bg-zinc-500">
                    Send
                  </Button>
                </>
              )}
              {errors.root && (
                <div className=" mt-0 text-red-500 ">{errors.root.message}</div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
