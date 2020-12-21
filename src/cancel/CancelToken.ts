import { Canceler, CancelExecutor, CancelTokenSource } from './../types/index'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    this.promise = new Promise<Cancel>(resolve => {
      // 存储 promise 函数 TODO 
      resolvePromise = resolve as any
    })

    executor(message => {
      if (this.reason) return

      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })

  }
  
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler

    const token = new CancelToken(c => {
      cancel = c
    }) 

    return {
      token,
      cancel
    }
  }
}