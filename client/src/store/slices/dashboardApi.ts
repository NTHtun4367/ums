import { apiSlice } from "./api";

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
}

export interface ActivityLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    role: string;
  };
  action: string;
  details: string;
  createdAt: string;
}

export interface AttendanceTrend {
  _id: string;
  present: number;
  absent: number;
}

export interface UserDistribution {
  _id: string;
  count: number;
}

export interface Period {
  subjectId: { _id: string; name: string };
  teacherId: { _id: string; name: string };
  startMinutes: number;
  endMinutes: number;
  room: string;
  className?: string;
  subjectName?: string;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    summary: DashboardStat[];
    recentActivities: ActivityLog[];
    chartData: {
      attendanceTrend: AttendanceTrend[];
      userDistribution?: UserDistribution[];
    };
    todaySchedule?: Period[];
  };
}

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * @desc Get role-based dashboard statistics
     */
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      // Dashboard data often changes based on other activities,
      // you might want to provide tags if you want it to refetch automatically
      providesTags: ["User", "Attendance", "Class"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
