import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout/PublicLayout";
import Landing from "@/pages/Landing";
import Blank from "@/pages/Blank";
import Temp from "@/pages/Temp";
import Login from "@/pages/Login";
import ComponentTest from "@/pages/ComponentTest";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import MyParking from "@/pages/dashboard/MyParking";
import Management from "@/pages/dashboard/management/Management";
import ParkingForm from "@/pages/dashboard/management/ParkingForm";
import ParkingSlots from "@/pages/dashboard/management/ParkingSlots";
import AboutUs from "@/pages/AboutUs";
import ExploreParking from "@/pages/exploreParking";
import Vehi from "@/pages/vehi";
import ContactUs from "@/pages/contactUs";
import UserProfile from "@/pages/UserProfile";

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
        path: "/parkings",
        element: <ExploreParking />,
      },
      {
        path: "/vehi",
        element: <Vehi />,
      },
      {
        path: "/contactus",
        element: <ContactUs />,
      },
      {
        path: "/userprofile",
        element: <UserProfile />,
      },
      // {
      // 	path: "/AboutUs",
      // 	element: <AboutUs />,
      // },
      // {
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true, // ← add this
        element: <MyParking />,
      },
      {
        path: "my-parking",
        element: <MyParking />,
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
        path: "management/slots/:id",
        element: <ParkingSlots />,
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
