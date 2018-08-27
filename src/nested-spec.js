'use strict'

/* eslint-env mocha */
const mockedEnv = require('.')
const la = require('lazy-ass')
const R = require('ramda')

// clears process.env in the outer suite
// then sets individual values in each inside suite
describe.only('process.env reset', () => {
  let restore

  const wasEmpty = () => {
    la(
      R.equals(process.env, {}),
      'expected process.env = {}, but was',
      process.env
    )
  }

  before(() => {
    restore = mockedEnv({}, { clear: true })
  })

  it('clears process.env', () => {
    wasEmpty()
  })

  context('inside A', () => {
    let restore

    const expected = {
      FOO: 'foo',
      BAR: 'bar'
    }

    beforeEach(() => {
      restore = mockedEnv(R.clone(expected))
    })

    it('set FOO and BAR', () => {
      la(
        R.equals(process.env)(expected),
        'expected process.env to be',
        expected,
        'but found',
        process.env
      )
    })

    afterEach(() => {
      restore()
    })
  })

  context('inside B', () => {
    let restore

    const expected = {
      BAR: 'baz'
    }

    beforeEach(() => {
      restore = mockedEnv(R.clone(expected))
    })

    it('set BAR', () => {
      la(
        R.equals(process.env)(expected),
        'expected process.env to be',
        expected,
        'but found',
        process.env
      )
    })

    afterEach(() => {
      restore()
    })
  })

  after(() => {
    wasEmpty()
    restore()
  })
})
