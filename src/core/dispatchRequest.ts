import { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'
import { deepMerge } from '../helpers/util'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  
  processConfig(config)

  return xhr(config)
    .then(res => {
      return transformResponseData(res)
    })
}

/** 对 配置进行处理 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  /** 因为 处理 headers 设计到了 data 我们需要先处理headers */
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)

  /** 对 config 扁平化，拿到我们需要的字段 todo method! 这里为什么需要这样处理 */
  config.headers = flattenHeaders(config.headers, config.method!)
}

/** 格式化 url 请求路径 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config

  // 加上 ！ 就是非空 
  return buildURL(url!, params)
}

/** 格式化 请求数据 */
function transformRequestData(config: AxiosRequestConfig): string {
  return transformRequest(config.data)
}

/** 格式化 headers */
function transformHeaders(config: AxiosRequestConfig): string {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

/** 格式化响应数据 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse!)

  return res
}

/** 扁平化请求头 */
function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
} 

/** 如果再发送请求前已经取消，我们直接退出 */
function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}



