import { apiSlice } from "./api";
import type { Timetable } from "@/types/type";

interface TimetableResponse {
  success: boolean;
  data: Timetable[];
}

interface SaveTimetablePayload {
  classId: string;

  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  periods: {
    subjectId: string;
    teacherId: string;
    startMinutes: number;
    endMinutes: number;
    room: string;
  }[];
}

export const timetableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassTimetable: builder.query<Timetable[], string>({
      query: (classId) => `/timetables/class/${classId}`,

      transformResponse: (response: TimetableResponse) => response.data,

      providesTags: (_result, _error, arg) => [{ type: "Timetable", id: arg }],
    }),

    saveTimetableDay: builder.mutation<any, SaveTimetablePayload>({
      query: (body) => ({
        url: "/timetables",
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Timetable", id: arg.classId },
      ],
    }),

    deleteTimetableDay: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/timetables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timetable"],
    }),
  }),
});

export const {
  useGetClassTimetableQuery,
  useSaveTimetableDayMutation,
  useDeleteTimetableDayMutation,
} = timetableApi;
