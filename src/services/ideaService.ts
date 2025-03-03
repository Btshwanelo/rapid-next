import { apiSlice } from '../slices/apiSlice';

export const ideaSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  useLoginUserMutation,useGetProjectByIdQuery
} = ideaSlice;
