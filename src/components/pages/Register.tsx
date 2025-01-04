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
    },
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  async function onSubmit(values: RegisterBodyType) {
    setLoading(true);
    try {
      await register(values.email, values.password, values.confirmPassword);

      nav(`/confirm?email=${values.email}`);
      setLoading(false);
    } catch (error) {
      console.log(error);
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.Message || "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
    }
  }
  return (
    <div
      className={`flex min-h-full max-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gradient-to-r from-purple-500 to-pink-500 h-screen`}
    >
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => nav("/login")}
          className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Button>
      </div>
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          SIGN UP
        </h2>
        <div className="space-y-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          field.onChange(e); // react-hook-form handler
                          handlePasswordChange(e.target.value); // update UI feedback
                        }}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-600" />
                  </FormItem>
                )}
              />

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
              {error && (
                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-red-500 dark:text-red-500">
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <SmallLoading />
              ) : (
                <Button className="w-full p-6 dark:bg-black dark:text-white dark:hover:bg-zinc-500">
                  Sign Up
                </Button>
              )}
            </form>
          </Form>

          <p className="text-center dark:text-black">
            Already have account ? {""}
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
