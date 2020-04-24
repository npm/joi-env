'use strict'

const prepareChildren = (root, value = {}) => {
  if (root.schema.type === 'object') {
    for (const child of root.schema.$_terms.keys) {
      value[child.key] = prepareChildren(child, value[child.key])
    }
    return value
  }

  const key = root.schema.$_getFlag('env')
  if (key === undefined || !process.env.hasOwnProperty(key)) {
    return value
  }

  return process.env[key]
}

const extension = {
  type: /^.*$/,
  prepare (value, helpers) {
    return { value: prepareChildren(helpers, value) }
  },
  rules: {
    env: {
      method (key) {
        return this.$_setFlag('env', key)
      }
    }
  }
}

module.exports = extension
