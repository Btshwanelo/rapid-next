import { apiSlice } from '../slices/apiSlice';

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    RegisterUser: builder.mutation({
      query: (body) => ({
        url: `/auth/register`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    LoginUser: builder.mutation({
      query: (body) => ({
        url: `/auth/login`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetProjectById: builder.query({
        query: (reqData) => ({
          url: `/dashbaord`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${reqData.authToken}`,
          },
        }),
      }),
  }),
});

export const {
  useLoginUserMutation,useRegisterUserMutation,useGetProjectByIdQuery
} = authSlice;
