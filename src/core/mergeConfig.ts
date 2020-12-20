import { isPlainObject, deepMerge } from '../helpers/util'
import { AxiosRequestConfig } from './../types'

/** 合并策略集合 */
const strategies = Object.create(null) 

/** 默认合并策略 优先拿第二个 */
function defaultStrategy(val1: any, val2: any) {
  return val2 === undefined ? val1 : val2
}

/** 只接受自定义配置合并策略 */
function fromUseConfigStrategy(val1: any, val2: any) {
  if (val2 !== undefined) return val2
}

/** 根据自定义配置合并的字段 */
const fromUseConfigFields = ['url', 'params', 'data']

fromUseConfigFields.forEach(field => {
  strategies[field] = fromUseConfigStrategy
})

/** 复杂对象合并策略 */
function complexStrategy(val1: any, val2: any) {
  // 如果传过来的是对象，就将 默认值 和 传的值 深拷贝传过去
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)    
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)    
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

/** 复杂对象合并的字段 */
const complexConfigFields = ['headers']

complexConfigFields.forEach(field => {
  strategies[field] = complexStrategy
})


/** 默认 config 与 用户 传过来的 config 进行合并 */
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  // 最终返回的 config  
  let config: AxiosRequestConfig = Object.create(null)

  // 为 config2 设置初始值
  if (!config2) config2 = {} 

  // 遍历 config1(默认 config) 中的元素，合并到结果中
  for (let key in config1) {
    config[key] = mergeField(key)
  }

  // 遍历 config2，因为 上面的遍历 已经涉及到了 config2 的部分key，我们只要找到 config2 中 没有 config1 中的 key 进行合并
  for (let key in config2) {
    if (!(key in config1)) {
      config[key] = mergeField(key)
    }  
  }

  // 合并字段
  function mergeField(key: string) {
    const strategy = strategies[key] || defaultStrategy
    return strategy(config1[key], config2![key])
  }

  return config
}