'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * # Index
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Define initial values
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _network = require('./utilities/network');

var _package = require('../package.json');

var pkg = _interopRequireWildcard(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notifier = (0, _updateNotifier2.default)({ pkg: pkg, updateCheckInterval: 1000 * 60 * 60 * 1 });

if (notifier.update) {
  console.log('Update available: ' + notifier.update.current + ' -> ' + notifier.update.latest);
  console.log('Run "npm install -g ' + pkg.name + '" to update!');
}

Promise.all([
// DEVELOPMENT: 'ws://localhost:8000'
(0, _network.createSocket)('ws://udias.online'), (0, _network.createPeer)()]).then(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var socket = _ref2[0];
  var peer = _ref2[1];
  return (0, _parse2.default)({ socket: socket, peer: peer });
}).then(function (output) {
  if (output) {
    if (!Array.isArray(output)) {
      output = [output];
    }
    output.forEach(function (o) {
      return console.log(o);
    });
  }
  process.exit();
}).catch(function (error) {
  console.error(error);
  process.exit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOztBQUVBOztJQUFZOzs7Ozs7QUFFWixJQUFNLFdBQVcsOEJBQWUsRUFBRSxRQUFGLEVBQU8scUJBQXFCLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsQ0FBakIsRUFBM0MsQ0FBWDs7QUFFTixJQUFJLFNBQVMsTUFBVCxFQUFpQjtBQUNuQixVQUFRLEdBQVIsd0JBQWlDLFNBQVMsTUFBVCxDQUFnQixPQUFoQixZQUE4QixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsQ0FBL0QsQ0FEbUI7QUFFbkIsVUFBUSxHQUFSLDBCQUFtQyxJQUFJLElBQUosaUJBQW5DLEVBRm1CO0NBQXJCOztBQUtBLFFBQVEsR0FBUixDQUFZOztBQUVWLDJCQUFhLG1CQUFiLENBRlUsRUFHViwwQkFIVSxDQUFaLEVBS0MsSUFMRCxDQUtNOzs7TUFBRztNQUFRO1NBQVcscUJBQU0sRUFBRSxjQUFGLEVBQVUsVUFBVixFQUFOO0NBQXRCLENBTE4sQ0FNQyxJQU5ELENBTU0sVUFBQyxNQUFELEVBQVk7QUFDaEIsTUFBSSxNQUFKLEVBQVk7QUFDVixRQUFJLENBQUMsTUFBTSxPQUFOLENBQWMsTUFBZCxDQUFELEVBQXdCO0FBQzFCLGVBQVMsQ0FBQyxNQUFELENBQVQsQ0FEMEI7S0FBNUI7QUFHQSxXQUFPLE9BQVAsQ0FBZSxVQUFDLENBQUQ7YUFBTyxRQUFRLEdBQVIsQ0FBWSxDQUFaO0tBQVAsQ0FBZixDQUpVO0dBQVo7QUFNQSxVQUFRLElBQVIsR0FQZ0I7Q0FBWixDQU5OLENBZUMsS0FmRCxDQWVPLFVBQUMsS0FBRCxFQUFXO0FBQ2hCLFVBQVEsS0FBUixDQUFjLEtBQWQsRUFEZ0I7QUFFaEIsVUFBUSxJQUFSLEdBRmdCO0NBQVgsQ0FmUCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBJbmRleFxuICpcbiAqIERlZmluZSBpbml0aWFsIHZhbHVlc1xuICovXG5cbmltcG9ydCB1cGRhdGVOb3RpZmllciBmcm9tICd1cGRhdGUtbm90aWZpZXInXG5pbXBvcnQgcGFyc2UgZnJvbSAnLi9wYXJzZSdcbmltcG9ydCB7IGNyZWF0ZVNvY2tldCwgY3JlYXRlUGVlciB9IGZyb20gJy4vdXRpbGl0aWVzL25ldHdvcmsnXG5cbmltcG9ydCAqIGFzIHBrZyBmcm9tICcuLi9wYWNrYWdlLmpzb24nXG5cbmNvbnN0IG5vdGlmaWVyID0gdXBkYXRlTm90aWZpZXIoeyBwa2csIHVwZGF0ZUNoZWNrSW50ZXJ2YWw6IDEwMDAgKiA2MCAqIDYwICogMSB9KVxuXG5pZiAobm90aWZpZXIudXBkYXRlKSB7XG4gIGNvbnNvbGUubG9nKGBVcGRhdGUgYXZhaWxhYmxlOiAke25vdGlmaWVyLnVwZGF0ZS5jdXJyZW50fSAtPiAke25vdGlmaWVyLnVwZGF0ZS5sYXRlc3R9YClcbiAgY29uc29sZS5sb2coYFJ1biBcIm5wbSBpbnN0YWxsIC1nICR7cGtnLm5hbWV9XCIgdG8gdXBkYXRlIWApXG59XG5cblByb21pc2UuYWxsKFtcbiAgLy8gREVWRUxPUE1FTlQ6ICd3czovL2xvY2FsaG9zdDo4MDAwJ1xuICBjcmVhdGVTb2NrZXQoJ3dzOi8vdWRpYXMub25saW5lJyksXG4gIGNyZWF0ZVBlZXIoKVxuXSlcbi50aGVuKChbIHNvY2tldCwgcGVlciBdKSA9PiBwYXJzZSh7IHNvY2tldCwgcGVlciB9KSlcbi50aGVuKChvdXRwdXQpID0+IHtcbiAgaWYgKG91dHB1dCkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShvdXRwdXQpKSB7XG4gICAgICBvdXRwdXQgPSBbb3V0cHV0XVxuICAgIH1cbiAgICBvdXRwdXQuZm9yRWFjaCgobykgPT4gY29uc29sZS5sb2cobykpXG4gIH1cbiAgcHJvY2Vzcy5leGl0KClcbn0pXG4uY2F0Y2goKGVycm9yKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIHByb2Nlc3MuZXhpdCgpXG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
