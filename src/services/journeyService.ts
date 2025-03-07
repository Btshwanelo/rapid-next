import { apiSlice } from '../slices/apiSlice';

export const journeySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    InitilizeJourney: builder.mutation({
      query: (body) => ({
        url: `/journeys-as-is/initialize`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    UpdateJourneyAsIs: builder.mutation({
      query: ({body,id}) => ({
        url: `/journeys-as-is/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetJourneyAsIsByProjectId: builder.query({
        query: ({authToken,id}) => ({
          url: `/journeys-as-is/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    GetJourneyAsIsByUserId: builder.query({
        query: ({authToken,id}) => ({
          url: `/journeys-as-is/user/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    UpdateJourneyToBe: builder.mutation({
      query: ({body,id}) => ({
        url: `/journeys-to-be/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetJourneyToBeByProjectId: builder.query({
        query: ({authToken,id}) => ({
          url: `/journeys-to-be/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    GetJourneyToBeByUserId: builder.query({
        query: ({authToken,id}) => ({
          url: `/journeys-to-be/user/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
}); 

export const {
  useInitilizeJourneyMutation,
  useUpdateJourneyAsIsMutation,
  useLazyGetJourneyAsIsByProjectIdQuery,
  useLazyGetJourneyAsIsByUserIdQuery,
  useLazyGetJourneyToBeByProjectIdQuery,
  useLazyGetJourneyToBeByUserIdQuery,
  useUpdateJourneyToBeMutation
} = journeySlice;
