import { apiSlice } from '../slices/apiSlice';

export const needSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateNeed: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/needs`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['need'],
    }),
    CreateNeeds: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/needs/multiple`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['need'],
    }),
    UpdateNeed: builder.mutation({
      query: ({body,authToken,id}) => ({
        url: `/needs/${id}`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body,
      }),
      invalidatesTags: ['need'],
    }),
    DeleteNeed: builder.mutation({
      query: ({id,authToken}) => ({
        url: `/needs/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      invalidatesTags: ['need'],
    }),
    GetNeedsByProject: builder.query({
        query: ({id,authToken}) => ({
          url: `/needs/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
        providesTags:['need']
      }),
    GetNeedsByUser: builder.query({
        query: ({id,authToken}) => ({
          url: `/needs/user/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
        providesTags:['need']
      }),
  }),
});

export const {
  useCreateNeedMutation,
  useDeleteNeedMutation,
  useLazyGetNeedsByProjectQuery,
  useUpdateNeedMutation,
  useCreateNeedsMutation,
  useLazyGetNeedsByUserQuery} = needSlice;
