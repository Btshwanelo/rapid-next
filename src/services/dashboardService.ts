import { apiSlice } from '../slices/apiSlice';

export const dashboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetDashboard: builder.query({
        query: (authToken) => ({
          url: `/dashboard`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      }),
  }),
});

export const {
  useGetDashboardQuery
} = dashboardSlice;
