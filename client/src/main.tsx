import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Main from "./layouts/main";
import Index from "./pages";
import Login from "./pages/login";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "./store";
import Protect from "./pages/protector/isLogin";
import AcademicYear from "./pages/settings/academic-year";
import UserManagementPage from "./pages/users";
import Classes from "./pages/academics/classes";
import Timetable from "./pages/academics/timetable";
import SubjectsPage from "./pages/academics/subjects";
import DepartmentPage from "./pages/academics/departments";
import AttendancePage from "./pages/academics/attendance";
import AnnouncementsPage from "./pages/announcements";
import LandingPage from "./pages/landing";
import DepartmentPortalPage from "./pages/department-portal";
import AboutPage from "./pages/about";
import AdmissionsPage from "./pages/admissions";
import CampusLifePage from "./pages/campus-life";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/admissions",
    element: <AdmissionsPage />,
  },
  {
    path: "/campus-life",
    element: <CampusLifePage />,
  },
  {
    path: "/departments/:id",
    element: <DepartmentPortalPage />,
  },
  {
    path: "/app",
    element: (
      <Protect>
        <Main />
      </Protect>
    ),
    children: [
      { index: true, element: <Index /> },
      { path: "dashboard", element: <Index /> },
      { path: "announcements", element: <AnnouncementsPage /> },
      { path: "settings/academic-years", element: <AcademicYear /> },
      {
        path: "users/students",
        element: (
          <UserManagementPage
            role="student"
            title="Student Directory"
            description="Manage all enrolled students and their class assignments."
          />
        ),
      },
      {
        path: "users/teachers",
        element: (
          <UserManagementPage
            role="teacher"
            title="Faculty Management"
            description="Manage teachers and their subject specializations."
          />
        ),
      },
      // ADDED: HOD Management Route
      {
        path: "users/hods",
        element: (
          <UserManagementPage
            role="hod"
            title="Department Heads"
            description="Manage Heads of Departments and their administrative assignments."
          />
        ),
      },
      {
        path: "users/admins",
        element: (
          <UserManagementPage
            role="admin"
            title="Administrator Staff"
            description="System administrators with full access control."
          />
        ),
      },
      { path: "classes", element: <Classes /> },
      { path: "subjects", element: <SubjectsPage /> },
      { path: "timetable", element: <Timetable /> },
      { path: "attendance", element: <AttendancePage /> },
      { path: "departments", element: <DepartmentPage /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" />
    </Provider>
  </StrictMode>,
);
