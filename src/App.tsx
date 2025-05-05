import NotFound from "@/components/error/NotFound";
import ConfirmEmail from "@/components/pages/ConfirmEmail";
import Home from "@/components/pages/Home";
import Login from "@/components/pages/Login";
import Notification from "@/components/pages/Notification";
import Register from "@/components/pages/Register";
import Search from "@/components/pages/Search";
import UserRoute from "@/routes/UserRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ForgotPassword } from "./components/pages/ForgotPassword";
import { PostDetail } from "./components/pages/PostDetail";
import { ResetPassword } from "./components/pages/ResetPassword";
import { UserProfile } from "./components/pages/UserProfile";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Chat from "@/components/pages/Chat";
import ChatWindow from "@/components/common/ChatWindow";
import Test from "@/test/Test";
import { useEffect, useState } from "react";
import AppLoading from "@/components/common/loading/AppLoading";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <AppLoading />;
  }

  const router = createBrowserRouter([
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/confirm",
      element: <ConfirmEmail />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      element: <UserRoute />,
      children: [
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/notify",
              element: <Notification />,
            },
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/post",
              element: <PostDetail />,
            },

            {
              path: "/search",
              element: <Search />,
            },
            {
              path: "/chat",
              element: <Chat />,
            },
            {
              path: "/chat/c/d/:userId",
              element: <ChatWindow />,
            },
            {
              path: "/user-profile/:id",
              element: <UserProfile />,
            },
          ],
        },
      ],
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
