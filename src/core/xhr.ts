import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types"
import { parseHeaders } from "../helpers/headers"
import { createError } from "../helpers/error"
import cookie from '../helpers/cookie'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from "../helpers/util"

/**
 * 1. 创建 request 实例
 * 2. 执行 request 方法
 * 3. 根据配置，去配置 request 对象
 * 4. 监听事件
 * 5. 处理 headers
 * 6.根据 cancelToken 做一些逻辑
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { 
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsfrCookieName,
      xsfrHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
  
    const request = new XMLHttpRequest()

    request.open(method.toLocaleUpperCase(), url!, true)

    // 根据配置，去配置 request 对象
    configureRequest()

    // 监听事件
    addEvents()
    
    // 处理 headers
    processHeaders()

    // 处理 取消
    processCancelToken()

    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
  
      if (timeout) {
        request.timeout = timeout
      }
      
      // 如果设置了跨域需要传cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {

      // 当网络出现异常，会触发 error 事件
      request.onerror = function () {
        // reject(new Error('Network Error'))
        reject(createError('Network Error', config))
      }

      request.ontimeout = function () {
        reject(createError(`Timeout of ${ timeout } ms exceeded`, config, 'ECONNABORTED', request))
      }

      request.onreadystatechange = function () {
        if (request.readyState !== 4) return

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType === 'text' ? request.responseText : request.response

        // 装箱返回的响应体结果
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }

        handleResponse(response)
      }

      // 监听上传/下载的进度
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      /** 由于上传会存在 FormData 的类型，我们应该主动删除 headers: ContentType 字段，让浏览器自动识别 */
      if (isFormData(data)) {
          delete headers['Content-Type']
      } 

      // 在跨域传 cookie 或者 同源前提下，从 cookie 中拿到对应值传给 header
      if ((withCredentials || isURLSameOrigin(url!)) && xsfrCookieName) {
        const xsfrCookieValue = cookie.read(xsfrCookieName)
        console.log(xsfrCookieName,xsfrHeaderName, xsfrCookieValue)
        if (xsfrHeaderName && xsfrCookieValue) {
          headers[xsfrHeaderName] = xsfrCookieValue 
        }
      }

      // 如果设置了 auth ，我们就往 headers 添加 authorization 值为 (auth.username:auth:password) base64 的结果 
      if (auth) {
        headers['authorization'] = 'Basic ' + btoa(`${ auth.username }:${ auth.password }`)
      }

      Object.keys(headers).forEach(name => {
        // 但我们传入的数据为空的时候，设置请求头是没有意义的，于是我们把它删除
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    
    function processCancelToken(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
      } 
    }

    function handleResponse(response: AxiosResponse) {
      // 如果没有这个规则我们认为所有都是合法的，否则执行里面的函数
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      // 取消  
      } else if (response.status === 0) {
        return
      } else {

        // reject(new Error(`Request failed with status code ${ response.status }`))
        reject(createError(`Request failed with status code ${ response.status }`, config, null, request, response))
      }
    }

  })
}