import type { Pagination, User, UserRole } from "@/types/type";
import { apiSlice } from "./api";

interface LoginInput {
  email: string;
  password: string;
}

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // --- User Management Endpoints ---

    // Get Users with Filters
    getUsers: builder.query<
      { users: User[]; pagination: Pagination },
      { page: number; limit: number; role: UserRole; search?: string }
    >({
      query: ({ page, limit, role, search }) => {
        let url = `/users?page=${page}&limit=${limit}&role=${role}`;
        if (search) url += `&search=${search}`;
        return url;
      },
      providesTags: ["User"],
    }),

    // Create User
    createUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Update User
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete User
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // --- Authentication & Profile Endpoints ---

    // User Login
    login: builder.mutation<any, LoginInput>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Get Current User Profile
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // User Logout
    logout: builder.mutation<any, void>({
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
