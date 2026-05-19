import { apiSlice } from "./api";

export const timetableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassTimetable: builder.query({
      query: (classId) => `/timetables/class/${classId}`,
      providesTags: (result, error, arg) => [{ type: "Timetable", id: arg }],
    }),
    saveTimetableDay: builder.mutation({
      query: (body) => ({
        url: "/timetables",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: "Timetable", id: classId },
      ],
    }),
  }),
});

export const { useGetClassTimetableQuery, useSaveTimetableDayMutation } =
  timetableApi;
