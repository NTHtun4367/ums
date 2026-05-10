import { apiSlice } from "./api";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * @desc Get role-based dashboard statistics
     */
    getDashboardStats: builder.query<any, void>({
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
