import { WithdrawResponse } from "@/type/withdraw";
import { baseApi } from "../../Api/baseApi";
import { DepositResponse } from "@/type/deposit";

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

          getAdminProfile: builder.query({
               query: () => ({
                    url: "/admin/profile",
                    method: "GET",
                    credentials: "include",
               }),
               providesTags: ["user"],
          }),

          getAllDeposits: builder.query<DepositResponse, {page?: number, limit?: number, search?: string, status?: string}>({
               query: (params = {}) => {
                    const { page = 1, limit = 10, search, status } = params;

                    const queryParams = new URLSearchParams();
                    queryParams.append("page", page.toString());
                    queryParams.append("limit", limit.toString());

                    if (search) queryParams.append("search", search);
                    if (status && status !== "all") queryParams.append("status", status);

                    return {
                         url: `/admin/deposit?${queryParams.toString()}`,
                         method: "GET",
                         credentials: "include",
                    };
               },
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

          getAllWithdrawals: builder.query<WithdrawResponse, void>({
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
                    params,
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

          getAllPaymentMethods: builder.query({
               query: () => ({
                    url: "/admin/payment-method",
                    method: "GET",
                    credentials: "include",
               }),
               providesTags: ["user"],
          }),

          addPaymentMethod: builder.mutation({
               query: (data) => ({
                    url: `/admin/payment-method/payment-method`,
                    method: "POST",
                    body: data,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          deletePaymentMethod: builder.mutation({
               query: (id) => ({
                    url: `/admin/payment-method/${id}`,
                    method: "DELETE",
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          getAllSymbols: builder.query({
               query: () => ({
                    url: "/admin/symbols",
                    method: "GET",
                    credentials: "include",
               }),
               providesTags: ["user"],
          }),

          addPairMarket: builder.mutation({
               query: (data) => ({
                    url: `/admin/symbols`,
                    method: "POST",
                    body: data,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          deletePairMarket: builder.mutation({
               query: (id) => ({
                    url: `/admin/symbols/${id}`,
                    method: "DELETE",
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          getAllSupportTicketsAdmin: builder.query({
               query: () => ({
                    url: "/admin/support/admin/tickets",
                    method: "GET",
                    credentials: "include",
               }),
               providesTags: ["user"],
          }),

          adminReplyOnSupportTicket: builder.mutation({
               query: ({ id, message }) => ({
                    url: `/admin/support/admin/tickets/${id}/reply`,
                    method: "POST",
                    body: { message },
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          adminCloseSupportTicket: builder.mutation({
               query: (id) => ({
                    url: `/admin/support/admin/tickets/${id}/close`,
                    method: "POST",
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),
     }),
});

export const {
     useGetAdminProfileQuery,
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
     useGetAllPaymentMethodsQuery,
     useAddPaymentMethodMutation,
     useDeletePaymentMethodMutation,
     useGetAllSymbolsQuery,
     useAddPairMarketMutation,
     useDeletePairMarketMutation,
     useGetAllSupportTicketsAdminQuery,
     useAdminReplyOnSupportTicketMutation,
     useAdminCloseSupportTicketMutation,
} = adminApi;
