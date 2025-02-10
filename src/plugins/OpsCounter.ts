import { APIError, CollectionBeforeOperationHook, Plugin } from 'payload'

type Args = {
  max: number
}

export const opsCounterPlugin =
  (args?: Args): Plugin =>
  (config) => {
    const max = args?.max || 50

    const beforeOperationHook: CollectionBeforeOperationHook = ({ req }) => {
      const currentCount = req.context.opsCount

      if (typeof currentCount === 'number') {
        req.context.opsCount = currentCount + 1

        if (currentCount > max) {
          throw new APIError(`Maximum operations of ${max} detected.`)
        }
      } else {
        req.context.opsCount = 1
      }
    }

    ;(config.collections || []).forEach((collection) => {
      if (!collection.hooks) collection.hooks = {}
      if (!collection.hooks.beforeOperation) collection.hooks.beforeOperation = []

      collection.hooks.beforeOperation.push(beforeOperationHook)
    })
    return config
  }
