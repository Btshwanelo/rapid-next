import { apiSlice } from '../slices/apiSlice';

export const empathySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateEmpathyAsIs: builder.mutation({
      query: (body) => ({
        url: `/empathy-as-is`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    InitializeEmpathy: builder.mutation({
      query: (body) => ({
        url: `/empathy-as-is/initialize`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    UpdateEmpathyAsIs: builder.mutation({
      query: ({body,id}) => ({
        url: `/empathy-as-is/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetEmpathyAsIsByPersona: builder.query({
        query: ({authToken,id}) => ({
          url: `/empathy-as-is/user/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
      CreateEmpathyToBe: builder.mutation({
        query: (body) => ({
          url: `/empathy-to-be`,
          method: 'POST',
          body,
        }),
        invalidatesTags: [],
      }),
      UpdateEmpathyToBe: builder.mutation({
        query: ({body,id}) => ({
          url: `/empathy-to-be/${id}`,
          method: 'POST',
          body,
        }),
        invalidatesTags: [],
      }),
      GetEmpathyToBeByPersona: builder.query({
          query: ({authToken,id}) => ({
            url: `/empathy-to-be/user/${id}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }),
        }),
  }),
});
export const {
  useCreateEmpathyAsIsMutation,
  useInitializeEmpathyMutation,
  useLazyGetEmpathyToBeByPersonaQuery,
  useUpdateEmpathyAsIsMutation,
  useLazyGetEmpathyAsIsByPersonaQuery,
  useCreateEmpathyToBeMutation,
  useUpdateEmpathyToBeMutation
} = empathySlice;
