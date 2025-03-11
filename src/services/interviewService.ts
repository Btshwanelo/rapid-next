import { apiSlice } from '../slices/apiSlice';

export const interviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateInterviewSegment: builder.mutation({
      query: ({body,authToken}) => ({
        url: `/interview-segments`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`,
          },
        body,
      }),
      invalidatesTags: [],
    }),
    UpdateInterviewSegment: builder.mutation({
      query: ({body,authToken,id}) => ({
        url: `/interview-segments/${id}`,
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${authToken}`,
          },
        body,
      }),
      invalidatesTags: [],
    }),
    GetInterviewSegmentsByProject: builder.query({
        query: ({id,authToken}) => ({
          url: `/interview-segments/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
});

export const {
  useCreateInterviewSegmentMutation,
  useLazyGetInterviewSegmentsByProjectQuery,
  useUpdateInterviewSegmentMutation} = interviewSlice;
