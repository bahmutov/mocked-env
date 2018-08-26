'use strict'

const debug = require('debug')('mocked-env')
const R = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')

const mockEnv = changeVariables => {
  debug('will be mocking env variables')
  debug(changeVariables)
  la(
    is.object(changeVariables),
    'expected first argument to be an object of env variables',
    changeVariables
  )

  const changedVariableNames = R.keys(changeVariables)
  const savedValues = R.pick(changedVariableNames, process.env)

  // change variables
  R.forEach(name => {
    process.env[name] = changeVariables[name]
  }, changedVariableNames)

  function restoreProcessEnv () {
    debug('restoring env variables', changedVariableNames)
    R.forEach(savedVariableName => {
      process.env[savedVariableName] = savedValues[savedVariableName]
    }, R.keys(savedValues))
  }

  return restoreProcessEnv
}

module.exports = mockEnv
