/**
 * # Utility: Specific
 *
 * Common tasks for the application
 */

import request from 'got'
import _eval from 'eval'

// DEVELOPMENT:'http://localhost:8000'
const serverUrl = 'http://udias.online'

// processing blocks of task
const INSTRUCTIONS = {
  remote: {
    data ({ manifest, value, peer }) {
      return new Promise((resolve, reject) => {
        peer.seed(value).then((torrent) => {
          manifest.data = torrent.infoHash
          return resolve(manifest)
        })
      })
   },
   params ({ manifest, value, field }) {
     return new Promise((resolve) => {
       if (!manifest.params) {
         manifest.params = {}
       }
       manifest.params[field.name] = value
       return resolve(manifest)
     })
   }
 }
}

/**
 * Apply instructions to define a manifest object
 */
export function createManifest ({ type, setup, values, peer }) {

  const manifest = {
    type
  }

  const instructions = setup.map((field) => {
    const [ environment, key ] = field.role.split('-')
    const instruction = INSTRUCTIONS[environment][key]
    return instruction({ manifest, value: values[field.name], field, peer })
  })

  return Promise.all(instructions).then(() => manifest)
}

/**
 * @param  {[type]} manifest [description]
 * @return {[type]}          [description]
 */
export function executeProcessing ({ manifest, peer }) {
  const loader = [
    request(`${serverUrl}/tasks/${manifest.type}.node.js`)
  ]
  if (manifest.data) {
    loader.push(peer.read(manifest.data))
  }
  return Promise.all(loader).then(([response, data]) => {
    return _eval(response.body, true).work(data)
  })
}
