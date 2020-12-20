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

export function isPlainObject(val: any) {
  return toString.call(val) === '[object Object]'
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
