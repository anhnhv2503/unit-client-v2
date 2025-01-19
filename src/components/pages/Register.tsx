import SmallLoading from "@/components/common/loading/SmallLoading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterBody, RegisterBodyType } from "@/schema/auth.schema";
import { register } from "@/services/authService";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  useDocumentTitle("Sign Up");
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRules = [
    { test: (pw: string) => pw.length >= 8, label: "At least 8 characters" },
    {
      test: (pw: string) => /[a-z]/.test(pw),
      label: "Contains lowercase letter",
    },
    {
      test: (pw: string) => /[A-Z]/.test(pw),
      label: "Contains uppercase letter",
    },
    { test: (pw: string) => /[0-9]/.test(pw), label: "Contains a number" },
    {
      test: (pw: string) => /[\s!@#$%^&*(),.?":{}|<>]/.test(pw),
      label: "Contains special character or space",
    },
    {
      test: (pw: string) => pw.trim() === pw,
      label: "No leading or trailing spaces",
    },
  ];

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      firstName: "",
      lastName: "",
    },
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  async function onSubmit(values: RegisterBodyType) {
    setLoading(true);
    try {
      await register(values);
      toast.success(
        "Account created successfully. Please check your email to confirm your account."
      );
      form.reset();
      setLoading(false);
      setTimeout(() => {
        nav("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      const errorMessage =
        (error as any)?.response?.data?.message || "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-full max-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gradient-to-r from-purple-500 to-pink-500 h-screen">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => nav("/login")}
          className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          SIGN UP
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="flex space-x-4">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-black">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          className="text-black"
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-black">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          {...field}
                          className="text-black"
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-600" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-black">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        className="text-black"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-black">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        className="text-black"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-black">Password</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlePasswordChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              {/* Password Rules */}
              <ul className="text-sm mt-0">
                {passwordRules.map((rule, index) => (
                  <li
                    key={index}
                    style={{
                      color: rule.test(password) ? "green" : "red",
                    }}
                    className="flex dark:text-black"
                  >
                    {rule.test(password) ? (
                      <CheckIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 mr-2" />
                    )}
                    {rule.label}
                  </li>
                ))}
              </ul>

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-black">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

              {/* Show Password */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPassword"
                  className="w-4 h-4 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-500 dark:text-white "
                  onCheckedChange={() => setShowPassword(!showPassword)}
                />
                <label
                  htmlFor="showPassword"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-black"
                >
                  Show Password
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm font-medium leading-none text-red-500 dark:text-red-500">
                  <p>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              {loading ? (
                <SmallLoading />
              ) : (
                <Button className="w-full py-3 dark:bg-black dark:text-white dark:hover:bg-zinc-500">
                  Sign Up
                </Button>
              )}
            </form>
          </Form>

          {/* Already Have Account */}
          <p className="text-center text-sm dark:text-black">
            Already have an account?{" "}
            <a
              className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 inline-block text-transparent bg-clip-text"
              onClick={() => {
                nav("/login");
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
