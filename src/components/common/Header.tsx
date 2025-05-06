import bowLogo from "@/assets/header-logo/bow2.png";
import wobLogo from "@/assets/header-logo/wob2.png";
import ModePopover from "@/components/common/ModePopover";
import { useTheme } from "@/components/context/theme-provider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronRightIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const nav = useNavigate();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("Success!");
        }, 2000);
      }),
      {
        loading: "Refreshing...",
        success: "Welcome back!",
        error: "Could not refresh",
      }
    );
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
        scrolled
          ? "dark:bg-neutral-950 bg-white/0 backdrop-blur-md"
          : "dark:bg-neutral-950 bg-white/0 backdrop-blur-none"
      }`}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a
            onClick={handleClick}
            className="group flex items-center -m-1.5 p-1.5 relative"
          >
            <span className="sr-only">Your Company</span>
            <div className="relative transition-all duration-300 hover:scale-105">
              {theme === "dark" ? (
                <img
                  alt="Dark Theme Logo"
                  src={wobLogo}
                  className="h-8 w-auto cursor-pointer transition-all duration-300"
                />
              ) : (
                <img
                  alt="Light Theme Logo"
                  src={bowLogo}
                  className="h-8 w-auto cursor-pointer transition-all duration-300"
                />
              )}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </div>
          </a>
        </div>

        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handleScrollTop();
                    nav("/");
                  }}
                >
                  <span className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    <span>Home</span>
                  </span>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center gap-4"></div>
        </div>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full max-w-xs overflow-y-auto bg-white dark:bg-neutral-900 px-6 py-6 shadow-xl transition-transform duration-300">
          <div className="flex items-center justify-between">
            <a
              onClick={handleClick}
              className="group flex items-center relative"
            >
              {theme === "dark" ? (
                <img
                  alt="Dark Theme Logo"
                  src={wobLogo}
                  className="h-8 w-auto cursor-pointer"
                />
              ) : (
                <img
                  alt="Light Theme Logo"
                  src={bowLogo}
                  className="h-8 w-auto cursor-pointer"
                />
              )}
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full h-8 w-8"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-8 flow-root">
            <div className="-my-6 divide-y divide-neutral-200 dark:divide-neutral-800">
              <div className="space-y-4 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton
                    onClick={() => {
                      nav("/");
                      setMobileMenuOpen(false);
                    }}
                    className="group flex w-full items-center justify-between rounded-lg py-3 pl-3 pr-3.5 text-base font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500">
                        <HomeIcon className="h-4 w-4 text-white" />
                      </div>
                      <span>Home</span>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-neutral-500" />
                  </DisclosureButton>
                </Disclosure>
              </div>
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Appearance
                  </p>
                  <ModePopover />
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Scroll progress indicator */}
      <div
        className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        style={{
          width: `${
            scrolled
              ? Math.min(
                  (window.scrollY /
                    (document.body.scrollHeight - window.innerHeight)) *
                    100,
                  100
                )
              : 0
          }%`,
          transition: "width 0.1s ease-out",
        }}
      />
    </header>
  );
};

export default Header;
