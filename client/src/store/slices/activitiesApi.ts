import { apiSlice } from "./api";
import type { Pagination, ActivitiesLog } from "@/types/type";

export const activitiesApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * @desc Get system activity logs (Admin/Teacher)
     */
    getAllActivities: builder.query<
      { logs: ActivitiesLog[]; pagination: Pagination },
      { page: number; limit: number }
    >({
      query: (params) => ({
        url: "/activities",
        method: "GET",
        params,
      }),
      providesTags: ["Activities"],
    }),
  }),
});

export const { useGetAllActivitiesQuery } = activitiesApi;
