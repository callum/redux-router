import test from 'tape'
import { NAVIGATE, REPLACE } from '../src/constants'
import History from '../src/History'

test('popstate listener', t => {
  t.plan(1)

  const { addEventListener } = window

  window.addEventListener = event => {
    window.addEventListener = addEventListener
    t.equal(event, 'popstate')
  }

  const history = new History()
  history.listen()
})

test('push or replace on navigate', t => {
  t.plan(2)

  const history = new History()
  history.getCurrentHref = () => '/'
  history.replaceHref = href => t.equal(href, '/foo')
  history.pushHref = href => t.equal(href, '/foo/bar')

  history.update({ type: REPLACE, href: '/foo' })
  history.update({ type: NAVIGATE, href: '/foo/bar' })
})

test('call pushState', t => {
  t.plan(3)

  const { pushState } = window.history

  function stub (state, title, href) {
    window.history.pushState = pushState
    t.equal(href, '/foo')
    t.equal(state, '/foo')
    t.equal(title, null)
  }

  window.history.pushState = stub

  const history = new History()
  history.pushHref('/foo')
})

test('call replaceState', t => {
  t.plan(3)

  const { replaceState } = window.history

  function stub (state, title, href) {
    window.history.replaceState = replaceState
    t.equal(href, '/foo')
    t.equal(state, '/foo')
    t.equal(title, null)
  }

  window.history.replaceState = stub

  const history = new History()
  history.replaceHref('/foo')
})

test('on popstate', t => {
  t.plan(1)

  const store = {
    dispatch (value) {
      t.ok(value)
    }
  }

  const history = new History(store)
  history.onPopHref('/foo')
})
