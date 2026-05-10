import { apiSlice } from "./api";
import type { Attendance } from "@/types/type";

export const attendanceApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * @desc Mark student attendance
     */
    markAttendance: builder.mutation<{ message: string }, any>({
      query: (data) => ({
        url: "/attendance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    /**
     * @desc Get attendance records for a specific class
     */
    getAttendanceByClass: builder.query<Attendance[], string>({
      query: (classId) => ({
        url: `/attendance/class/${classId}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    /**
     * @desc Get attendance statistics for a specific student
     */
    getStudentStats: builder.query<any, string>({
      query: (studentId) => ({
        url: `/attendance/student/${studentId}/stats`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useMarkAttendanceMutation,
  useGetAttendanceByClassQuery,
  useGetStudentStatsQuery,
} = attendanceApi;
