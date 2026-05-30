import {
  LayoutDashboard,
  School,
  Users,
  Banknote,
  Settings2,
  Megaphone,
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
      url: "/app/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "teacher", "student", "hod"],
      items: [{ title: "Overview", url: "/app/dashboard" }],
    },
    {
      title: "Announcements",
      url: "/app/announcements",
      icon: Megaphone,
      roles: ["admin", "teacher", "student", "hod"],
      items: [{ title: "View All", url: "/app/announcements" }],
    },
    {
      title: "Academics",
      url: "#",
      icon: School,
      roles: ["admin", "teacher", "student", "hod"],
      items: [
        {
          title: "Departments",
          url: "/app/departments",
          roles: ["admin"],
        },
        {
          title: "Classes",
          url: "/app/classes",
          roles: ["admin", "teacher", "hod"],
        },
        {
          title: "Subjects",
          url: "/app/subjects",
          roles: ["admin", "teacher", "hod"],
        },
        {
          title: "Timetable",
          url: "/app/timetable",
          roles: ["admin", "teacher", "student", "hod"],
        },
        {
          title: "Attendance",
          url: "/app/attendance",
          roles: ["admin", "teacher", "hod", "student"],
        },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      roles: ["admin", "hod"],
      items: [
        { title: "Students", url: "/app/users/students", roles: ["admin", "hod"] },
        { title: "Teachers", url: "/app/users/teachers", roles: ["admin", "hod"] },
        { title: "Heads of Dept", url: "/app/users/hods", roles: ["admin"] },
        { title: "Admins", url: "/app/users/admins", roles: ["admin"] },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: Banknote,
      roles: ["admin"],
      items: [
        { title: "Fees", url: "/app/finance/fees", roles: ["admin"] },
        { title: "Salary", url: "/app/finance/salary", roles: ["admin"] },
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
          url: "/app/settings/academic-years",
          roles: ["admin"],
        },
        { title: "General", url: "/app/settings/general", roles: ["admin"] },
      ],
    },
  ],
};
