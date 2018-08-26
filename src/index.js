'use strict'

const debug = require('debug')('mocked-env')
const R = require('ramda')

const mockEnv = changeVariables => {
  debug('will be mocking env variables')
  debug(changeVariables)

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
