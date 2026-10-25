import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout/PublicLayout";
import Landing from "@/pages/Landing";
import Blank from "@/pages/Blank";
import Temp from "@/pages/Temp";
import Login from "@/pages/Login";
import ComponentTest from "@/pages/ComponentTest";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Management from "@/pages/dashboard/management/Management";
import ParkingForm from "@/pages/dashboard/management/ParkingForm";
import ParkingView from "@/pages/dashboard/management/ParkingView";
import ParkingSlots from "@/pages/dashboard/management/ParkingSlots";
import ParkingHistory from "@/pages/dashboard/management/ParkingHistory";
import AboutUs from "@/pages/AboutUs";
import ExploreParking from "@/pages/exploreParking";
import Vehi from "@/pages/vehi";
import ContactUs from "@/pages/contactUs";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Wallet from "@/pages/Wallet";
import ParkingReg from "@/pages/admin/ParkingReg";

import UserProfile from "@/pages/dashboard/UserProfile";
import ParkingProfile from "@/pages/ParkingProfile";
import Dashboard from "@/pages/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    // errorElement: (
    // 	<Error404 />
    // ),
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/blank",
        element: <Blank />,
      },
      {
        path: "/temp",
        element: <Temp />,
      },
      {
        path: "/test",
        element: <ComponentTest />,
      },
      { path: "/aboutus", element: <AboutUs /> },
      {
        path: "/parking",
        element: <ExploreParking />,
      },
      {
        path: "/vehicles",
        element: <Vehi />,
      },
      {
        path: "/contactus",
        element: <ContactUs />,
      },
      {
        path: "/admin",
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "parking-registration",
            element: <ParkingReg />,
          },
        ],
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/parking/:id",
        element: <ParkingProfile />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "management",
            element: <Management />,
          },
          {
            path: "management/add",
            element: <ParkingForm />,
          },
          {
            path: "management/edit/:id",
            element: <ParkingForm />,
          },
          {
            path: "management/view/:id",
            element: <ParkingView />,
          },
          {
            path: "management/slots/:id",
            element: <ParkingSlots />,
          },
          {
            path: "management/history/:id",
            element: <ParkingHistory />,
          },
          {
            path: "profile",
            element: <UserProfile />,
          },
        ],
      },
    ],
  },
  // {
  // 	element: <PrivateLayout />,
  // 	children: [
  // 		{
  // 			path: "/EditProfile",
  // 			element: <EditProfile />,
  // 		},
  // 		{
  // 			path: "/DashBoard",
  // 			element: <DashBoard />,
  // 		},
  // 	],
  // },
  // {
  // 	element: <AnotherLayout />,
  // 	children: [
  // 		{
  // 			path: "/login",
  // 			element: <Login />,
  // 		},
  // 		{
  // 			path: "/temp",
  // 			element: <Temp />,
  // 		},
  // 	],
  // },
]);
