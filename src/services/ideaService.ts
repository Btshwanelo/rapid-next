import { apiSlice } from '../slices/apiSlice';

export const ideaSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateIdea: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/ideas`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['idea'],
    }),
    CreateIdeas: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/ideas/multiple`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['idea'],
    }),
    UpdateIdea: builder.mutation({
      query: ({body,id,authToken}) => ({
        url: `/ideas/${id}`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['idea'],
    }),
    UpdateIdeaPosition: builder.mutation({
      query: ({body,id,authToken}) => ({
        url: `/ideas/${id}/position`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['idea'],
    }),
    DeleteIdea: builder.mutation({
      query: ({id,authToken}) => ({
        url: `/ideas/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ['idea'],
    }),
    GetIdeasByProject: builder.query({
        query: ({authToken,id}) => ({
          url: `/ideas/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
        providesTags: ['idea'],
      }),
    GetIdeaById: builder.query({
        query: ({authToken,id}) => ({
          url: `/ideas/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
        providesTags: ['idea'],
      }),
  }),
});

export const {
useCreateIdeaMutation,
useLazyGetIdeaByIdQuery,
useLazyGetIdeasByProjectQuery,
useUpdateIdeaPositionMutation,
useCreateIdeasMutation,
useDeleteIdeaMutation,
useUpdateIdeaMutation} = ideaSlice;
