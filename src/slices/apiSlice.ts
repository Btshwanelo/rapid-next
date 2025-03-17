import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://172.172.166.174:5002/api/v2";


const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['facility-data', 'accommodation-applications','problem','idea','need','story'],
  endpoints: (builder) => ({}),
});
