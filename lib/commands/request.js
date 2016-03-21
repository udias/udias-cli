'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * # Command: Request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _fs = require('fs');

var _inquirer = require('inquirer');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _specific = require('../utilities/specific');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var TYPES = {
  file: function file(config) {
    return {
      type: 'input',
      default: process.cwd()
    };
  },
  range: function range(config) {
    return {
      type: 'input'
    };
  }
};

exports.default = {
  command: 'request [task]',
  alias: ['create'],
  options: {
    params: {
      flags: '-p, --params [values]',
      description: 'define parameters for the task',
      defaultValue: {},
      transform: function transform(values) {
        // format: --params data:example.png,scope:global
        return values.split(',').reduce(function (params, pair) {
          var _pair$split = pair.split(':');

          var _pair$split2 = _slicedToArray(_pair$split, 2);

          var key = _pair$split2[0];
          var value = _pair$split2[1];

          params[key] = value;
          return params;
        }, Object.create(null));
      }
    }
  },
  description: 'Creates a new task to solve',
  action: function action(_ref) {
    var _context;

    var taskType = _ref.param;
    var options = _ref.options;
    var socket = _ref.socket;
    var peer = _ref.peer;

    return getTask(socket, taskType).then(function (task) {
      if (!task) {
        // Error
        return _chalk2.default.red('Invalid task selected "' + taskType + '"');
      }
      return new Promise(function (resolve, reject) {
        var type = task.type;
        var setup = task.setup;

        var fields = setup.filter(function (field) {
          return !options.params[field.name];
        }).map(function (field) {
          return _extends({
            name: field.name,
            message: field.text
          }, TYPES[field.type](field.config));
        });

        if (!options.params.scope) {
          fields.push({
            name: 'scope',
            message: 'Which visibility level should the task have ?',
            type: 'list',
            choices: ['global', 'local', 'private']
          });
        }

        if (!options.params.details) {
          fields.push({
            name: 'details',
            message: 'Do you like to include information about your connection ?',
            type: 'confirm',
            when: function when(values) {
              var scope = values.scope;

              if (scope === 'local') {
                return false;
              }
              return true;
            },
            default: function _default(values) {
              return values.scope === 'private';
            }
          });
        }

        if (!taskType) {
          fields.push({
            name: 'confirm',
            message: 'Should the task be created ?',
            type: 'confirm'
          });
        }

        (0, _inquirer.prompt)(fields, function (values) {

          // cancel
          if (!taskType && values.confirm === 'false') {
            return resolve();
          }

          // merge inputs
          Object.assign(values, options.params);

          var prepare = [(0, _specific.createManifest)({ type: type, setup: setup, values: values, peer: peer }).then(peer.write)];

          if (values.scope === 'local') {
            prepare.push(socket.get('/api/v1/connection/address'));
          }

          if (values.details === 'true') {
            prepare.push(socket.get('/api/v1/connection/details'));
          }

          var spinner = (0, _ora2.default)({
            text: 'Creating manifest',
            color: 'cyan'
          });

          console.log();
          spinner.start();

          Promise.all(prepare).then(function (_ref2) {
            var _ref3 = _toArray(_ref2);

            var torrent = _ref3[0];

            var responses = _ref3.slice(1);

            spinner.stop();
            spinner.clear();

            var address = values.scope === 'local' && responses[0];
            var details = values.details && (address ? responses[1] : responses[0]);

            var connection = {};
            if (address) {
              // == local
              Object.assign(connection, {
                remoteAddress: address
              });
            }
            if (details) {
              Object.assign(connection, {
                localAddress: _ip2.default.address(),
                details: details
              });
            }

            var message = {
              type: 'create',
              scope: values.scope,
              manifest: torrent.infoHash,
              connection: connection
            };
            socket.send('/tasks/entries', message).then(function () {
              console.log('=>', torrent.infoHash, torrent.magnetURI);
              // TODO:
              // - open pending dashboard
              // return resolve()
            });
          }).catch(reject);
        });
      });
    }).catch((_context = console).error.bind(_context));
  }
};

/**
 * [getTask description]
 * @param  {[type]} socket   [description]
 * @param  {[type]} taskType [description]
 * @return {[type]}          [description]
 */

function getTask(socket, taskType) {
  return socket.once('/tasks/types').then(function (typeList) {
    return new Promise(function (resolve) {
      if (taskType) {
        return resolve(taskType);
      }
      (0, _inquirer.prompt)([{
        name: 'type',
        message: 'What type of task should be solved ?',
        type: 'list',
        choices: typeList.map(function (type) {
          return type.type;
        })
      }], function (_ref4) {
        var type = _ref4.type;
        return resolve(type);
      });
    }).then(function (type) {
      return typeList.find(function (entry) {
        return entry.type === type;
      });
    });
  });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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O0FBR0EsNEJBQU8sQ0FDTDtBQUNFLGNBQU0sTUFBTjtBQUNBLGlCQUFTLHNDQUFUO0FBQ0EsY0FBTSxNQUFOO0FBQ0EsaUJBQVMsU0FBUyxHQUFULENBQWEsVUFBQyxJQUFEO2lCQUFVLEtBQUssSUFBTDtTQUFWLENBQXRCO09BTEcsQ0FBUCxFQU9HO1lBQUc7ZUFBVyxRQUFRLElBQVI7T0FBZCxDQVBILENBSjhCO0tBQWIsQ0FBWixDQWFOLElBYk0sQ0FhRCxVQUFDLElBQUQ7YUFBVSxTQUFTLElBQVQsQ0FBYyxVQUFDLEtBQUQ7ZUFBVyxNQUFNLElBQU4sS0FBZSxJQUFmO09BQVg7S0FBeEIsQ0FiTixDQURvRDtHQUFkLENBQXhDLENBRGtDO0NBQXBDIiwiZmlsZSI6ImNvbW1hbmRzL3JlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgQ29tbWFuZDogUmVxdWVzdFxuICpcbiAqXG4gKi9cblxuaW1wb3J0IHsgcmVhZEZpbGUsIGNyZWF0ZVJlYWRTdHJlYW0gfSBmcm9tICdmcydcbmltcG9ydCB7IHByb21wdCB9IGZyb20gJ2lucXVpcmVyJ1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xuaW1wb3J0IG9yYSBmcm9tICdvcmEnXG5pbXBvcnQgaXAgZnJvbSAnaXAnXG5cbmltcG9ydCB7IGNyZWF0ZU1hbmlmZXN0IH0gZnJvbSAnLi4vdXRpbGl0aWVzL3NwZWNpZmljJ1xuXG5jb25zdCBUWVBFUyA9IHtcbiAgZmlsZSAoY29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBkZWZhdWx0OiBwcm9jZXNzLmN3ZCgpXG4gICAgfVxuICB9LFxuICByYW5nZSAoY29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdpbnB1dCdcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21tYW5kOiAncmVxdWVzdCBbdGFza10nLFxuICBhbGlhczogWydjcmVhdGUnXSxcbiAgb3B0aW9uczoge1xuICAgIHBhcmFtczoge1xuICAgICAgZmxhZ3M6ICctcCwgLS1wYXJhbXMgW3ZhbHVlc10nLFxuICAgICAgZGVzY3JpcHRpb246ICdkZWZpbmUgcGFyYW1ldGVycyBmb3IgdGhlIHRhc2snLFxuICAgICAgZGVmYXVsdFZhbHVlOiB7fSxcbiAgICAgIHRyYW5zZm9ybSAodmFsdWVzKSB7XG4gICAgICAgIC8vIGZvcm1hdDogLS1wYXJhbXMgZGF0YTpleGFtcGxlLnBuZyxzY29wZTpnbG9iYWxcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5zcGxpdCgnLCcpLnJlZHVjZSgocGFyYW1zLCBwYWlyKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gcGFpci5zcGxpdCgnOicpXG4gICAgICAgICAgcGFyYW1zW2tleV0gPSB2YWx1ZVxuICAgICAgICAgIHJldHVybiBwYXJhbXNcbiAgICAgICAgfSwgT2JqZWN0LmNyZWF0ZShudWxsKSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRlc2NyaXB0aW9uOiAnQ3JlYXRlcyBhIG5ldyB0YXNrIHRvIHNvbHZlJyxcbiAgYWN0aW9uICh7IHBhcmFtOiB0YXNrVHlwZSwgb3B0aW9ucywgc29ja2V0LCBwZWVyIH0pIHtcbiAgICByZXR1cm4gZ2V0VGFzayhzb2NrZXQsIHRhc2tUeXBlKS50aGVuKCh0YXNrKSA9PiB7XG4gICAgICBpZiAoIXRhc2spIHsgLy8gRXJyb3JcbiAgICAgICAgcmV0dXJuIGNoYWxrLnJlZChgSW52YWxpZCB0YXNrIHNlbGVjdGVkIFwiJHt0YXNrVHlwZX1cImApXG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHNldHVwIH0gPSB0YXNrXG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IHNldHVwXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChmaWVsZCkgPT4gIW9wdGlvbnMucGFyYW1zW2ZpZWxkLm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGZpZWxkLnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uVFlQRVNbZmllbGQudHlwZV0oZmllbGQuY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgIGlmICghb3B0aW9ucy5wYXJhbXMuc2NvcGUpIHtcbiAgICAgICAgICBmaWVsZHMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiAnc2NvcGUnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1doaWNoIHZpc2liaWxpdHkgbGV2ZWwgc2hvdWxkIHRoZSB0YXNrIGhhdmUgPycsXG4gICAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2dsb2JhbCcsICdsb2NhbCcsICdwcml2YXRlJ11cbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLnBhcmFtcy5kZXRhaWxzKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogJ2RldGFpbHMnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0RvIHlvdSBsaWtlIHRvIGluY2x1ZGUgaW5mb3JtYXRpb24gYWJvdXQgeW91ciBjb25uZWN0aW9uID8nLFxuICAgICAgICAgICAgdHlwZTogJ2NvbmZpcm0nLFxuICAgICAgICAgICAgd2hlbjogKHZhbHVlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB7IHNjb3BlIH0gPSB2YWx1ZXNcbiAgICAgICAgICAgICAgaWYgKHNjb3BlID09PSAnbG9jYWwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWZhdWx0OiAodmFsdWVzKSA9PiB2YWx1ZXMuc2NvcGUgPT09ICdwcml2YXRlJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRhc2tUeXBlKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogJ2NvbmZpcm0nLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1Nob3VsZCB0aGUgdGFzayBiZSBjcmVhdGVkID8nLFxuICAgICAgICAgICAgdHlwZTogJ2NvbmZpcm0nXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHByb21wdChmaWVsZHMsICh2YWx1ZXMpID0+IHtcblxuICAgICAgICAgIC8vIGNhbmNlbFxuICAgICAgICAgIGlmICghdGFza1R5cGUgJiYgdmFsdWVzLmNvbmZpcm0gPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBtZXJnZSBpbnB1dHNcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHZhbHVlcywgb3B0aW9ucy5wYXJhbXMpXG5cbiAgICAgICAgICBjb25zdCBwcmVwYXJlID0gW1xuICAgICAgICAgICAgY3JlYXRlTWFuaWZlc3QoeyB0eXBlLCBzZXR1cCwgdmFsdWVzLCBwZWVyIH0pLnRoZW4ocGVlci53cml0ZSlcbiAgICAgICAgICBdXG5cbiAgICAgICAgICBpZiAodmFsdWVzLnNjb3BlID09PSAnbG9jYWwnKSB7XG4gICAgICAgICAgICBwcmVwYXJlLnB1c2goc29ja2V0LmdldCgnL2FwaS92MS9jb25uZWN0aW9uL2FkZHJlc3MnKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodmFsdWVzLmRldGFpbHMgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgcHJlcGFyZS5wdXNoKHNvY2tldC5nZXQoJy9hcGkvdjEvY29ubmVjdGlvbi9kZXRhaWxzJykpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgc3Bpbm5lciA9IG9yYSh7XG4gICAgICAgICAgICB0ZXh0OiAnQ3JlYXRpbmcgbWFuaWZlc3QnLFxuICAgICAgICAgICAgY29sb3I6ICdjeWFuJ1xuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBjb25zb2xlLmxvZygpXG4gICAgICAgICAgc3Bpbm5lci5zdGFydCgpXG5cbiAgICAgICAgICBQcm9taXNlLmFsbChwcmVwYXJlKS50aGVuKChbIHRvcnJlbnQsIC4uLnJlc3BvbnNlcyBdKSA9PiB7XG4gICAgICAgICAgICBzcGlubmVyLnN0b3AoKVxuICAgICAgICAgICAgc3Bpbm5lci5jbGVhcigpXG5cbiAgICAgICAgICAgIGNvbnN0IGFkZHJlc3MgPSB2YWx1ZXMuc2NvcGUgPT09ICdsb2NhbCcgJiYgcmVzcG9uc2VzWzBdXG4gICAgICAgICAgICBjb25zdCBkZXRhaWxzID0gdmFsdWVzLmRldGFpbHMgJiYgKGFkZHJlc3MgPyByZXNwb25zZXNbMV0gOiByZXNwb25zZXNbMF0pXG5cbiAgICAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSB7fVxuICAgICAgICAgICAgaWYgKGFkZHJlc3MpIHsgLy8gPT0gbG9jYWxcbiAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihjb25uZWN0aW9uLCB7XG4gICAgICAgICAgICAgICAgcmVtb3RlQWRkcmVzczogYWRkcmVzc1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihjb25uZWN0aW9uLCB7XG4gICAgICAgICAgICAgICAgbG9jYWxBZGRyZXNzOiBpcC5hZGRyZXNzKCksXG4gICAgICAgICAgICAgICAgZGV0YWlsc1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICB0eXBlOiAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgc2NvcGU6IHZhbHVlcy5zY29wZSxcbiAgICAgICAgICAgICAgbWFuaWZlc3Q6IHRvcnJlbnQuaW5mb0hhc2gsXG4gICAgICAgICAgICAgIGNvbm5lY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvY2tldC5zZW5kKCcvdGFza3MvZW50cmllcycsIG1lc3NhZ2UpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPT4nLCB0b3JyZW50LmluZm9IYXNoLCB0b3JyZW50Lm1hZ25ldFVSSSlcbiAgICAgICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAgICAgLy8gLSBvcGVuIHBlbmRpbmcgZGFzaGJvYXJkXG4gICAgICAgICAgICAgIC8vIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2gocmVqZWN0KVxuXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gICAgLmNhdGNoKDo6Y29uc29sZS5lcnJvcilcbiAgfVxufVxuXG4vKipcbiAqIFtnZXRUYXNrIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBzb2NrZXQgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHRhc2tUeXBlIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRUYXNrIChzb2NrZXQsIHRhc2tUeXBlKSB7XG4gIHJldHVybiBzb2NrZXQub25jZSgnL3Rhc2tzL3R5cGVzJykudGhlbigodHlwZUxpc3QpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGlmICh0YXNrVHlwZSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSh0YXNrVHlwZSlcbiAgICAgIH1cbiAgICAgIHByb21wdChbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAndHlwZScsXG4gICAgICAgICAgbWVzc2FnZTogJ1doYXQgdHlwZSBvZiB0YXNrIHNob3VsZCBiZSBzb2x2ZWQgPycsXG4gICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgIGNob2ljZXM6IHR5cGVMaXN0Lm1hcCgodHlwZSkgPT4gdHlwZS50eXBlKVxuICAgICAgICB9XG4gICAgICBdLCAoeyB0eXBlIH0pID0+IHJlc29sdmUodHlwZSkpXG4gICAgfSlcbiAgICAudGhlbigodHlwZSkgPT4gdHlwZUxpc3QuZmluZCgoZW50cnkpID0+IGVudHJ5LnR5cGUgPT09IHR5cGUpKVxuICB9KVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
