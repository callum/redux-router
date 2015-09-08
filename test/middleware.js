import 'babelify/polyfill'

import test from 'tape'
import createMiddleware from '../src/createMiddleware'

function noop () {
}

class History {
  constructor () {
  }

  notify () {
  }
}

class Router {
  constructor () {
    this.history = History
  }

  notify () {
  }
}

test('sets up history', t => {
  t.plan(1)

  const router = new Router()
  const middleware = createMiddleware(router)

  router.history = class {
    constructor () {
      t.pass()
    }
  }

  middleware()
})

test('ignore actions outside of redux-routing', t => {
  t.plan(1)

  function next (action) {
    t.equal(action, 'foo')
  }

  const middleware = createMiddleware(new Router())
  middleware()(next)('foo')
})

test('calling next and returning a value', t => {
  t.plan(5)

  function next (result) {
    t.pass()
    return result
  }

  const middleware = createMiddleware(new Router())

  const result = middleware()(next)({
    location: {
      hash: '#quux',
      pathname: '/foo',
      search: '?bar=baz'
    },
    type: '@@redux-routing/foo'
  })

  t.deepEqual(result.location, {
    hash: '#quux',
    pathname: '/foo',
    search: '?bar=baz'
  })
  t.equal(result.type, '@@redux-routing/foo')
  t.equal(result.url, '/foo?bar=baz#quux')
  t.deepEqual(result.query, { bar: 'baz' })
})

test('notifying history', t => {
  t.plan(1)

  const router = new Router()
  const middleware = createMiddleware(router)

  router.history = class {
    notify () {
      t.pass()
    }
  }

  middleware()(noop)({
    location: {
      pathname: '/foo'
    },
    type: '@@redux-routing/foo'
  })
})

test('calling notify', t => {
  t.plan(1)

  const router = new Router()
  const middleware = createMiddleware(router)

  router.notify = function notify () {
    t.pass()
  }

  middleware()(noop)({
    location: {
      pathname: '/foo',
    },
    type: '@@redux-routing/foo'
  })
})
