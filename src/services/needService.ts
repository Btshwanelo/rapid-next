import { apiSlice } from '../slices/apiSlice';

export const needSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateNeed: builder.mutation({
      query: (body) => ({
        url: `/needs`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetNeedsByProject: builder.query({
        query: ({id,authToken}) => ({
          url: `/needs/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    GetNeedsByUser: builder.query({
        query: ({id,authToken}) => ({
          url: `/needs/user/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
});

export const {
  useCreateNeedMutation,
  useLazyGetNeedsByProjectQuery,
  useLazyGetNeedsByUserQuery} = needSlice;
