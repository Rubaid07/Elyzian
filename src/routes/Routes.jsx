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

import ManageUsers from "../pages/dashboard/Admin/ManageUsers";
import ManagePolicies from "../pages/dashboard/Admin/ManagePolicies";
import ManageTransactions from "../pages/dashboard/Admin/ManageTransactions";
import ManageAgents from "../pages/dashboard/Admin/ManageAgents";
import ManageApplications from "../pages/dashboard/Admin/ManageApplications";

import AssignedCustomers from "../pages/dashboard/agent/AssignedCustomers";
import ManageBlogs from "../pages/dashboard/agent/ManageBlogs";
import AddBlog from "../pages/dashboard/agent/AddBlog";

import MyPolicies from "../pages/dashboard/customer/MyPolicies";
import Payment from "../pages/dashboard/customer/Payment";
import PaymentStatus from "../pages/dashboard/customer/PaymentStatus";
import ClaimRequest from "../pages/dashboard/customer/ClaimRequest";

import AllPolicies from "../pages/AllPolicies";
import PolicyDetails from "../pages/PolicyDetails";
import QuotePage from "../pages/QuotePage";
import ApplicationFormPage from "../pages/ApplicationFormPage";
import Blogs from "../pages/Blogs";
import BlogDetails from "../pages/BlogDetails";
import FAQs from "../pages/FAQs";
import Agents from "../pages/Agents";
import DashboardOverview from "../pages/dashboard/DashboardOverview";
import ApplyAsAgent from "../pages/dashboard/customer/ApplyAsAgent";
import EditBlog from "../pages/dashboard/agent/EditBlog";


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
        Component: AllPolicies
      },
      {
        path: 'policies/:id',
        Component: PolicyDetails
      },
      {
        path: 'blogs',
        Component: Blogs
      },
      {
        path: 'agents',
        Component: Agents
      },
      {
        path: 'blog-details/:id',
        Component: BlogDetails
      },
      {
        path: 'faqs',
        Component: FAQs
      },

      {
        path: 'quote/:id',
        element: <PrivateRoute><QuotePage /></PrivateRoute>
      },
      {
        path: 'apply/:id',
        element: <PrivateRoute><ApplicationFormPage /></PrivateRoute>
      },
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
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: 'dashboard-overview',
        Component: DashboardOverview,
      },
      {
        path: 'profile',
        Component: Profile
      },

      // Admin Routes
      {
        path: 'manage-users',
        Component: ManageUsers
      },
      {
        path: 'manage-policies',
        Component: ManagePolicies
      },
      {
        path: 'manage-applications',
        Component: ManageApplications
      },
      {
        path: 'transactions',
        Component: ManageTransactions
      },
      {
        path: 'manage-agents',
        Component: ManageAgents
      },

      // Agent Routes
      {
        path: 'assigned-customers',
        Component: AssignedCustomers
      },
      {
        path: 'manage-blogs',
        Component: ManageBlogs
      },
      {
        path: 'add-blog',
        Component: AddBlog
      },
      {
        path: 'manage-blogs/edit-blog/:id',
        Component: EditBlog
      },

      // Customer Routes
      {
        path: 'my-policies',
        Component: MyPolicies
      },
      {
        path: 'payment-status',
        Component: PaymentStatus
      },
      {
        path: 'payment',
        Component: Payment
      },
      {
        path: 'claim-request',
        Component: ClaimRequest
      },
      {
        path: 'apply-agent',
        Component: ApplyAsAgent
      }
    ]
  }
]);