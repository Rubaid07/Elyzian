import {
  createBrowserRouter,
} from "react-router";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Home from "../pages/HomePage/Home";
import Register from "../pages/Authentication/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/dashboard/Profile";
import MyPolicies from "../pages/dashboard/MyPolicies";
import ManageUsers from "../pages/dashboard/ManageUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'policies',
        // Component: 
      }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        path: 'profile',
        Component: Profile
      },
      {
        path: 'my-policies',
        Component: MyPolicies
      },
      {
        path: 'manage-users',
        Component: ManageUsers
      }
    ]
  }
]);