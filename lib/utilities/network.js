'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * # Utility: Network
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Communication helpers
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

exports.createSocket = createSocket;
exports.createPeer = createPeer;

var _path = require('path');

var _nes = require('nes');

var _webtorrentHybrid = require('webtorrent-hybrid');

var _webtorrentHybrid2 = _interopRequireDefault(_webtorrentHybrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * [createSocket description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function createSocket(url) {
  return new Promise(function (resolve, reject) {
    var socket = new Socket(url);
    socket.client.connect(function (error) {
      if (error) {
        return reject(error);
      }
      return resolve(socket);
    });
  });
}

/**
 * [createPeer description]
 * @return {[type]} [description]
 */
function createPeer() {
  return new Promise(function (resolve) {
    var peer = new Peer();
    peer.client.on('ready', function () {
      return resolve(peer);
    });
    peer.client.on('error', function (error) {
      console.error(error.message);
      process.exit();
    });
  });
}

/**
 *
 */

var Socket = function () {

  /**
   * [constructor description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */

  function Socket(url) {
    _classCallCheck(this, Socket);

    this.client = new _nes.Client(url);
  }

  /**
   * [on description]
   * @param  {[type]}   path     [description]
   * @param  {[type]}   handler  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */


  _createClass(Socket, [{
    key: 'on',
    value: function on(path, handler, callback) {
      this.client.subscribe(path, handler, function (error) {
        if (error) {
          return console.error(error);
        }
        callback && callback();
      });
    }

    /**
     * [once description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */

  }, {
    key: 'once',
    value: function once(path) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var client = _this.client;

        client.subscribe(path, function receive(message) {
          client.unsubscribe(path, receive);
          return resolve(message);
        }, function (error) {
          if (error) {
            return reject(error);
          }
        });
      });
    }

    /**
     * [send description]
     * @param  {[type]} path    [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */

  }, {
    key: 'send',
    value: function send(path, message) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.client.message({ path: path, message: message }, function (error, response) {
          if (error) {
            return reject(error);
          }
          return resolve(response);
        });
      });
    }

    /**
     * [description]
     * @param  {[type]} path  [description]
     * @param  {[type]} query [description]
     * @return {[type]}       [description]
     */

  }, {
    key: 'get',
    value: function get(path) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.client.request(path, function (error, response) {
          if (error) {
            return reject(error);
          }
          return resolve(response);
        });
      });
    }
  }]);

  return Socket;
}();

/**
 *
 */


var Peer = function () {
  function Peer() {
    var _context;

    _classCallCheck(this, Peer);

    this.client = new _webtorrentHybrid2.default();
    this.client.on('error', (_context = console).error.bind(_context));
  }

  /**
   * [load description]
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */


  _createClass(Peer, [{
    key: 'load',
    value: function load(source) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.client.add(source, function (torrent) {
          return resolve(torrent);
        });
      });
    }

    /**
     * [seed description]
     * @param  {[type]} files [description]
     * @return {[type]}       [description]
     */

  }, {
    key: 'seed',
    value: function seed(files) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.client.seed(files, function (torrent) {
          return resolve(torrent);
        });
      });
    }

    /**
     * [read description]
     * Provide either the hash or torrent to ready
     * @param  {[type]} source [description]
     * @return {[type]}        [description]
     */

  }, {
    key: 'read',
    value: function read(source) {
      var getTorrent = typeof source === 'string' ? this.load(source) : Promise.resolve(source);
      return getTorrent.then(function (torrent) {
        return new Promise(function (resolve, reject) {
          var _torrent$files = _slicedToArray(torrent.files, 1);

          var file = _torrent$files[0];

          file.getBuffer(function (error, buffer) {
            if (error) {
              return reject(error);
            }
            var extension = (0, _path.extname)(file.path);
            if (!extension.length || extension === 'json') {
              try {
                buffer = JSON.parse(buffer.toString());
              } catch (error) {
                console.log('catch', error);
              }
            }
            buffer._source = source;
            return resolve(buffer);
          });
        });
      });
    }

    /**
     * [write description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */

  }, {
    key: 'write',
    value: function write(data) {
      var vdoc = new Buffer(JSON.stringify(data));
      vdoc.name = 'virtual document'; // requires a name/path
      return this.seed(vdoc);
    }
  }]);

  return Peer;
}();
//# sourceMappingURL=data:application/json;base64,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Q0FEUDtBQUVaLGFBQU8sV0FBVyxJQUFYLENBQWdCLFVBQUMsT0FBRCxFQUFhO0FBQ2xDLGVBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjs4Q0FDdkIsUUFBUSxLQUFSLEtBRHVCOztjQUMvQix5QkFEK0I7O0FBRXRDLGVBQUssU0FBTCxDQUFlLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFDaEMsZ0JBQUksS0FBSixFQUFXO0FBQ1QscUJBQU8sT0FBTyxLQUFQLENBQVAsQ0FEUzthQUFYO0FBR0EsZ0JBQU0sWUFBWSxtQkFBUSxLQUFLLElBQUwsQ0FBcEIsQ0FKMEI7QUFLaEMsZ0JBQUksQ0FBQyxVQUFVLE1BQVYsSUFBb0IsY0FBYyxNQUFkLEVBQXNCO0FBQzdDLGtCQUFJO0FBQ0YseUJBQVMsS0FBSyxLQUFMLENBQVcsT0FBTyxRQUFQLEVBQVgsQ0FBVCxDQURFO2VBQUosQ0FFRSxPQUFPLEtBQVAsRUFBYztBQUNkLHdCQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLEtBQXJCLEVBRGM7ZUFBZDthQUhKO0FBT0EsbUJBQU8sT0FBUCxHQUFpQixNQUFqQixDQVpnQztBQWFoQyxtQkFBTyxRQUFRLE1BQVIsQ0FBUCxDQWJnQztXQUFuQixDQUFmLENBRnNDO1NBQXJCLENBQW5CLENBRGtDO09BQWIsQ0FBdkIsQ0FGWTs7Ozs7Ozs7Ozs7MEJBNkJQLE1BQU07QUFDWCxVQUFNLE9BQU8sSUFBSSxNQUFKLENBQVcsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFYLENBQVAsQ0FESztBQUVYLFdBQUssSUFBTCxHQUFZLGtCQUFaO0FBRlcsYUFHSixLQUFLLElBQUwsQ0FBVSxJQUFWLENBQVAsQ0FIVzs7OztTQW5FVCIsImZpbGUiOiJ1dGlsaXRpZXMvbmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBVdGlsaXR5OiBOZXR3b3JrXG4gKlxuICogQ29tbXVuaWNhdGlvbiBoZWxwZXJzXG4gKi9cblxuaW1wb3J0IHsgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tICduZXMnXG5pbXBvcnQgV2ViVG9ycmVudCBmcm9tICd3ZWJ0b3JyZW50LWh5YnJpZCdcblxuLyoqXG4gKiBbY3JlYXRlU29ja2V0IGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSB1cmwgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU29ja2V0ICh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBzb2NrZXQgPSBuZXcgU29ja2V0KHVybClcbiAgICBzb2NrZXQuY2xpZW50LmNvbm5lY3QoKGVycm9yKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvbHZlKHNvY2tldClcbiAgICB9KVxuICB9KVxufVxuXG4vKipcbiAqIFtjcmVhdGVQZWVyIGRlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQZWVyICgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3QgcGVlciA9IG5ldyBQZWVyKClcbiAgICBwZWVyLmNsaWVudC5vbigncmVhZHknLCAoKSA9PiByZXNvbHZlKHBlZXIpKVxuICAgIHBlZXIuY2xpZW50Lm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgcHJvY2Vzcy5leGl0KClcbiAgICB9KVxuICB9KVxufVxuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFNvY2tldCB7XG5cbiAgLyoqXG4gICAqIFtjb25zdHJ1Y3RvciBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB1cmwgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBjb25zdHJ1Y3RvciAodXJsKSB7XG4gICAgdGhpcy5jbGllbnQgPSBuZXcgQ2xpZW50KHVybClcbiAgfVxuXG4gIC8qKlxuICAgKiBbb24gZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gICBwYXRoICAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gICBoYW5kbGVyICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBvbiAocGF0aCwgaGFuZGxlciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmNsaWVudC5zdWJzY3JpYmUocGF0aCwgaGFuZGxlciwgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICB9XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBbb25jZSBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXRoIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIG9uY2UgKHBhdGgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeyBjbGllbnQgfSA9IHRoaXNcbiAgICAgIGNsaWVudC5zdWJzY3JpYmUocGF0aCwgZnVuY3Rpb24gcmVjZWl2ZSAobWVzc2FnZSkge1xuICAgICAgICBjbGllbnQudW5zdWJzY3JpYmUocGF0aCwgcmVjZWl2ZSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmUobWVzc2FnZSlcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogW3NlbmQgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGF0aCAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzZW5kIChwYXRoLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY2xpZW50Lm1lc3NhZ2UoeyBwYXRoLCBtZXNzYWdlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKHJlc3BvbnNlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXRoICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcXVlcnkgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldCAocGF0aCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmNsaWVudC5yZXF1ZXN0KHBhdGgsIChlcnJvciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFBlZXIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuY2xpZW50ID0gbmV3IFdlYlRvcnJlbnQoKVxuICAgIHRoaXMuY2xpZW50Lm9uKCdlcnJvcicsIDo6Y29uc29sZS5lcnJvcilcbiAgfVxuXG4gIC8qKlxuICAgKiBbbG9hZCBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBzb3VyY2UgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBsb2FkIChzb3VyY2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5jbGllbnQuYWRkKHNvdXJjZSwgKHRvcnJlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUodG9ycmVudClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBbc2VlZCBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBmaWxlcyBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc2VlZCAoZmlsZXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5jbGllbnQuc2VlZChmaWxlcywgKHRvcnJlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUodG9ycmVudClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBbcmVhZCBkZXNjcmlwdGlvbl1cbiAgICogUHJvdmlkZSBlaXRoZXIgdGhlIGhhc2ggb3IgdG9ycmVudCB0byByZWFkeVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHNvdXJjZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHJlYWQgKHNvdXJjZSkge1xuICAgIGNvbnN0IGdldFRvcnJlbnQgPSAodHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycpID8gdGhpcy5sb2FkKHNvdXJjZSkgOiBQcm9taXNlLnJlc29sdmUoc291cmNlKVxuICAgIHJldHVybiBnZXRUb3JyZW50LnRoZW4oKHRvcnJlbnQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IFtmaWxlXSA9IHRvcnJlbnQuZmlsZXNcbiAgICAgICAgZmlsZS5nZXRCdWZmZXIoKGVycm9yLCBidWZmZXIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IGV4dG5hbWUoZmlsZS5wYXRoKVxuICAgICAgICAgIGlmICghZXh0ZW5zaW9uLmxlbmd0aCB8fCBleHRlbnNpb24gPT09ICdqc29uJykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYnVmZmVyID0gSlNPTi5wYXJzZShidWZmZXIudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYXRjaCcsIGVycm9yKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBidWZmZXIuX3NvdXJjZSA9IHNvdXJjZVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKGJ1ZmZlcilcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBbd3JpdGUgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICB3cml0ZSAoZGF0YSkge1xuICAgIGNvbnN0IHZkb2MgPSBuZXcgQnVmZmVyKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgIHZkb2MubmFtZSA9ICd2aXJ0dWFsIGRvY3VtZW50JyAvLyByZXF1aXJlcyBhIG5hbWUvcGF0aFxuICAgIHJldHVybiB0aGlzLnNlZWQodmRvYylcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
