import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  // 如果不传 params 我们就使 url 原样返回 
  if (!params) return url

  // 对 params 遍历
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    // 对空值的忽略
    if (val === undefined || val === null) return

    let values = []

    // 判断是否为数组  foo = ['bar', 'baz'] 最终请求的 url 是 /base/get?foo[]=bar&foo[]=baz'。
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      // 统一成数组
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }

      // 对值进行 编码处理，不能直接调用 encodeURIComponent 是因为我们还需要对特殊字符进行替换处理
      parts.push(`${ key }=${ encode(val) }`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}