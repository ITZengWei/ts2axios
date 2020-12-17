import { resolveFn, rejectFn } from '../types'

interface Interceptor<T> {
  resolved: resolveFn<T>
  rejected?: rejectFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null> = []

  use(resolved: resolveFn<T>, rejected?: rejectFn): number {
    this.interceptors.push({ resolved, rejected })

    // 返回所添加的索引，供以后删除使用
    return this.interceptors.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(index: number): void {
    if (this.interceptors[index]) {
      // 这里并不能直接通过 splice 之类的去删除成员，因为在后续添加过程中，index 可能会混乱，而是需要用 null 去占位
      this.interceptors[index] = null
    }
  }
}