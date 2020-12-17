import Axios from './core/Axios'
import { AxiosInstance } from './types/index'
import { extend } from './helpers/util'

function createInstance(): AxiosInstance {
  const context = new Axios()

  // 因为 request 内部使用到了 this 我们需要手动绑定执行上下文
  const request = Axios.prototype.request.bind(context)
  
  // 将 axios 实例上的 属性放到 request 上面
  extend(request, context) 
 
  return request as AxiosInstance
}

const axios = createInstance()


export default axios