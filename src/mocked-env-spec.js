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

    before(() => {
      la(
        !('FOOBAR' in process.env),
        'found FOOBAR at the start in process.env, should not be there',
        process.env.FOOBAR
      )
    })

    describe('changing', () => {
      let restoreEnv

      beforeEach(() => {
        restoreEnv = mockedEnv({
          npm_package_description: fakeValue,
          FOOBAR: 'fake-foobar'
        })
      })

      it('has changed', () => {
        la(
          process.env.npm_package_description === fakeValue,
          'did not change npm_package_description:',
          process.env.npm_package_description
        )
      })

      it('has added FOOBAR', () => {
        la(
          process.env.FOOBAR === 'fake-foobar',
          'did not add FOOBAR:',
          process.env.FOOBAR
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

    it('did not add FOOBAR', () => {
      la(
        !('FOOBAR' in process.env),
        'added FOOBAR into process.env',
        process.env.FOOBAR
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
