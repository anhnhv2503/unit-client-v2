import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { confirmRegister, resendConfirmRegister } from "@/services/authService";
import { HomeIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your code must be 6 characters.",
  }),
});

const ConfirmEmail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email");
  const nav = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await confirmRegister(emailParam!, data.code);
      console.log(response);
      toast.success("Your account has been confirmed. Please login.", {
        duration: 1000,
      });
      setTimeout(() => {
        nav("/login");
      }, 1000);
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.Message || "An unknown error occurred";
      toast.error(errorMessage, { duration: 1000 });
    }
  }

  const resendCode = async () => {
    try {
      const response = await resendConfirmRegister(emailParam!);
      toast.success("Code has been sent to your email.");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className={`flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gradient-to-r from-teal-600 to-cyan-600 h-screen`}
    >
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => nav("/")} // Navigate back
          className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          <HomeIcon className="w-6 h-6" />
        </Button>
      </div>
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Confirm Email
        </h2>
        <div className="space-y-3">
          <p className="text-center text-lg text-gray-700">
            Please check your email <strong>{emailParam}</strong> to confirm
            your account.
          </p>
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 text-center"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="text-center text-black">
                      <FormLabel>Your Code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-center space-x-5">
                  <Button type="button" onClick={resendCode}>
                    Resend code
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
