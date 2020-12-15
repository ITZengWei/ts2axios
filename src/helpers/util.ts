const toString = Object.prototype.toLocaleString

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
