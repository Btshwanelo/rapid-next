import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const DEV_BASE_URL = "http://localhost:5001";
const PROD_BASE_URL = 'http://172.172.166.174:5011/api';

export const autogentApiSlice = createApi({
  reducerPath: 'autogentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: PROD_BASE_URL,
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    ClarifyingQuestions: builder.mutation({
      query: (body) => ({
        url: `askautogen/forclarifyingquestion`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
  }),
});

export const {
  useClarifyingQuestionsMutation,
} = autogentApiSlice;
