import type { Schedule } from "@/types/type";
import { apiSlice } from "./api";

export interface GenSettings {
  startTime: string;
  endTime: string;
  periods: number;
}

export const timetableApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // get timetable by class
    getTimetableByClass: builder.query<{ schedule: Schedule[] }, string>({
      query: (classId) => `/timetables/${classId}`,
      providesTags: (result, error, id) => [{ type: "Timetable", id }],
    }),

    // generate timetable with AI
    generateTimetable: builder.mutation<
      { message: string },
      { classId: string; academicYearId: string; settings: GenSettings }
    >({
      query: (body) => ({
        url: "/timetables/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: "Timetable", id: classId },
      ],
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
  useGetTimetableByClassQuery,
  useGenerateTimetableMutation,
  useGetInitialDataQuery,
} = timetableApi;
