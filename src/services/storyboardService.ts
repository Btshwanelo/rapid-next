import { apiSlice } from '../slices/apiSlice';

export const storyboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateStory: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/storyboards`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: [],
    }),
    UpdateStory: builder.mutation({
      query: ({body,id}) => ({
        url: `/storyboards/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    DeleteStory: builder.mutation({
      query: ({id,authToken}) => ({
        url: `/storyboards/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: [],
    }),
    UpdateStoryFrame: builder.mutation({
      query: ({body,storyId,frameIndx,authToken}) => ({
        url: `/storyboards/${storyId}/frames/${frameIndx}`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: [],
    }),
    GetStoriesByProject: builder.query({
        query: ({projectId,authToken}) => ({
          url: `/storyboards/project/${projectId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
}); 

export const {
  useCreateStoryMutation,
  useUpdateStoryFrameMutation,
  useDeleteStoryMutation,
  useUpdateStoryMutation,
  useLazyGetStoriesByProjectQuery
} = storyboardSlice;
