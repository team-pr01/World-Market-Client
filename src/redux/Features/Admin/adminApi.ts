import { baseApi } from "../../Api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signinAdmin: builder.mutation({
      query: (userInfo) => ({
        url: "/admin/login",
        method: "POST",
        body: userInfo,
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    getAllDeposits: builder.query({
      query: () => ({
        url: "/admin/deposit",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    getDepositByID: builder.query({
      query: (id) => ({
        url: `/admin/deposit/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    approveDeposit: builder.mutation({
      query: (id) => ({
        url: `/admin/deposit/${id}/approve`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    rejectDeposit: builder.mutation({
      query: (id) => ({
        url: `/admin/deposit/${id}/reject`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    approveWithdraw: builder.mutation({
      query: (id) => ({
        url: `/admin/withdraw/${id}/approve`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    rejectWithdraw: builder.mutation({
      query: (id) => ({
        url: `/admin/withdraw/${id}/reject`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["user"],
    }),

    getAllWithdrawals: builder.query({
      query: () => ({
        url: "/admin/withdraw",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),

    getWithdrawByID: builder.query({
      query: (id) => ({
        url: `/admin/withdraw/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),
getAllUser: builder.query({
  query: (params) => ({
    url: "/admin/users",
    method: "GET",
    credentials: "include",
    params, // this will serialize query params automatically
  }),
  providesTags: ["user"],
}),


    getSingleUserById: builder.query({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useSigninAdminMutation,
  useGetAllDepositsQuery,
  useGetDepositByIDQuery,
  useApproveDepositMutation,
  useRejectDepositMutation,
  useApproveWithdrawMutation,
  useRejectWithdrawMutation,
  useGetAllWithdrawalsQuery,
  useGetWithdrawByIDQuery,
  useGetAllUserQuery,
  useGetSingleUserByIdQuery,
} = adminApi;
