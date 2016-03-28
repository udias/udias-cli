/**
 * # Command: Request
 *
 *
 */

import { readFile, createReadStream } from 'fs'
import { prompt } from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import ip from 'ip'

import { createManifest } from '../utilities/specific'

const TYPES = {
  file (config) {
    return {
      type: 'input',
      default: process.cwd()
    }
  },
  range (config) {
    return {
      type: 'input'
    }
  }
}

export default {
  command: 'request [task]',
  alias: ['create'],
  options: {
    params: {
      flags: '-p, --params [values]',
      description: 'define parameters for the task',
      defaultValue: {},
      transform (values) {
        // format: --params data:example.png,scope:global
        return values.split(',').reduce((params, pair) => {
          const [key, value] = pair.split(':')
          params[key] = value
          return params
        }, Object.create(null))
      }
    }
  },
  description: 'Creates a new task to solve',
  action ({ param: taskType, options, socket, peer }) {
    return getTask(socket, taskType).then((task) => {
      if (!task) { // Error
        return chalk.red(`Invalid task selected "${taskType}"`)
      }
      return new Promise((resolve, reject) => {
        const { type, setup } = task
        const fields = setup
                        .filter((field) => !options.params[field.name])
                        .map((field) => {
                          return {
                            name: field.name,
                            message: field.text,
                            ...TYPES[field.type](field.config)
                          }
                        })

        if (!options.params.scope) {
          fields.push({
            name: 'scope',
            message: 'Which visibility level should the task have ?',
            type: 'list',
            choices: ['global', 'local', 'private']
          })
        }

        if (!options.params.details) {
          fields.push({
            name: 'details',
            message: 'Do you like to include information about your connection ?',
            type: 'confirm',
            when: (values) => {
              const { scope } = values
              if (scope === 'local') {
                return false
              }
              return true
            },
            default: (values) => values.scope === 'private'
          })
        }

        if (!taskType) {
          fields.push({
            name: 'confirm',
            message: 'Should the task be created ?',
            type: 'confirm'
          })
        }

        prompt(fields, (values) => {

          // cancel
          if (!taskType && values.confirm === 'false') {
            return resolve()
          }

          // merge inputs
          Object.assign(values, options.params)

          const prepare = [
            createManifest({ type, setup, values, peer }).then(peer.write)
          ]

          if (values.scope === 'local') {
            prepare.push(socket.get('/api/v1/connection/address'))
          }

          if (values.details === 'true') {
            prepare.push(socket.get('/api/v1/connection/details'))
          }

          const spinner = ora({
            text: 'Creating manifest',
            color: 'cyan'
          })

          console.log()
          spinner.start()

          Promise.all(prepare).then(([ torrent, ...responses ]) => {
            spinner.stop()
            spinner.clear()

            const address = values.scope === 'local' && responses[0]
            const details = values.details && (address ? responses[1] : responses[0])

            const connection = {}
            if (address) { // == local
              Object.assign(connection, {
                remoteAddress: address
              })
            }
            if (details) {
              Object.assign(connection, {
                localAddress: ip.address(),
                details
              })
            }

            const message = {
              type: 'create',
              scope: values.scope,
              manifest: torrent.infoHash,
              connection
            }
            socket.send('/tasks/entries', message).then(() => {
              console.log('=>', torrent.infoHash, torrent.magnetURI)
              // TODO:
              // - open pending dashboard
              // return resolve()
            })
          })
          .catch(reject)

        })
      })
    })
    .catch(::console.error)
  }
}

/**
 * Load tasks and create selection
 *
 * @param  {Socket}  socket   -
 * @param  {string}  taskType -
 * @return {Promise}          -
 */
function getTask (socket, taskType) {
  return socket.once('/tasks/types').then((typeList) => {
    return new Promise((resolve) => {
      if (taskType) {
        return resolve(taskType)
      }
      prompt([
        {
          name: 'type',
          message: 'What type of task should be solved ?',
          type: 'list',
          choices: typeList.map((type) => type.type)
        }
      ], ({ type }) => resolve(type))
    })
    .then((type) => typeList.find((entry) => entry.type === type))
  })
}
