import {
  LayoutDashboard,
  School,
  Users,
  Banknote,
  Settings2,
} from "lucide-react";

export const SIDEBAR_CONFIG = {
  user: {
    name: "Admin User",
    email: "admin@university.edu",
    avatar: "/avatars/admin.jpg",
  },
  header: {
    name: "Aston University",
    logo: School,
    plan: "University Edition",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Main Dashboard",
          url: "/dashboard",
          roles: ["admin", "teacher", "student", "parent"],
        },
        {
          title: "Activities Log",
          url: "/activies-log",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Academics",
      url: "#",
      icon: School,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Classes",
          url: "/classes",
          roles: ["admin", "teacher"],
        },
        {
          title: "Subjects",
          url: "/subjects",
          roles: ["admin", "teacher"],
        },
        {
          title: "Timetable",
          url: "/timetable",
          roles: ["admin", "teacher", "student", "parent"],
        },
        {
          title: "Attendance",
          url: "/attendance",
          roles: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      roles: ["admin", "teacher"],
      items: [
        { title: "Students", url: "/users/students" },
        {
          title: "Teachers",
          url: "/users/teachers",
          roles: ["admin"],
        },
        {
          title: "Parents",
          url: "/users/parents",
          roles: ["admin"],
        },
        {
          title: "Admins",
          url: "/users/admins",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: Banknote,
      roles: ["admin"],
      items: [
        { title: "Fee Collection", url: "/finance/fees" },
        { title: "Expenses", url: "/finance/expenses" },
        { title: "Salary", url: "/finance/salary" },
      ],
    },
    {
      title: "System",
      url: "#",
      icon: Settings2,
      roles: ["admin"],
      items: [
        { title: "General Settings", url: "/settings/general" },
        { title: "Academic Years", url: "/settings/academic-years" },
        { title: "Roles & Permissions", url: "/settings/roles" },
      ],
    },
  ],
};
