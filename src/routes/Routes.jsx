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
import FAQs from "../pages/FAQs";
import DashboardOverview from "../pages/dashboard/DashboardOverview";
import ApplyAsAgent from "../pages/dashboard/customer/ApplyAsAgent";
import EditBlog from "../pages/dashboard/agent/EditBlog";
import ManageClaims from "../pages/dashboard/Admin/ManageClaims";
import BlogDetails from "../pages/BlogDetails";
import Error from "../component/Error";
import PrivacyPolicy from "../component/PrivacyPolicy";
import TermsOfService from "../component/TermsOfService";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <Error></Error>,
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
        path: 'blog-details/:id',
        Component: BlogDetails
      },
      {
        path: 'faqs',
        Component: FAQs
      },
      {
        path: 'privacy-policy',
        Component: PrivacyPolicy
      },
      {
        path: 'terms-of-service',
        Component: TermsOfService
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
        element: <PrivateRoute allowedRoles={['admin']}><ManageUsers /></PrivateRoute>
      },
      {
        path: 'manage-policies',
        element: <PrivateRoute allowedRoles={['admin']}><ManagePolicies /></PrivateRoute>
      },
      {
        path: 'manage-applications',
        element: <PrivateRoute allowedRoles={['admin']}><ManageApplications /></PrivateRoute>
      },
      {
        path: 'transactions',
        element: <PrivateRoute allowedRoles={['admin']}><ManageTransactions /></PrivateRoute>
      },
      {
        path: 'manage-agents',
        element: <PrivateRoute allowedRoles={['admin']}><ManageAgents /></PrivateRoute>
      },
      {
        path: 'manage-claims',
        element: <PrivateRoute allowedRoles={['admin']}><ManageClaims /></PrivateRoute>
      },

      // Agent Routes
      {
        path: 'assigned-customers',
        element: <PrivateRoute allowedRoles={['agent']}><AssignedCustomers /></PrivateRoute>
      },
      {
        path: 'manage-blogs',
        element: <PrivateRoute allowedRoles={['agent']}><ManageBlogs /></PrivateRoute>
      },
      {
        path: 'add-blog',
        element: <PrivateRoute allowedRoles={['agent']}><AddBlog /></PrivateRoute>
      },
      {
        path: 'manage-blogs/edit-blog/:id',
        element: <PrivateRoute allowedRoles={['agent']}><EditBlog /></PrivateRoute>
      },

      // Customer Routes
      {
        path: 'my-policies',
        element: <PrivateRoute allowedRoles={['customer']}><MyPolicies /></PrivateRoute>
      },
      {
        path: 'payment-status',
        element: <PrivateRoute allowedRoles={['customer']}><PaymentStatus /></PrivateRoute>
      },
      {
        path: 'payment-status/payment/:id',
        element: <PrivateRoute allowedRoles={['customer']}><Payment /></PrivateRoute>
      },
      {
        path: 'claim-request',
        element: <PrivateRoute allowedRoles={['customer']}><ClaimRequest /></PrivateRoute>
      },
      {
        path: 'apply-agent',
        element: <PrivateRoute allowedRoles={['customer']}><ApplyAsAgent /></PrivateRoute>
      },
    ]
  }
]);