import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types"
import { parseHeaders } from "./helpers/headers"

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve) => {
    const { 
      url,
      method = 'get',
      data = null,
      headers,
      responseType
    } = config
  
    const request = new XMLHttpRequest()

    if (responseType) request.responseType = responseType

    request.onreadystatechange = function () {
      if (request.readyState !== 4) return

      const responseHeaders = request.getAllResponseHeaders()
      const responseData = responseType === 'text' ? request.responseText : request.response

      // 装箱返回的响应体结果
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: parseHeaders(responseHeaders),
        config,
        request
      }

      resolve(response)
    }
  
    request.open(method.toLocaleUpperCase(), url, true)
    Object.keys(headers).forEach(name => {
      console.log(data, name, headers[name])
      // 但我们传入的数据为空的时候，设置请求头是没有意义的，于是我们把它删除
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
  
    request.send(data)
  })
}