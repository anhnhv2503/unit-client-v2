import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeToken(token: string) {
  try {
    const decoded = jwtDecode(token);
    localStorage.setItem(
      "user_id",
      JSON.stringify((decoded as { username: string }).username)
    );

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
