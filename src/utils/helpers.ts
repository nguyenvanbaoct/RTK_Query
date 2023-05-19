// type Predicate dùng để thu hẹp kiểu của một biến
// Đầu tiên chúng ta sẽ khai báo một function check kiểm tra cấu trúc về mặt logic JS
// Tiếp theo chúng ta thêm `parameterName is Type` làm kiểu return của function thay vì boolean
// Khi dùng function kiểu tra kiểu này, ngoài việc kiểm tra về mặt logic cấu trúc, nó còn chuyển kiểu
// so sánh với phương pháp ép kiểu 'Type Asertions" thì ép kiểu chúng giúp chúng ta đúng về mặt type, chưa chắc về logic

import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface ErrorFormObject {
  [key: string | number]: string | ErrorFormObject | ErrorFormObject[]
}

interface EntityError {
  status: 422
  data: {
    error: ErrorFormObject
  }
}

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string'
}

interface EntityError {}

export function isEntityError(error: unknown): error is EntityError {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    typeof error.data === 'object' &&
    error.data !== null &&
    !(error.data instanceof Array)
  )
}
