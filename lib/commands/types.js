'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _network = require('../utilities/network');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * # Command: Tasks
 *
 *
 */

exports.default = {
  command: 'types',
  alias: ['tasks', 'list'],
  description: 'List the types of tasks which can be processed',
  action: function action(_ref) {
    var socket = _ref.socket;

    return socket.once('/tasks/types').then(function (types) {
      return types.map(function (type) {
        return _chalk2.default.yellow(type.name) + ': ' + type.text;
      });
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1hbmRzL3R5cGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BOztBQUNBOzs7Ozs7Ozs7Ozs7a0JBRWU7QUFDYixXQUFTLE9BQVQ7QUFDQSxTQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBUDtBQUNBLGVBQWEsZ0RBQWI7QUFDQSxnQ0FBb0I7UUFBVixxQkFBVTs7QUFDbEIsV0FBTyxPQUFPLElBQVAsQ0FBWSxjQUFaLEVBQTRCLElBQTVCLENBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQ2pELGFBQU8sTUFBTSxHQUFOLENBQVUsVUFBQyxJQUFEO2VBQWEsZ0JBQU0sTUFBTixDQUFhLEtBQUssSUFBTCxXQUFlLEtBQUssSUFBTDtPQUF6QyxDQUFqQixDQURpRDtLQUFYLENBQXhDLENBRGtCO0dBSlAiLCJmaWxlIjoiY29tbWFuZHMvdHlwZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgQ29tbWFuZDogVGFza3NcbiAqXG4gKlxuICovXG5cbmltcG9ydCB7IFNvY2tldCB9IGZyb20gJy4uL3V0aWxpdGllcy9uZXR3b3JrJ1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbW1hbmQ6ICd0eXBlcycsXG4gIGFsaWFzOiBbJ3Rhc2tzJywgJ2xpc3QnXSxcbiAgZGVzY3JpcHRpb246ICdMaXN0IHRoZSB0eXBlcyBvZiB0YXNrcyB3aGljaCBjYW4gYmUgcHJvY2Vzc2VkJyxcbiAgYWN0aW9uICh7IHNvY2tldCB9KSB7XG4gICAgcmV0dXJuIHNvY2tldC5vbmNlKCcvdGFza3MvdHlwZXMnKS50aGVuKCh0eXBlcykgPT4ge1xuICAgICAgcmV0dXJuIHR5cGVzLm1hcCgodHlwZSkgPT4gYCR7Y2hhbGsueWVsbG93KHR5cGUubmFtZSl9OiAke3R5cGUudGV4dH1gKVxuICAgIH0pXG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
