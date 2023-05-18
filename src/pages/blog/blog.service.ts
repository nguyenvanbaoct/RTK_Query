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
    getPost: build.query<Post[], void>({
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
    })
  })
})

export const { useGetPostQuery, useAddPostMutation } = blogApi
