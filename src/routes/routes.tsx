import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout/PublicLayout";
import Landing from "@/pages/Landing";
import Blank from "@/pages/Blank";
import Temp from "@/pages/Temp";
import Login from "@/pages/Login";
import ComponentTest from "@/pages/ComponentTest";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";

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
      {
        path: "/aboutus",
        element: <AboutUs />,
      },
      {
        path: "/contactus",
        element: <ContactUs />,
      },
      // {
      // 	path: "/AboutUs",
      // 	element: <AboutUs />,
      // },
      // {
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
