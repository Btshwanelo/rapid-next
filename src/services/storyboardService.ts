import { apiSlice } from '../slices/apiSlice';

export const storyboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateStory: builder.mutation({
      query: (body) => ({
        url: `/storyboards`,
        method: 'POST',
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
      query: ({body,id}) => ({
        url: `/storyboards/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    UpdateStoryFrame: builder.mutation({
      query: ({body,frameId,frameIndx}) => ({
        url: `/storyboards/${frameId}/frames/${frameIndx}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetStoriesByProject: builder.query({
        query: (reqData) => ({
          url: `/storyboards`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${reqData.authToken}`,
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
