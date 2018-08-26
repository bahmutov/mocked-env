'use strict'

/* eslint-env mocha */
const mockedEnv = require('.')
const la = require('lazy-ass')

describe('PWD', () => {
  let restoreEnv

  beforeEach(() => {
    restoreEnv = mockedEnv({
      PWD: '/foo/bar'
    })
  })

  it('has changed', () => {
    la(
      process.env.PWD === '/foo/bar',
      'did not change process.env.PWD:',
      process.env.PWD
    )
  })

  afterEach(() => restoreEnv())
})
