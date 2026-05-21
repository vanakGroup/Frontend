import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout/PublicLayout";
import Landing from "@/pages/Landing";
import Blank from "@/pages/Blank";
import Temp from "@/pages/Temp";
import Login from "@/pages/Login";
import ComponentTest from "@/pages/ComponentTest";

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
        path: "blank",
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
