'use babel'

import Cache from './persistent-cache'

function setIfDoesNotExist (cache, key, value) {
  const cached = cache.get(key)
  if (!cached) {
    cache.set(key, value)
  }
}

export default function cacheFunction (func, cache) {
  if (Array.isArray(cache)) {
    cache = new Cache(cache)
  } else if (!cache) {
    cache = new Cache()
  }
  const cachedFunction = (...args) => {
    const key = args[0]
    const cached = cache.get(key)
    var prom
    if (cached == null) {
      prom = func(...args)
    } else {
      prom = Promise.resolve(cached)
    }
    prom.then(value => {
      setIfDoesNotExist(cache, key, value)
    })
    return prom
  }
  cachedFunction.clearCache = () => {
    cache = null
    cache = new Cache()
  }
  cachedFunction.serialize = () => {
    return cache.serialize()
  }
  return cachedFunction
}
