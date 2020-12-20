import { AxiosPromise, AxiosRequestConfig, Method, AxiosResponse, resolveFn, rejectFn } from './../types/index'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>,
  response: InterceptorManager<AxiosResponse>
}

/** Promise 链路 */
interface PromiseChain<T> {
  resolved: resolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise),
  rejected?: rejectFn
}


export default class Axios {

  defaults: AxiosRequestConfig
  
  interceptors: Interceptors
  
  // request(config: AxiosRequestConfig): AxiosPromise {
  //   return dispatchRequest(config)
  // }
  constructor(initConfig: AxiosRequestConfig) {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }

    this.defaults = initConfig
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }

    // 对 config 进行合并
    config = mergeConfig(this.defaults, config)


    // 拦截器链路,以及初始值
    const chain: Array<PromiseChain<any>> = [
      { resolved: dispatchRequest, rejected: undefined }
    ]

    // 往链路 前面 添加 请求拦截器
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor)
    })

    // 往链路 后面 添加 响应拦截器
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor)
    })

    // 初始 
    let promise = Promise.resolve(config) 

    // 执行链路
    while (chain.length) {
      // 使用 ! 设置非空
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
    // return dispatchRequest(config)
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('GET', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('DELETE', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('HEAD', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('OPTIONS', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('POST', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('PUT', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('PATCH', url, data, config)
  }

  /** 对没有 data 的参数进行组装 */
  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url
    }))
  }

  /** 对有 data 的参数进行组装 */
  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url,
      data
    }))
  }
}

