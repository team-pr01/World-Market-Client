import { baseApi } from "../../Api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getMyPurchasedCourses: builder.query({
      query: () => ({
        url: "/purchased/course",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/myprofile",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    updateProfile: builder.mutation({
      query: (profileUpdatedData) => ({
        method: "PUT",
        url: `/me/update`,
        body: profileUpdatedData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetMyPurchasedCoursesQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
} = userApi;
