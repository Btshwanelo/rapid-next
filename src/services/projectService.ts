import { apiSlice } from '../slices/apiSlice';

export const projectSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateProject: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/projects`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
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
  useCreateProjectMutation,useGetProjectByIdQuery
} = projectSlice;
