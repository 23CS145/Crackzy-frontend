import { apiSlice } from './apiSlice';

export const gamesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query({
      query: ({ category, type } = {}) => {
        const params = {};
        if (category) params.category = category;
        if (type) params.type = type;
        return {
          url: '/games',
          params
        };
      },
      providesTags: ['Games'],
    }),
    getGameById: builder.query({
      query: (id) => `/games/${id}`,
      providesTags: (result, error, id) => [{ type: 'Games', id }],
    }),
    submitGameResults: builder.mutation({
      query: (data) => ({
        url: '/games/results',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GameResults'],
    }),
    getGameResults: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/games/results',
        params: { page, limit },
      }),
      providesTags: ['GameResults'],
    }),
  }),
});

export const { 
  useGetGamesQuery, 
  useGetGameByIdQuery,
  useSubmitGameResultsMutation,
  useGetGameResultsQuery 
} = gamesApiSlice;