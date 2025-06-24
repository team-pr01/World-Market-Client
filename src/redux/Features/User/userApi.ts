import { baseApi } from "../../Api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTransactions: builder.query({
      query: () => ({
        url: "/purchased/course",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    getMe: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    getAllDeposits: builder.query({
  query: (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = params;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search) queryParams.append("search", search);
    if (status && status !== "all") queryParams.append("status", status); 

    return {
      url: `/deposit?${queryParams.toString()}`,
      method: "GET",
      credentials: "include",
    };
  },
  providesTags: ["user"],
}),


   getAllWithdrawals: builder.query({
  query: (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = params;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search) queryParams.append("search", search);
    if (status && status !== "all") queryParams.append("status", status);

    return {
      url: `/withdraw?${queryParams.toString()}`,
      method: "GET",
      credentials: "include",
    };
  },
  providesTags: ["user"],
}),


    updateProfile: builder.mutation({
      query: (profileUpdatedData) => ({
        method: "PUT",
        url: `/user/profile`,
        body: profileUpdatedData,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    updateProfileImage: builder.mutation({
      query: (data) => ({
        method: "PUT",
        url: `/user/profile/image`,
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserTransactionsQuery,
  useGetMeQuery,
  useGetAllDepositsQuery,
  useGetAllWithdrawalsQuery,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
} = userApi;
