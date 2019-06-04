'use strict'

const debug = require('debug')('mocked-env')
const R = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')

const mockEnv = (changeVariables, options = {}) => {
  debug('will be mocking env variables')
  debug(changeVariables)
  debug('options')
  debug(options)

  const defaults = {
    clear: false
  }
  options = R.merge(defaults, options)

  la(
    is.object(changeVariables),
    'expected first argument to be an object of env variables',
    changeVariables
  )

  const changedVariableNames = R.keys(changeVariables)

  // make sure each new value is a string or undefined
  // because process.env values are cast as strings when the program starts
  // and undefined values mean we need to delete them
  R.forEach(name => {
    const value = changeVariables[name]
    la(
      value === undefined || is.string(value),
      'process.env values should always be strings.',
      'found invalid property',
      name,
      'with value of type',
      typeof value
    )
  }, changedVariableNames)

  // start modifying process.env
  let backupEnv
  if (options.clear) {
    backupEnv = R.clone(process.env)
    process.env = {}
  }

  // make sure we even keep undefined values
  const savedValues = R.pickAll(changedVariableNames, process.env)

  // change variables
  R.forEach(name => {
    const value = changeVariables[name]
    if (value === undefined) {
      debug('deleting variable', name)
      delete process.env[name]
    } else {
      process.env[name] = changeVariables[name]
    }
  }, changedVariableNames)

  const restoreSome = () => {
    debug('restoring env variables', changedVariableNames)
    R.forEach(savedVariableName => {
      const value = savedValues[savedVariableName]
      if (value === undefined) {
        debug('deleting %s', savedVariableName)
        delete process.env[savedVariableName]
      } else {
        debug('restoring %s to value %j', savedVariableName, value)
        process.env[savedVariableName] = value
      }
    }, R.keys(savedValues))
  }

  const restoreBackupEnv = () => {
    debug('restoring entire process.env')
    // is overwriting the object the best approach here?
    process.env = backupEnv
  }

  return options.clear || options.restore ? restoreBackupEnv : restoreSome
}

module.exports = mockEnv
