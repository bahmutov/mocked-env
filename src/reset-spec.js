'use strict'

/* eslint-env mocha */
const mockedEnv = require('.')
const la = require('lazy-ass')
const R = require('ramda')

// resets process.env even if the user has added some properties there
describe('reset example', () => {
  let restore

  const wasEmpty = () => {
    la(
      R.equals(process.env, {}),
      'expected process.env = {}, but was',
      process.env
    )
  }

  const doesNotHaveCustomProperty = () => {
    la(
      !('FOOBAR_SHOULD_NOT_EXIST' in process.env),
      'process.env has FOOBAR_SHOULD_NOT_EXIST',
      process.env
    )
  }

  before(() => {
    // make sure we do not have this property accidentally when we start testing
    doesNotHaveCustomProperty()
    restore = mockedEnv({}, { clear: true })
  })

  it('clears process.env', () => {
    wasEmpty()
  })

  it('adds user property now', () => {
    process.env.FOOBAR_SHOULD_NOT_EXIST = 'foo'
  })

  it('has user property now', () => {
    const expected = { FOOBAR_SHOULD_NOT_EXIST: 'foo' }
    la(
      R.equals(process.env, expected),
      'expected process.env to be',
      expected,
      'but it was',
      process.env
    )
  })

  after(() => {
    restore()
    doesNotHaveCustomProperty()
  })
})
