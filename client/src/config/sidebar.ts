import {
  LayoutDashboard,
  School,
  Users,
  Banknote,
  Settings2,
} from "lucide-react";

export const SIDEBAR_CONFIG = {
  header: {
    name: "Aston University",
    logo: School,
    plan: "Management Portal",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "teacher", "student", "hod"],
      items: [{ title: "Overview", url: "/dashboard" }],
    },
    {
      title: "Academics",
      url: "#",
      icon: School,
      roles: ["admin", "teacher", "student", "hod"],
      items: [
        {
          title: "Departments",
          url: "/departments",
          roles: ["admin"],
        },
        {
          title: "Classes",
          url: "/classes",
          roles: ["admin", "teacher", "hod"],
        },
        {
          title: "Subjects",
          url: "/subjects",
          roles: ["admin", "teacher", "hod"],
        },
        {
          title: "Timetable",
          url: "/timetable",
          roles: ["admin", "teacher", "student", "hod"],
        },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      roles: ["admin", "hod"],
      items: [
        { title: "Students", url: "/users/students", roles: ["admin", "hod"] },
        { title: "Teachers", url: "/users/teachers", roles: ["admin", "hod"] },
        { title: "Heads of Dept", url: "/users/hods", roles: ["admin"] },
        { title: "Admins", url: "/users/admins", roles: ["admin"] },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: Banknote,
      roles: ["admin"],
      items: [
        { title: "Fees", url: "/finance/fees", roles: ["admin"] },
        { title: "Salary", url: "/finance/salary", roles: ["admin"] },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      roles: ["admin"],
      items: [
        {
          title: "Academic Years",
          url: "/settings/academic-years",
          roles: ["admin"],
        },
        { title: "General", url: "/settings/general", roles: ["admin"] },
      ],
    },
  ],
};
