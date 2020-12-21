import { isPlainObject } from "./util"

function normalizeHeaderName(headers: any, normalizedName: string) {
  if (!headers) return 

  Object.keys(headers).forEach(name => {
    // 如果 传过来的 name 与我们格式化名字不相同，但是 转换为 统一大写之后相同，我们就设置为我们想要的个书画字段，并且删除原始的 字段名
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    // 设置默认的 Content-Type
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

/** 将 字符串的 请求头转换为对象形式 */
export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()

    if (!key) return 

    if (val) {
      val = val.trim()
    }

    parsed[key] = val
  })

  return parsed
}