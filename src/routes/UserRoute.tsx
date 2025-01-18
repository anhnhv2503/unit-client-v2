import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const user = JSON.parse(localStorage.getItem("accessToken")!);
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="flex">
        <Header />
        <div className="flex-col h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 dark:bg-black overflow-y-auto h-fit">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserRoute;
