import z from "zod";

//Use for Register form
export const RegisterBody = z
  .object({
    firstName: z.string().max(255),
    lastName: z.string().max(255),
    email: z.string().email(),
    username: z.string().max(255),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(255)
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\s!@#$%^&*(),.?":{}|<>]/, {
        message:
          "Password must contain at least one special character or a space",
      })
      .refine((password) => password.trim() === password, {
        message: "Password must not contain leading or trailing spaces",
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(255),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    } else if (password.trim() === "" || confirmPassword.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Password cannot be empty",
        path: ["confirmPassword", "password"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterResponse = z.object({
  data: z.object({
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
  }),
  message: z.string(),
});

export type RegisterResponseType = z.TypeOf<typeof RegisterResponse>;
//

//Use for Login form
export const LoginBody = z
  .object({
    username: z.string(),
    password: z.string().min(6).max(255),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginResponse = RegisterResponse;

export type LoginResponseType = z.TypeOf<typeof LoginResponse>;
//

//Use for Forget Password form
export const ForgotPasswordBody = z
  .object({
    username: z.string(),
  })
  .strict();

export type ForgotPasswordBodyType = z.TypeOf<typeof ForgotPasswordBody>;

//Use for Reset Password form
export const ResetPasswordBody = z
  .object({
    password: z.string().min(8).max(255),
    confirmPassword: z.string().min(8).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This specifies where the error should appear
  });

export type ResetPasswordBodyType = z.TypeOf<typeof ResetPasswordBody>;

//Use for User Profile form
export const UserProfileBody = z
  .object({
    username: z
      .string()
      .max(255)
      .regex(/^\S*$/, "Username must not contain spaces"), // No spaces allowed
    email: z.string().email(),
    firstName: z.string().max(255),
    lastName: z.string().max(255),
    dateOfBirth: z.string().max(255),
    avatar: z.string().max(255),
  })
  .strict();

export type UserProfileBodyType = z.TypeOf<typeof UserProfileBody>;

//
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;

export const SlideSessionResponse = RegisterResponse;

export type SlideSessionResponseType = z.TypeOf<typeof SlideSessionResponse>;
//
