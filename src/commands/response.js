/**
 * # Command: Response
 *
 *
 */

import { prompt } from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'

import { executeProcessing } from '../utilities/specific'

export default {
  command: 'response [infoHash]',
  description: 'Select a task to solve',
  action ({ param: infoHash, options, socket, peer }) {
    return getTask(socket, peer, infoHash).then((source) => {
      // handle 'No entries available!'
      if (!source) {
        return
      }
      if (infoHash) {
        const spinner = ora({
          text: 'Loading task',
          color: 'cyan'
        })
        console.log()
        spinner.start()
      }
      return peer.read(source).then((manifest) => {
        if (infoHash) {
          spinner.stop()
          spinner.clear()
        }
        return executeProcessing({ manifest, peer })
                .then((data) => peer.write(data))
                .then((torrent) => {
                  const message = {
                    source: manifest._source,
                    data: torrent.infoHash
                  }
                  return socket.send('/tasks/results', message).then(() => {
                    return new Promise((resolve, reject) => {
                      console.log('=>', message)
                      // TODO:
                      // - wait for confirmed receive
                    })
                  })
                })
      })
    })
  }
}

/**
 * [getTask description]
 * @param  {[type]} socket   [description]
 * @param  {[type]} peer     [description]
 * @param  {[type]} infoHash [description]
 * @return {[type]}          [description]
 */
function getTask (socket, peer, infoHash) {
  return new Promise((resolve, reject) => {

    // direct, e.g. 'private'
    if (infoHash) {
      return resolve(infoHash)
    }

    const spinner = ora({
      text: 'Loading entries',
      color: 'cyan'
    })

    console.log()
    spinner.start()

    socket.get('/api/v1/connection/address').then((address) => {
      return Promise.all([
        socket.once('/tasks/entries').then((globalEntries) => {
          return Promise.all(globalEntries.map((task) => peer.read(task.manifest)))
        }),
        socket.once(`/tasks/entries/${address}`).then((localEntries) => {
          return Promise.all(localEntries.map((task) => peer.read(task.manifest)))
        })
      ])
      .then(([globalEntries, localEntries]) => {

        spinner.stop()
        spinner.clear()

        if (!globalEntries.length && !localEntries.length) {
          console.log('No entries available!')
          return resolve()
        }

        prompt([
          {
            name: 'task',
            message: 'Which task should be solved ?',
            type: 'list',
            choices: [
              ...localEntries.map((entry) => `${chalk.green('[local]')} ${chalk.red(entry.type)} ${chalk.white('-')} ${entry._source}`),
              ...globalEntries.map((entry) => `${chalk.yellow('[global]')} ${chalk.red(entry.type)} ${chalk.white('-')} ${entry._source}`)
            ]
          }
        ], ({ task }) => {
          const source = task.match(/(\S+)$/)[1]
          return resolve(source)
        })
      })
    })
    .catch(reject)
  })
}
