import { baseApi } from "../../Api/baseApi";

const authApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          signup: builder.mutation({
               query: (userInfo) => ({
                    url: "/auth/register",
                    method: "POST",
                    body: userInfo,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          verifyEmail: builder.mutation({
               query: (userInfo) => ({
                    url: "/auth/verify-email",
                    method: "POST",
                    body: userInfo,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          signin: builder.mutation({
               query: (userInfo) => ({
                    url: "/auth/login",
                    method: "POST",
                    body: userInfo,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          forgotPassword: builder.mutation({
               query: (forgotPasswordData) => ({
                    url: "/auth/forgot-password",
                    method: "POST",
                    body: forgotPasswordData,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),

          resetPassword: builder.mutation({
               query: ({ resetPasswordData }) => ({
                    url: `/auth/reset-password`,
                    method: "POST",
                    body: resetPasswordData,
                    credentials: "include",
               }),
               invalidatesTags: ["user"],
          }),
     }),
});

export const {
     useSignupMutation,
     useVerifyEmailMutation,
     useSigninMutation,
     useForgotPasswordMutation,
     useResetPasswordMutation,
} = authApi;
