import { isPlainObject } from "./util"

export function transformRequest(data: any) {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }

  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // 可能存在 字符串 不符合 JSON 格式 这里我们什么都不做
    }
  }

  return data
}