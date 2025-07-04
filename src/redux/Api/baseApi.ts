/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
     baseUrl: "https://api.worldmerket.com/api",
     credentials: "include",
     prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).auth?.token;
          if (token) {
               headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
     },
});

const baseQueryWithAuth: BaseQueryFn<FetchArgs, unknown, unknown> = async (
     args,
     api,
     extraOptions
) => {
     const result = await baseQuery(args, api, extraOptions);
     return result;
};

export const baseApi = createApi({
     reducerPath: "baseApi",
     baseQuery: baseQueryWithAuth,
     tagTypes: ["user"],
     endpoints: () => ({}),
});
