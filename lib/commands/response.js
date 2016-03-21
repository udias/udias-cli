'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * # Command: Response
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _inquirer = require('inquirer');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _specific = require('../utilities/specific');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
  command: 'response [infoHash]',
  description: 'Select a task to solve',
  action: function action(_ref) {
    var infoHash = _ref.param;
    var options = _ref.options;
    var socket = _ref.socket;
    var peer = _ref.peer;

    return getTask(socket, peer, infoHash).then(function (source) {
      if (infoHash) {
        var _spinner = (0, _ora2.default)({
          text: 'Loading task',
          color: 'cyan'
        });
        console.log();
        _spinner.start();
      }
      return peer.read(source).then(function (manifest) {
        if (infoHash) {
          spinner.stop();
          spinner.clear();
        }
        return (0, _specific.executeProcessing)({ manifest: manifest, peer: peer }).then(function (data) {
          return peer.write(data);
        }).then(function (torrent) {
          var message = {
            source: manifest._source,
            data: torrent.infoHash
          };
          return socket.send('/tasks/results', message).then(function () {
            return new Promise(function (resolve, reject) {
              console.log('=>', message);
              // TODO:
              // - wait for confirmed receive
            });
          });
        });
      });
    });
  }
};

/**
 * [getTask description]
 * @param  {[type]} socket   [description]
 * @param  {[type]} peer     [description]
 * @param  {[type]} infoHash [description]
 * @return {[type]}          [description]
 */

function getTask(socket, peer, infoHash) {
  return new Promise(function (resolve, reject) {

    // direct, e.g. 'private'
    if (infoHash) {
      return resolve(infoHash);
    }

    var spinner = (0, _ora2.default)({
      text: 'Loading entries',
      color: 'cyan'
    });

    console.log();
    spinner.start();

    socket.get('/api/v1/connection/address').then(function (address) {
      return Promise.all([socket.once('/tasks/entries').then(function (globalEntries) {
        return Promise.all(globalEntries.map(function (task) {
          return peer.read(task.manifest);
        }));
      }), socket.once('/tasks/entries/' + address).then(function (localEntries) {
        return Promise.all(localEntries.map(function (task) {
          return peer.read(task.manifest);
        }));
      })]).then(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2);

        var globalEntries = _ref3[0];
        var localEntries = _ref3[1];


        spinner.stop();
        spinner.clear();

        if (!globalEntries.length && !localEntries.length) {
          console.log('No entries available!');
          return resolve();
        }

        (0, _inquirer.prompt)([{
          name: 'task',
          message: 'Which task should be solved ?',
          type: 'list',
          choices: [].concat(_toConsumableArray(localEntries.map(function (entry) {
            return _chalk2.default.green('[local]') + ' ' + _chalk2.default.red(entry.type) + ' ' + _chalk2.default.white('-') + ' ' + entry._source;
          })), _toConsumableArray(globalEntries.map(function (entry) {
            return _chalk2.default.yellow('[global]') + ' ' + _chalk2.default.red(entry.type) + ' ' + _chalk2.default.white('-') + ' ' + entry._source;
          })))
        }], function (_ref4) {
          var task = _ref4.task;

          var source = task.match(/(\S+)$/)[1];
          return resolve(source);
        });
      });
    }).catch(reject);
  });
}

// peer.read(infoHash)
//
//
//  const match = (scope === 'local' ? localEntries : globalEntries).find((entry) => {
//    return entry.type === type && entry.data === data
//  })
//
//  return resolve(match)
//
// const scope = task.match(/\[(\w+)\]/)[1]
// const type = task.match(/(\S+):/)[1]
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QWpDLHlCQUFpQztZQUFsQix3QkFBa0I7OztBQUV2QyxnQkFBUSxJQUFSLEdBRnVDO0FBR3ZDLGdCQUFRLEtBQVIsR0FIdUM7O0FBS3ZDLFlBQUksQ0FBQyxjQUFjLE1BQWQsSUFBd0IsQ0FBQyxhQUFhLE1BQWIsRUFBcUI7QUFDakQsa0JBQVEsR0FBUixDQUFZLHVCQUFaLEVBRGlEO0FBRWpELGlCQUFPLFNBQVAsQ0FGaUQ7U0FBbkQ7O0FBS0EsOEJBQU8sQ0FDTDtBQUNFLGdCQUFNLE1BQU47QUFDQSxtQkFBUywrQkFBVDtBQUNBLGdCQUFNLE1BQU47QUFDQSxnREFDSyxhQUFhLEdBQWIsQ0FBaUIsVUFBQyxLQUFEO21CQUFjLGdCQUFNLEtBQU4sQ0FBWSxTQUFaLFVBQTBCLGdCQUFNLEdBQU4sQ0FBVSxNQUFNLElBQU4sVUFBZSxnQkFBTSxLQUFOLENBQVksR0FBWixVQUFvQixNQUFNLE9BQU47V0FBckYsdUJBQ2pCLGNBQWMsR0FBZCxDQUFrQixVQUFDLEtBQUQ7bUJBQWMsZ0JBQU0sTUFBTixDQUFhLFVBQWIsVUFBNEIsZ0JBQU0sR0FBTixDQUFVLE1BQU0sSUFBTixVQUFlLGdCQUFNLEtBQU4sQ0FBWSxHQUFaLFVBQW9CLE1BQU0sT0FBTjtXQUF2RixHQUZ2QjtTQUxHLENBQVAsRUFVRyxpQkFBYztjQUFYLGtCQUFXOztBQUNmLGNBQU0sU0FBUyxLQUFLLEtBQUwsQ0FBVyxRQUFYLEVBQXFCLENBQXJCLENBQVQsQ0FEUztBQUVmLGlCQUFPLFFBQVEsTUFBUixDQUFQLENBRmU7U0FBZCxDQVZILENBVnVDO09BQW5DLENBUk4sQ0FEeUQ7S0FBYixDQUE5QyxDQW1DQyxLQW5DRCxDQW1DTyxNQW5DUCxFQWZzQztHQUFyQixDQUFuQixDQUR3QztDQUExQyIsImZpbGUiOiJjb21tYW5kcy9yZXNwb25zZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBDb21tYW5kOiBSZXNwb25zZVxuICpcbiAqXG4gKi9cblxuaW1wb3J0IHsgcHJvbXB0IH0gZnJvbSAnaW5xdWlyZXInXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnXG5pbXBvcnQgb3JhIGZyb20gJ29yYSdcblxuaW1wb3J0IHsgZXhlY3V0ZVByb2Nlc3NpbmcgfSBmcm9tICcuLi91dGlsaXRpZXMvc3BlY2lmaWMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tbWFuZDogJ3Jlc3BvbnNlIFtpbmZvSGFzaF0nLFxuICBkZXNjcmlwdGlvbjogJ1NlbGVjdCBhIHRhc2sgdG8gc29sdmUnLFxuICBhY3Rpb24gKHsgcGFyYW06IGluZm9IYXNoLCBvcHRpb25zLCBzb2NrZXQsIHBlZXIgfSkge1xuICAgIHJldHVybiBnZXRUYXNrKHNvY2tldCwgcGVlciwgaW5mb0hhc2gpLnRoZW4oKHNvdXJjZSkgPT4ge1xuICAgICAgaWYgKGluZm9IYXNoKSB7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBvcmEoe1xuICAgICAgICAgIHRleHQ6ICdMb2FkaW5nIHRhc2snLFxuICAgICAgICAgIGNvbG9yOiAnY3lhbidcbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coKVxuICAgICAgICBzcGlubmVyLnN0YXJ0KClcbiAgICAgIH1cbiAgICAgIHJldHVybiBwZWVyLnJlYWQoc291cmNlKS50aGVuKChtYW5pZmVzdCkgPT4ge1xuICAgICAgICBpZiAoaW5mb0hhc2gpIHtcbiAgICAgICAgICBzcGlubmVyLnN0b3AoKVxuICAgICAgICAgIHNwaW5uZXIuY2xlYXIoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleGVjdXRlUHJvY2Vzc2luZyh7IG1hbmlmZXN0LCBwZWVyIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHBlZXIud3JpdGUoZGF0YSkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHRvcnJlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbWFuaWZlc3QuX3NvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdG9ycmVudC5pbmZvSGFzaFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvY2tldC5zZW5kKCcvdGFza3MvcmVzdWx0cycsIG1lc3NhZ2UpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PicsIG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAgICAgICAgICAgICAvLyAtIHdhaXQgZm9yIGNvbmZpcm1lZCByZWNlaXZlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBbZ2V0VGFzayBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gc29ja2V0ICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBwZWVyICAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGluZm9IYXNoIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRUYXNrIChzb2NrZXQsIHBlZXIsIGluZm9IYXNoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAvLyBkaXJlY3QsIGUuZy4gJ3ByaXZhdGUnXG4gICAgaWYgKGluZm9IYXNoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShpbmZvSGFzaClcbiAgICB9XG5cbiAgICBjb25zdCBzcGlubmVyID0gb3JhKHtcbiAgICAgIHRleHQ6ICdMb2FkaW5nIGVudHJpZXMnLFxuICAgICAgY29sb3I6ICdjeWFuJ1xuICAgIH0pXG5cbiAgICBjb25zb2xlLmxvZygpXG4gICAgc3Bpbm5lci5zdGFydCgpXG5cbiAgICBzb2NrZXQuZ2V0KCcvYXBpL3YxL2Nvbm5lY3Rpb24vYWRkcmVzcycpLnRoZW4oKGFkZHJlc3MpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIHNvY2tldC5vbmNlKCcvdGFza3MvZW50cmllcycpLnRoZW4oKGdsb2JhbEVudHJpZXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZ2xvYmFsRW50cmllcy5tYXAoKHRhc2spID0+IHBlZXIucmVhZCh0YXNrLm1hbmlmZXN0KSkpXG4gICAgICAgIH0pLFxuICAgICAgICBzb2NrZXQub25jZShgL3Rhc2tzL2VudHJpZXMvJHthZGRyZXNzfWApLnRoZW4oKGxvY2FsRW50cmllcykgPT4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsb2NhbEVudHJpZXMubWFwKCh0YXNrKSA9PiBwZWVyLnJlYWQodGFzay5tYW5pZmVzdCkpKVxuICAgICAgICB9KVxuICAgICAgXSlcbiAgICAgIC50aGVuKChbZ2xvYmFsRW50cmllcywgbG9jYWxFbnRyaWVzXSkgPT4ge1xuXG4gICAgICAgIHNwaW5uZXIuc3RvcCgpXG4gICAgICAgIHNwaW5uZXIuY2xlYXIoKVxuXG4gICAgICAgIGlmICghZ2xvYmFsRW50cmllcy5sZW5ndGggJiYgIWxvY2FsRW50cmllcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZW50cmllcyBhdmFpbGFibGUhJylcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICAgIH1cblxuICAgICAgICBwcm9tcHQoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd0YXNrJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXaGljaCB0YXNrIHNob3VsZCBiZSBzb2x2ZWQgPycsXG4gICAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgIC4uLmxvY2FsRW50cmllcy5tYXAoKGVudHJ5KSA9PiBgJHtjaGFsay5ncmVlbignW2xvY2FsXScpfSAke2NoYWxrLnJlZChlbnRyeS50eXBlKX0gJHtjaGFsay53aGl0ZSgnLScpfSAke2VudHJ5Ll9zb3VyY2V9YCksXG4gICAgICAgICAgICAgIC4uLmdsb2JhbEVudHJpZXMubWFwKChlbnRyeSkgPT4gYCR7Y2hhbGsueWVsbG93KCdbZ2xvYmFsXScpfSAke2NoYWxrLnJlZChlbnRyeS50eXBlKX0gJHtjaGFsay53aGl0ZSgnLScpfSAke2VudHJ5Ll9zb3VyY2V9YClcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF0sICh7IHRhc2sgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHRhc2subWF0Y2goLyhcXFMrKSQvKVsxXVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKHNvdXJjZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICAuY2F0Y2gocmVqZWN0KVxuICB9KVxufVxuXG5cbi8vIHBlZXIucmVhZChpbmZvSGFzaClcbi8vXG4vL1xuLy8gIGNvbnN0IG1hdGNoID0gKHNjb3BlID09PSAnbG9jYWwnID8gbG9jYWxFbnRyaWVzIDogZ2xvYmFsRW50cmllcykuZmluZCgoZW50cnkpID0+IHtcbi8vICAgIHJldHVybiBlbnRyeS50eXBlID09PSB0eXBlICYmIGVudHJ5LmRhdGEgPT09IGRhdGFcbi8vICB9KVxuLy9cbi8vICByZXR1cm4gcmVzb2x2ZShtYXRjaClcbi8vXG4vLyBjb25zdCBzY29wZSA9IHRhc2subWF0Y2goL1xcWyhcXHcrKVxcXS8pWzFdXG4vLyBjb25zdCB0eXBlID0gdGFzay5tYXRjaCgvKFxcUyspOi8pWzFdXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
