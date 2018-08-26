'use strict'

/* eslint-env mocha */
const mockedEnv = require('.')
const la = require('lazy-ass')
const is = require('check-more-types')

// console.log(process.env)

describe('mocked-env', () => {
  it('npm_package_description environment value', () => {
    la(
      is.unemptyString(process.env.npm_package_description),
      'expected description text in package.json',
      process.env.npm_package_description
    )
  })

  it('FOOBAR environment value', () => {
    la(
      process.env.FOOBAR === undefined,
      'expected FOOBAR to not be set',
      process.env.FOOBAR
    )
  })

  context('changing variable npm_package_description that exists', () => {
    const fakeValue = 'fake-description'

    describe('changing', () => {
      let restoreEnv

      beforeEach(() => {
        restoreEnv = mockedEnv({
          npm_package_description: fakeValue
        })
      })

      it('has changed', () => {
        la(
          process.env.npm_package_description === fakeValue,
          'did not change npm_package_description:',
          process.env.npm_package_description
        )
      })

      afterEach(() => {
        restoreEnv()
      })
    })

    it('restored mocked variable', () => {
      la(
        process.env.npm_package_description !== fakeValue,
        'did not restore npm_package_description:',
        process.env.npm_package_description
      )
    })
  })

  // context.skip('faking undefined environment variable', () => {
  //   let sandbox = sinon.createSandbox()

  //   beforeEach(() => {
  //     // cannot stub or fake non-existent property
  //     sandbox.fake(process.env, 'FOOBAR').returns('foo-fake')
  //   })

  //   it('has been set', () => {
  //     console.log('process.env.FOOBAR =', process.env.FOOBAR)
  //     // snapshot({ FOOBAR: process.env.FOOBAR })
  //   })

  //   afterEach(() => {
  //     sandbox.restore()
  //   })
  // })
})
