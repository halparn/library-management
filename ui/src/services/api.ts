import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, Book, UserDetail } from '../types';

interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

export const api = createApi({
  reducerPath: '',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  tagTypes: ['User', 'Book'],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, { 
      search?: string;
      page?: number; 
      limit?: number;
    }>({
      query: (params) => ({
        url: '/users',
        params
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 0,
    }),
    getUser: builder.query<UserDetail, number>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    getBooks: builder.query<PaginatedResponse<Book>, { 
      search?: string; 
      available?: boolean;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/books',
        params
      }),
      providesTags: ['Book'],
      keepUnusedDataFor: 0,
    }),
    getBook: builder.query<Book, number>({
      query: (id) => `/books/${id}`,
      providesTags: ['Book'],
    }),
    borrowBook: builder.mutation<void, { userId: number; bookId: number }>({
      query: ({ userId, bookId }) => ({
        url: `/users/${userId}/borrow/${bookId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Book'],
    }),
    returnBook: builder.mutation<void, { userId: number; bookId: number; score: number }>({
      query: ({ userId, bookId, score }) => ({
        url: `/users/${userId}/return/${bookId}`,
        method: 'POST',
        body: { score },
      }),
      invalidatesTags: ['User', 'Book'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetBooksQuery,
  useGetBookQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
} = api; 