/**
 * # Index
 *
 * Define initial values
 */

import updateNotifier from 'update-notifier'
import parse from './parse'
import { createSocket, createPeer } from './utilities/network'

import config from '../config'

import * as pkg from '../package.json'

const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 * 1 })

if (notifier.update) {
  console.log(`Update available: ${notifier.update.current} -> ${notifier.update.latest}`)
  console.log(`Run "npm install -g ${pkg.name}" to update!`)
}

Promise.all([
  createSocket(`ws://${config.host}:${config.port}`),
  createPeer()
])
.then(([ socket, peer ]) => parse({ socket, peer }))
.then((output) => {
  if (output) {
    if (!Array.isArray(output)) {
      output = [output]
    }
    output.forEach((o) => console.log(o))
  }
  process.exit()
})
.catch((error) => {
  if (error) {
    console.error(error)
  }
  process.exit()
})
