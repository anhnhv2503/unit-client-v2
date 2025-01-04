import { useTheme } from "@/components/context/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { logout } from "@/services/authService";
import {
  Bars3BottomLeftIcon,
  Cog6ToothIcon,
  MoonIcon,
  PowerIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ModePopover = () => {
  const { theme, setTheme } = useTheme();
  const nav = useNavigate();

  const accessToken = JSON.parse(localStorage.getItem("accessToken")!);

  useEffect(() => {
    // Set a flag in sessionStorage indicating the session is active
    sessionStorage.setItem("isActiveSession", "true");

    const handleUnload = () => {
      if (!sessionStorage.getItem("isActiveSession")) {
        // Only remove items from localStorage if session flag is missing (e.g., tab close)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user_id");
        localStorage.removeItem("isPrivate");
      }
    };

    const handleVisibilityChange = () => {
      // If the document becomes hidden (e.g., user navigates away), remove session flag
      if (document.visibilityState === "hidden") {
        sessionStorage.removeItem("isActiveSession");
      } else {
        // If they return, reset the session flag
        sessionStorage.setItem("isActiveSession", "true");
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful", { duration: 1000 });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_id");
      nav("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center">
        <Bars3BottomLeftIcon className="w-7 h-7" />
      </PopoverTrigger>
      <PopoverContent className="w-52 dark:bg-zinc-800 dark:text-white border border-none bg-white text-black ">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Cog6ToothIcon className="w-5 h-5" />
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-1 items-center gap-4 mb-10">
              <div className="flex items-center space-x-6">
                <Switch
                  id="theme-mode"
                  className="data-[state=checked]:bg-white data-[state=unchecked]:bg-zinc-800"
                  checked={theme === "dark"}
                  onCheckedChange={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  }
                />
                <Label htmlFor="theme-mode" className="">
                  {theme === "dark" ? (
                    <MoonIcon className="w-5 h-5" />
                  ) : (
                    <SunIcon className="w-5 h-5" />
                  )}
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              {accessToken ? (
                <>
                  <Button
                    variant={"destructive"}
                    className="dark:bg-red-500"
                    onClick={handleLogout}
                  >
                    <PowerIcon className="w-5 h-5" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => nav("/login")}>
                    Login <span aria-hidden="true">&rarr;</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModePopover;
