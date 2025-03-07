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
      invalidatesTags: ['problem'],
    }),
    UpdateProblem: builder.mutation({
      query: ({body,authToken,id}) => ({
        url: `/problem-statements/${id}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['problem'],
    }),
    DeleteProblem: builder.mutation({
      query: ({body,authToken,id}) => ({
        url: `/problem-statements/${id}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['problem'],
    }),
    GetProblemByProject: builder.query({
        query: ({projectId,authToken}) => ({
          url: `/problem-statements/project/${projectId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
        providesTags:['problem']
      }),
  }),
});

export const {
  useCreateProblemMutation,
  useLazyGetProblemByProjectQuery,
  useUpdateProblemMutation,
  useDeleteProblemMutation
} = problemSlice;
