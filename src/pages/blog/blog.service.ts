import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'pages/types/blog.type'

export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong Redux state
  tagTypes: ['Posts'], // Những kiểu tag cho phép dùng trong blogApi
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3002/'
  }),
  endpoints: (build) => ({
    // Generic type theo thứ tự là kiểu response trả về và argument
    getPosts: build.query<Post[], void>({
      query: () => 'posts', // method không có argument
      /**
       * providesTags có thể là array hoặc callback return array
       * Nếu có bất kỳ một invalidatesTag nào match với providersTags này
       * Thì sẽ làm cho getPosts method chạy lại
       * Và cập nhật lại danh sách các bài post cũng như các tags phía dưới
       */
      providesTags(result) {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        const final = [{ type: 'Posts' as const, id: 'LIST' }]
        return final
      }
    }),
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          body
        }
      },
      invalidatesTags: (result, err, body) => [{ type: 'Posts', id: 'LIST' }]
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      invalidatesTags: (result, err, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: build.mutation<{}, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, err, id) => [{ type: 'Posts', id }]
    })
  })
})

export const { useGetPostQuery, useAddPostMutation, useGetPostsQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
