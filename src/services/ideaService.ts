import { apiSlice } from '../slices/apiSlice';

export const ideaSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateIdea: builder.mutation({
      query: (body) => ({
        url: `/ideas`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    UpdateIdea: builder.mutation({
      query: ({body,id}) => ({
        url: `/ideas/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [],
    }),
    GetIdeasByProject: builder.query({
        query: ({reqData,id}) => ({
          url: `/ideas/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${reqData.authToken}`,
          },
        }),
      }),
    GetIdeaById: builder.query({
        query: ({reqData,id}) => ({
          url: `/ideas/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${reqData.authToken}`,
          },
        }),
      }),
  }),
});

export const {
useCreateIdeaMutation,
useLazyGetIdeaByIdQuery,
useLazyGetIdeasByProjectQuery,
useUpdateIdeaMutation} = ideaSlice;
