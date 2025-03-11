import { apiSlice } from '../slices/apiSlice';

export const personaSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreatePersona: builder.mutation({
      query: (body) => ({
        url: `/persona`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [],
    }),
    GetPersonasByProject: builder.query({
        query: ({id,authToken}) => ({
          url: `/persona/project/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    GetPersonasListByProject: builder.query({
        query: ({id,authToken}) => ({
          url: `/persona/project/${id}/list`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    GetPersonaById: builder.query({
        query: ({id,authToken}) => ({
          url: `/persona/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
    UpdatePersona: builder.mutation({
        query: ({id,authToken}) => ({
          url: `/persona/user/${id}`,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
});

export const {
  useCreatePersonaMutation,
  useLazyGetPersonaByIdQuery,useLazyGetPersonasListByProjectQuery,
  useLazyGetPersonasByProjectQuery,
  useUpdatePersonaMutation} = personaSlice;
