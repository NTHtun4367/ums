import { apiSlice } from "./api";
import type { Attendance, AttendanceStats } from "@/types/type";

export const attendanceApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * @desc Mark student attendance
     */
    markAttendance: builder.mutation<
      { success: boolean; message: string; data: Attendance },
      Partial<Attendance>
    >({
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
    getAttendanceByClass: builder.query<
      { success: boolean; count: number; data: Attendance[] },
      {
        classId: string;
        attendanceDate?: string;
        subjectId?: string;
        sessionNumber?: number;
      }
    >({
      query: ({ classId, ...params }) => ({
        url: `/attendance/class/${classId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Attendance"],
    }),

    /**
     * @desc Get attendance statistics for a specific student
     */
    getStudentStats: builder.query<
      { success: boolean; data: AttendanceStats },
      { studentId: string; academicYearId: string }
    >({
      query: ({ studentId, academicYearId }) => ({
        url: `/attendance/student/${studentId}/stats`,
        method: "GET",
        params: { academicYearId },
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
