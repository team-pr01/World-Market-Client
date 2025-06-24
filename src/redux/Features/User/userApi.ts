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
          sortBy = "created_at",
          sortOrder = "desc",
          search,
          status,
          payment_method,
          startDate,
          endDate,
          minAmount,
          maxAmount,
        } = params;

        const queryParams = new URLSearchParams();

        // Always include page and limit with default values
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        // Include sort parameters with default values
        queryParams.append("sortBy", sortBy);
        queryParams.append("sortOrder", sortOrder);

        // Conditionally append other parameters if they exist
        if (search) queryParams.append("search", search);
        if (status) queryParams.append("status", status);
        if (payment_method)
          queryParams.append("payment_method", payment_method);
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);
        if (minAmount) queryParams.append("minAmount", minAmount.toString());
        if (maxAmount) queryParams.append("maxAmount", maxAmount.toString());

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

        // Always include page and limit with default values
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        // Conditionally append other parameters if they exist
        if (search) queryParams.append("search", search);
        if (status) queryParams.append("status", status);

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
