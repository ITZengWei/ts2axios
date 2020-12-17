export type Method = 'get' | 'GET'
  | 'post' | 'POST'
  | 'delete' | 'DELETE'
  | 'put' | 'PUT'
  | 'options' | 'OPTIONS'
  | 'patch' | 'PATCH'
  | 'head' | 'HEAD'

export interface AxiosRequestConfig {
  /** 请求地址 */
  url?: string
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
  /** 超时时间 ms */
  timeout?: number
}

export interface AxiosResponse<T = any> {
  /** 响应数据 */
  data: T
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

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

export interface AxiosError extends Error {
  /** 请求配置 */
  config: AxiosRequestConfig
  /** 状态码 */
  code?: string | null 
  /** 请求实例 */
  request?: any
  /** 响应内容 */
  response?: AxiosResponse
  /** 是否错误 */
  isAxiosError?: boolean
}


export interface Axios {
  /** 默认配置参数 */
  defaults: AxiosRequestConfig

  /** 请求和相应拦截器 */
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>,
    response: AxiosInterceptorManager<AxiosResponse>
  }

  /** 核心请求方法  */
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  /** GET 请求方法 */
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  
  /** DELETE 请求方法 */
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  
  /** HEAD 请求方法 */
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  
  /** OPTIONS 请求方法 */
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  
  /** POST 请求方法 */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  /** PUT 请求方法 */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  /** PATCH 请求方法 */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 混合类型
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  // 函数重载
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
} 


// 拦截器管理对象, 通过泛型，可以是 请求拦截器，和响应拦截器
export interface AxiosInterceptorManager<T = any> {
  /** 挂载拦截器 */
  use(resolved: resolveFn<T>, rejected?: rejectFn): number

  /** 根据ID逐出拦截器 */
  eject(id: number): void
}

export interface resolveFn<T> {
  (val: T): T | Promise<T>
}

export interface rejectFn {
  (val: any): any
}