/**
 * # Command: Tasks
 *
 * Get list of supported tasks.
 */

import { Socket } from '../utilities/network'
import chalk from 'chalk'

export default {
  command: 'types',
  alias: ['tasks', 'list'],
  description: 'List the types of tasks which can be processed',
  action ({ socket }) {
    return socket.once('/tasks/types').then((types) => {
      return types.map((type) => `${chalk.yellow(type.type)}: ${type.text}`)
    })
  }
}
