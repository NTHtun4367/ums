import type { Pagination, User, UserRole } from "@/types/type";
import { apiSlice } from "./api";

interface LoginInput {
  email: string;
  password: string;
}

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getUsers: builder.query<
      { users: User[]; pagination: Pagination },
      { page: number; limit: number; role?: UserRole | "all"; search?: string }
    >({
      query: ({ page, limit, role, search }) => ({
        url: "/users",
        params: { page, limit, role, search },
      }),
      providesTags: ["User"],
    }),

    createUser: builder.mutation<User & { message: string }, Partial<User>>({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      User & { message: string },
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/users/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation<User, LoginInput>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getMe: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
} = userApi;
