import Axios from './core/Axios'
import { AxiosStatic, AxiosRequestConfig } from './types/index'
import { extend } from './helpers/util'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
import Cancel, { isCancel } from './cancel/Cancel'
import CancelToken from './cancel/CancelToken'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)

  // 因为 request 内部使用到了 this 我们需要手动绑定执行上下文
  const request = Axios.prototype.request.bind(context)
  
  // 将 axios 实例上的 属性放到 request 上面
  extend(request, context) 
 
  return request as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = (config) => {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken

axios.Cancel = Cancel

axios.isCancel = isCancel

/** TODO */
axios.all = function all(promises) {
  return Promise.all(promises)
}

/** TODO */
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

/** TODO */
axios.Axios = Axios

export default axios