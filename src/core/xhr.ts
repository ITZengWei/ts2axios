import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types"
import { parseHeaders } from "../helpers/headers"
import { createError } from "../helpers/error"

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { 
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout
    } = config
  
    const request = new XMLHttpRequest()

    if (responseType) request.responseType = responseType

    if (timeout) request.timeout = timeout

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
  
    request.open(method.toLocaleUpperCase(), url!, true)

    Object.keys(headers).forEach(name => {
      // 但我们传入的数据为空的时候，设置请求头是没有意义的，于是我们把它删除
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
  
    request.send(data)


    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        // reject(new Error(`Request failed with status code ${ response.status }`))
        reject(createError(`Request failed with status code ${ response.status }`, config, null, request, response))
      }
    }

  })
}