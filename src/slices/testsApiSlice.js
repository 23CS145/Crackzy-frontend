import { apiSlice } from './apiSlice';

export const testsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query({
      query: () => '/tests',
      providesTags: ['Tests'],
    }),
    getTestById: builder.query({
      query: (id) => `/tests/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tests', id }],
    }),
    createTest: builder.mutation({
      query: (data) => ({
        url: '/tests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tests'],
    }),
    updateTest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tests/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tests', id }],
    }),
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `/tests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tests'],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
} = testsApiSlice;