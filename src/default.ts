import { AxiosRequestConfig } from './types/index'

const defaults: AxiosRequestConfig = {
  method: 'GET',
  
  timeout: 0,

  headers: {
    // 对所有请求都有 里面的属性
    common: {
      // 描述客户端希望接收的 响应body 数据类型
      Accept: 'application/json, text/plain, */*'
    }
  }
} 

// 不带有 request data 的请求
const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

// 带有 request data 的请求
const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    // 参考文档 https://blog.csdn.net/baichoufei90/article/details/84030479
    // 常见的 格式有 application/json application/x-www-form-urlencoded application/json text/plain
    "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
  }
})


export default defaults