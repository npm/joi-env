'use strict'

const lab = (exports.lab = require('@hapi/lab').script())
const { expect } = require('@hapi/code')
const { beforeEach, describe, it } = lab
const BaseJoi = require('@hapi/joi')
const JoiEnv = require('../')
const Joi = BaseJoi.extend(JoiEnv)

describe('.env', () => {
  beforeEach(() => {
    delete process.env.MY_KEY
  })

  it('sets value from process.env', () => {
    process.env.MY_KEY = 'test value'
    const schema = Joi.object({
      myKey: Joi.string().env('MY_KEY')
    })
    const config = schema.validate({ myKey: 'someting else' })
    expect(config.value).to.equal({ myKey: 'test value' })
  })

  it('does not set value if key not in process.env', () => {
    const schema = Joi.object({
      myKey: Joi.string().env('MY_KEY')
    })
    const config = schema.validate({ myKey: 'existing value' })
    expect(config.value).to.equal({ myKey: 'existing value' })
  })

  it('works in a deeply nested schema', () => {
    process.env.MY_KEY = 'test value'
    const schema = Joi.object({
      nested: Joi.object({
        myKey: Joi.string().env('MY_KEY')
      })
    })
    const config = schema.validate({})
    expect(config.value).to.equal({ nested: { myKey: 'test value' } })
  })

  it('is ok not being part of a schema', () => {
    const schema = Joi.object({
      myKey: Joi.string()
    })
    const config = schema.validate({})
    expect(config.value).to.equal({ myKey: undefined })
  })

  it('validates object w/ default null', () => {
    const schema = Joi.object({
      nested: Joi.object().default(null)
    })
    const config = schema.validate({})
    expect(config.nested).to.not.exist()
  })
})
