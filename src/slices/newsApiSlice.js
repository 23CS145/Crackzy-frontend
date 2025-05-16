import { apiSlice } from './apiSlice';

export const newsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ category } = {}) => {
        const params = {};
        if (category) {
          params.category = category;
        }
        return {
          url: '/news',
          params
        };
      },
      providesTags: ['News'],
    }),
    getNewsById: builder.query({
      query: (id) => `/news/${id}`,
      providesTags: (result, error, id) => [{ type: 'News', id }],
    }),
    getNewsCategories: builder.query({
      query: () => '/news/categories',
      providesTags: ['NewsCategories'],
    }),
    createNews: builder.mutation({
      query: (data) => ({
        url: '/news',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/news/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'News', id }],
    }),
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useGetNewsCategoriesQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApiSlice;