'use strict'

/* eslint-env mocha */
const mockedEnv = require('.')
const la = require('lazy-ass')
const is = require('check-more-types')
const R = require('ramda')

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

  context('deleting variable', () => {
    it('has npm_package_description', () => {
      la(
        is.unemptyString(process.env.npm_package_description),
        'expected description text in package.json',
        process.env.npm_package_description
      )
    })

    describe('actually deleting', () => {
      let restore

      beforeEach(() => {
        // deletes env variable by setting its value to undefined
        restore = mockedEnv({
          npm_package_description: undefined
        })
      })

      it('has deleted npm_package_description', () => {
        la(
          !('npm_package_description' in process.env),
          'npm_package_description still in process.env',
          process.env.npm_package_description
        )
      })

      afterEach(() => {
        restore()
      })
    })

    after(() => {
      // still should have npm_package_description
      la(
        is.unemptyString(process.env.npm_package_description),
        'expected npm_package_description after restoring it',
        process.env.npm_package_description
      )
    })
  })

  describe('only string values', () => {
    it('throws if value is a number', () => {
      la(
        is.raises(
          () => {
            mockedEnv({
              FOO: 42
            })
          },
          e => {
            return e.message.includes('should always be strings')
          }
        )
      )
    })

    it('throws if value is a boolean', () => {
      la(
        is.raises(
          () => {
            mockedEnv({
              FOO: true
            })
          },
          e => {
            return e.message.includes('should always be strings')
          }
        )
      )
    })
  })

  describe('clearing process.env', () => {
    let restore

    beforeEach(() => {
      restore = mockedEnv(
        {
          FOO: 'foo',
          BAR: 'bar'
        },
        { clear: true }
      )
    })

    it('has only FOO and BAR', () => {
      const expected = {
        FOO: 'foo',
        BAR: 'bar'
      }
      la(
        R.equals(process.env)(expected),
        'expected process.env to be',
        expected,
        'but it was',
        process.env
      )
    })

    afterEach(() => {
      restore()
    })
  })

  describe('restoring process.env', () => {
    let restore
    let defaultEnv

    beforeEach(() => {
      defaultEnv = R.clone(process.env)
      process.env.BANG = 'bash'
      restore = mockedEnv(
        {
          FOO: 'foo',
          BAR: 'bar'
        },
        { restore: true }
      )
    })

    it('has default env, BANG, FOO and BAR', () => {
      const expected = R.merge(defaultEnv, {
        FOO: 'foo',
        BAR: 'bar',
        BANG: 'bash'
      })
      la(
        R.equals(process.env)(expected),
        'expected process.env to be',
        expected,
        'but it was',
        process.env
      )
    })

    afterEach(() => {
      restore()
    })
  })

  describe('options as first argument', () => {
    it("pass 'restore' in options", () => {
      process.env.FOO = 'bar'
      const restore = mockedEnv({ restore: true })
      la(
        R.equals(process.env.FOO)('bar'),
        'expected environment to be maintained'
      )
      process.env.FOO = 'bash'
      restore()
      la(
        R.equals(process.env.FOO)('bar'),
        'expected environment to be restored'
      )
    })
    it("pass 'clear' in options", () => {
      process.env.FOO = 'bar'
      const restore = mockedEnv({ clear: true })
      la(process.env.FOO === undefined, 'expected environment to be clear')
      process.env.FOO = 'bash'
      restore()
      la(
        R.equals(process.env.FOO)('bar'),
        'expected environment to be restored'
      )
    })
  })
})
