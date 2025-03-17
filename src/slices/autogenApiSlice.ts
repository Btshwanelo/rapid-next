import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const DEV_BASE_URL = "http://localhost:5001";
const PROD_BASE_URL = 'http://172.172.166.174:5011/api';

export const autogentApiSlice = createApi({
  reducerPath: 'autogentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: PROD_BASE_URL,
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    ClarifyingQuestions: builder.mutation({
      query: (body) => ({
        url: `/askautogen/forclarifyingquestion`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    CreateImage: builder.mutation({
      query: (body) => ({
        url: `/utility/create_image`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    GenerateIdeas: builder.mutation({
      query: (body) => ({
        url: `/askautogen/forideas`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    GenerateIdeasAnalogy: builder.mutation({
      query: (body) => ({
        url: `/askautogen/ideatewithanalogy`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    GenerateIdeasBrainstorm: builder.mutation({
      query: (body) => ({
        url: `/askautogen/ideatewithbrainstorm`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    IdeaClarifier: builder.mutation({
      query: (body) => ({
        url: `/askautogen/ideacard_clarifier`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    IdeaTrends: builder.mutation({
      query: (body) => ({
        url: `/askautogen/ideacard_trends`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    IdeaStakeholder: builder.mutation({
      query: (body) => ({
        url: `/askautogen/ideacard_stakeholdereval`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    IdeaEvaluator: builder.mutation({
      query: (body) => ({
        url: `/askautogen/ideacard_evaluator`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    IdeaPrioritize: builder.mutation({
      query: (body) => ({
        url: `/askautogen/toprioritize`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    GenerateNeeds: builder.mutation({
      query: (body) => ({
        url: `/askautogen/forneeds`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    ExperienceMap: builder.mutation({
      query: (body) => ({
        url: `/askautogen/forexperienceroadmap`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    StoryboardScenes: builder.mutation({
      query: (body) => ({
        url: `/askautogen/tostoryboard`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    EmpathyMapAsIs: builder.mutation({
      query: (body) => ({
        url: `/askautogen/forempathymapasis`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
    EmpathyMapToBe: builder.mutation({
      query: (body) => ({
        url: `/askautogen/forempathymaptobe`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [],
    }),
  }),
});

export const {
  useClarifyingQuestionsMutation,
  useCreateImageMutation,
  useGenerateIdeasAnalogyMutation,
  useGenerateIdeasBrainstormMutation,
  useGenerateIdeasMutation,
  useIdeaClarifierMutation,
  useIdeaStakeholderMutation,
  useIdeaTrendsMutation,
  useIdeaEvaluatorMutation,
  useIdeaPrioritizeMutation,
  useGenerateNeedsMutation,
  useExperienceMapMutation,
  useStoryboardScenesMutation,
  useEmpathyMapAsIsMutation
} = autogentApiSlice;
