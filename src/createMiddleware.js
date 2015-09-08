import querystring from 'querystring'
import url from 'url'

export default function createMiddleware (router) {
  return store => {
    const History = router.history
    const history = new History(store)

    return next => action => {
      if (!/^@@redux-routing/.test(action.type)) {
        return next(action)
      }

      let { location } = action

      if (typeof location === 'string') {
        location = url.parse(action.location)
      }

      let query

      if (location.search) {
        query = querystring.parse(location.search.slice(1))
      }

      location = {
        hash: location.hash || undefined,
        pathname: location.pathname,
        search: location.search || undefined
      }

      const result = next({
        ...action,
        url: url.format(location),
        location,
        query
      })

      history.notify(result)
      router.notify(result)

      return result
    }
  }
}
