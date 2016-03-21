/**
 * # Utility: Network
 *
 * Communication helpers
 */

import { extname } from 'path'
import { Client } from 'nes'
import WebTorrent from 'webtorrent-hybrid'

/**
 * [createSocket description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export function createSocket (url) {
  return new Promise((resolve, reject) => {
    const socket = new Socket(url)
    socket.client.connect((error) => {
      if (error) {
        return reject(error)
      }
      return resolve(socket)
    })
  })
}

/**
 * [createPeer description]
 * @return {[type]} [description]
 */
export function createPeer () {
  return new Promise((resolve) => {
    const peer = new Peer()
    peer.client.on('ready', () => resolve(peer))
    peer.client.on('error', (error) => {
      console.error(error.message)
      process.exit()
    })
  })
}

/**
 *
 */
class Socket {

  /**
   * [constructor description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  constructor (url) {
    this.client = new Client(url)
  }

  /**
   * [on description]
   * @param  {[type]}   path     [description]
   * @param  {[type]}   handler  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  on (path, handler, callback) {
    this.client.subscribe(path, handler, (error) => {
      if (error) {
        return console.error(error)
      }
      callback && callback()
    })
  }

  /**
   * [once description]
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  once (path) {
    return new Promise((resolve, reject) => {
      const { client } = this
      client.subscribe(path, function receive (message) {
        client.unsubscribe(path, receive)
        return resolve(message)
      }, (error) => {
        if (error) {
          return reject(error)
        }
      })
    })
  }

  /**
   * [send description]
   * @param  {[type]} path    [description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  send (path, message) {
    return new Promise((resolve, reject) => {
      this.client.message({ path, message}, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response)
      })
    })
  }

  /**
   * [description]
   * @param  {[type]} path  [description]
   * @param  {[type]} query [description]
   * @return {[type]}       [description]
   */
  get (path) {
    return new Promise((resolve, reject) => {
      this.client.request(path, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response)
      })
    })
  }
}

/**
 *
 */
class Peer {
  constructor(){
    this.client = new WebTorrent()
    this.client.on('error', ::console.error)
  }

  /**
   * [load description]
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */
  load (source) {
    return new Promise((resolve, reject) => {
      this.client.add(source, (torrent) => {
        return resolve(torrent)
      })
    })
  }

  /**
   * [seed description]
   * @param  {[type]} files [description]
   * @return {[type]}       [description]
   */
  seed (files) {
    return new Promise((resolve, reject) => {
      this.client.seed(files, (torrent) => {
        return resolve(torrent)
      })
    })
  }

  /**
   * [read description]
   * Provide either the hash or torrent to ready
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */
  read (source) {
    const getTorrent = (typeof source === 'string') ? this.load(source) : Promise.resolve(source)
    return getTorrent.then((torrent) => {
      return new Promise((resolve, reject) => {
        const [file] = torrent.files
        file.getBuffer((error, buffer) => {
          if (error) {
            return reject(error)
          }
          const extension = extname(file.path)
          if (!extension.length || extension === 'json') {
            try {
              buffer = JSON.parse(buffer.toString())
            } catch (error) {
              console.log('catch', error)
            }
          }
          buffer._source = source
          return resolve(buffer)
        })
      })
    })
  }

  /**
   * [write description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  write (data) {
    const vdoc = new Buffer(JSON.stringify(data))
    vdoc.name = 'virtual document' // requires a name/path
    return this.seed(vdoc)
  }
}
