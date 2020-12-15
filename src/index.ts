import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
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
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)

}

/** 格式化 url 请求路径 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config

  return buildURL(url, params)
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
  res.data = transformResponse(res.data)

  return res
}

export default axios