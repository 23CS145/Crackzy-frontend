import { apiSlice } from './apiSlice';

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => '/notes',
      providesTags: ['Notes'],
    }),
    getNoteById: builder.query({
      query: (id) => `/notes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notes', id }],
    }),
    createNote: builder.mutation({
      query: (data) => ({
        url: '/notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notes'],
    }),
    updateNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Notes', id }],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notes'],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;