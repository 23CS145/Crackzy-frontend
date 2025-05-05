import { apiSlice } from './apiSlice';

export const gameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizQuestions: builder.query({
      query: () => '/game/quiz',
    }),
    submitQuizAnswers: builder.mutation({
      query: (data) => ({
        url: '/game/quiz',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetQuizQuestionsQuery, useSubmitQuizAnswersMutation } =
  gameApiSlice;