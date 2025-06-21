import { baseApi } from "../../Api/baseApi";

const internshipProgrammesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        
        getAllProgrammes: builder.query({
            query: () => ({
                url: `/courses`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["programmes"],
        }),

        getSingleProgrammeById: builder.query({
            query: (id) => ({
                url: `/course/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["programmes"],
        }),
    }),
});

export const {useGetAllProgrammesQuery, useGetSingleProgrammeByIdQuery} = internshipProgrammesApi;
