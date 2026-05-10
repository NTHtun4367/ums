import type { Timetable, Pagination } from "@/types/type";
import { apiSlice } from "./api";

export interface GenSettings {
  startTime: string;
  endTime: string;
  periods: number;
}

export const timetableApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Get all timetables (Admin/Teacher)
    getAllTimetables: builder.query<
      { timetables: Timetable[]; pagination: Pagination },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "/timetables",
        params: { page, limit },
      }),
      providesTags: ["Timetable"],
    }),

    // Get timetable by class - FIXED PATH to /class/:id
    getTimetableByClass: builder.query<Timetable, string>({
      query: (classId) => `/timetables/class/${classId}`,
      providesTags: (result, error, id) => [{ type: "Timetable", id }],
    }),

    // Generate timetable with AI
    generateTimetable: builder.mutation<
      { message: string },
      { classId: string; academicYearId: string; settings: GenSettings }
    >({
      query: (body) => ({
        url: "/timetables/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Timetable"],
    }),

    // Delete Timetable
    deleteTimetable: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/timetables/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timetable"],
    }),

    getInitialData: builder.query<{ classes: any[]; years: any[] }, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const [clsRes, yearRes] = await Promise.all([
          baseQuery("/classes"),
          baseQuery("/academic-years"),
        ]);

        if (clsRes.error) return { error: clsRes.error as any };
        if (yearRes.error) return { error: yearRes.error as any };

        return {
          data: {
            classes: (clsRes.data as any).classes,
            years: (yearRes.data as any).years,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllTimetablesQuery,
  useGetTimetableByClassQuery,
  useGenerateTimetableMutation,
  useDeleteTimetableMutation,
  useGetInitialDataQuery,
} = timetableApi;
