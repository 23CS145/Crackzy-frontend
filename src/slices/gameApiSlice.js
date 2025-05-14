import { apiSlice } from './apiSlice';

export const gameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizQuestions: builder.query({
      query: () => '/game/quiz',
      providesTags: ['Quiz'],
    }),
    submitQuizAnswers: builder.mutation({
      query: (data) => ({
        url: '/game/quiz',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuizResult'],
    }),
    getQuizResults: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/game/results',
        params: { page, limit },
      }),
      providesTags: ['QuizResult'],
      transformResponse: (response) => ({
        results: response.data,
        pagination: {
          page: response.page,
          pages: response.pages,
          total: response.total,
        },
      }),
    }),
  }),
});

export const { 
  useGetQuizQuestionsQuery, 
  useSubmitQuizAnswersMutation,
  useGetQuizResultsQuery
} = gameApiSlice;