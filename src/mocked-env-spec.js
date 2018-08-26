'use strict'

/* eslint-env mocha */
const mockedEnv = require('.')

describe('mocked-env', () => {
  it('write this test', () => {
    console.assert(mockedEnv, 'should export something')
  })
})
