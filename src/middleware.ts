import { AnyAction, Middleware, MiddlewareAPI, isRejected, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helpers'

function isPayLoadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    (typeof payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  /**
   * `isRejectedWithValue()` là một func giúp chúng ta kiểm tra các action có rejectedWithValue = tru từ createAsyncThunk
   * RTK Query sử dụng AsyncThunk bên trong nên chúng ta có thể dùng isRejectedWithValue() để kiểm tra lỗi
   */

  if (isRejected(action)) {
    console.log(action)
  }
  if (isRejectedWithValue(action)) {
    if (isPayLoadErrorMessage(action.payload)) {
      // lỗi reject từ server chỉ có message thôi
      toast.warn(action.payload.data.error)
    }
  }
  console.log(action)
  return next(action)
}
