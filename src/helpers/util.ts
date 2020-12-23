const toString = Object.prototype.toString

const enum OriginType {
  date = '[object Date]',
  object = '[object Object]'
}

// export function isDate(val: any): boolean {
export function isDate(val: any): val is Date { // 使用类型谓词
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val: any): val is FormData  {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function isAbsoluteURL(url: string): boolean {
  // ^([a-z][a-z\d\+\-\.]*:) ((以字母开头) , a - z 或者数字 + 号 或者 - 号 或者 .)0 个或者多个 再 拼接 ://  忽略大小写 
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}


/** 将 baseUrl 和 相对 url 做拼接 */
export function combineURL(baseURL: string, relativeURL: string): string {
  // 将 base url 末尾的 / 删除， relativeUrl 前面的 / 删除， 再 以  / 拼接
  const matchEnd = new RegExp('\/+$')
  const matchStart = new RegExp('^\/+')
  return relativeURL ? (baseURL.replace(matchEnd, '') + '/' + relativeURL.replace(matchStart, '')) : baseURL 
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  
  return to as T & U
}


export function deepMerge(...objs: any []): any {
  let result = Object.create(null)

  objs.forEach(obj => {
    if (!isPlainObject(obj)) return
    
    Object.keys(obj).forEach(key => {
      const val = obj[key]

      if (isPlainObject(val)) {
        if (typeof result[key] === 'undefined') result[key] = {}

        result[key] = deepMerge(result[key], val)
      } else {
        result[key] = val
      }
    })
  })

  return result
}


