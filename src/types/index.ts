export type Method = 'get' | 'GET'
  | 'post' | 'POST'
  | 'delete' | 'DELETE'
  | 'put' | 'PUT'
  | 'options' | 'OPTIONS'
  | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  /** 请求地址 */
  url: string
  /** 请求方法 */
  method?: Method
  /**  POST请求携带数据 */
  data?: any
  /** GET请求携带数据 */
  params?: any
  /** 请求头 */
  headers?: any
  /** 请求响应体数据类型 */
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosResponse {
  /** 响应数据 */
  data: any
  /** http状态码 */
  status: number
  /** http状态消息 */
  statusText: string
  /** 响应头 */
  headers: any
  /** 请求配置对象  */
  config: AxiosRequestConfig
  /** XMLHttpRequest 实例类型 */
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {

}