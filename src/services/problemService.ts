import { apiSlice } from '../slices/apiSlice';

export const problemSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateProblem: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/problem-statements`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: [],
    }),
    GetProblemByProject: builder.query({
        query: ({projectId,authToken}) => ({
          url: `/problem-statements/project/${projectId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
});

export const {
  useCreateProblemMutation,useGetProblemByProjectQuery
} = problemSlice;
