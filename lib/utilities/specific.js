'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * # Utility: Specific
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Common tasks for the application
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

exports.createManifest = createManifest;
exports.executeProcessing = executeProcessing;

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _eval2 = require('eval');

var _eval3 = _interopRequireDefault(_eval2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DEVELOPMENT:'http://localhost:8000'
var serverUrl = 'http://udias.online';

// processing blocks of task
var INSTRUCTIONS = {
  remote: {
    data: function data(_ref) {
      var manifest = _ref.manifest;
      var value = _ref.value;
      var peer = _ref.peer;

      return new Promise(function (resolve, reject) {
        peer.seed(value).then(function (torrent) {
          manifest.data = torrent.infoHash;
          return resolve(manifest);
        });
      });
    },
    params: function params(_ref2) {
      var manifest = _ref2.manifest;
      var value = _ref2.value;
      var field = _ref2.field;

      return new Promise(function (resolve) {
        if (!manifest.params) {
          manifest.params = {};
        }
        manifest.params[field.name] = value;
        return resolve(manifest);
      });
    }
  }
};

/**
 * Apply instructions to define a manifest object
 */
function createManifest(_ref3) {
  var type = _ref3.type;
  var setup = _ref3.setup;
  var values = _ref3.values;
  var peer = _ref3.peer;


  var manifest = {
    type: type
  };

  var instructions = setup.map(function (field) {
    var _field$role$split = field.role.split('-');

    var _field$role$split2 = _slicedToArray(_field$role$split, 2);

    var environment = _field$role$split2[0];
    var key = _field$role$split2[1];

    var instruction = INSTRUCTIONS[environment][key];
    return instruction({ manifest: manifest, value: values[field.name], field: field, peer: peer });
  });

  return Promise.all(instructions).then(function () {
    return manifest;
  });
}

/**
 * @param  {[type]} manifest [description]
 * @return {[type]}          [description]
 */
function executeProcessing(_ref4) {
  var manifest = _ref4.manifest;
  var peer = _ref4.peer;

  var loader = [(0, _got2.default)(serverUrl + '/tasks/' + manifest.type + '.node.js')];
  if (manifest.data) {
    loader.push(peer.read(manifest.data));
  }
  return Promise.all(loader).then(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2);

    var response = _ref6[0];
    var data = _ref6[1];

    return (0, _eval3.default)(response.body, true).work(data);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy9zcGVjaWZpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7UUFzQ2dCO1FBbUJBOztBQW5EaEI7Ozs7QUFDQTs7Ozs7OztBQUdBLElBQU0sWUFBWSxxQkFBWjs7O0FBR04sSUFBTSxlQUFlO0FBQ25CLFVBQVE7QUFDTiw4QkFBaUM7VUFBekIseUJBQXlCO1VBQWYsbUJBQWU7VUFBUixpQkFBUTs7QUFDL0IsYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLGFBQUssSUFBTCxDQUFVLEtBQVYsRUFBaUIsSUFBakIsQ0FBc0IsVUFBQyxPQUFELEVBQWE7QUFDakMsbUJBQVMsSUFBVCxHQUFnQixRQUFRLFFBQVIsQ0FEaUI7QUFFakMsaUJBQU8sUUFBUSxRQUFSLENBQVAsQ0FGaUM7U0FBYixDQUF0QixDQURzQztPQUFyQixDQUFuQixDQUQrQjtLQUQzQjtBQVNQLG1DQUFvQztVQUExQiwwQkFBMEI7VUFBaEIsb0JBQWdCO1VBQVQsb0JBQVM7O0FBQ2xDLGFBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQWE7QUFDOUIsWUFBSSxDQUFDLFNBQVMsTUFBVCxFQUFpQjtBQUNwQixtQkFBUyxNQUFULEdBQWtCLEVBQWxCLENBRG9CO1NBQXRCO0FBR0EsaUJBQVMsTUFBVCxDQUFnQixNQUFNLElBQU4sQ0FBaEIsR0FBOEIsS0FBOUIsQ0FKOEI7QUFLOUIsZUFBTyxRQUFRLFFBQVIsQ0FBUCxDQUw4QjtPQUFiLENBQW5CLENBRGtDO0tBVDdCO0dBQVI7Q0FESTs7Ozs7QUF5QkMsU0FBUyxjQUFULFFBQXdEO01BQTdCLGtCQUE2QjtNQUF2QixvQkFBdUI7TUFBaEIsc0JBQWdCO01BQVIsa0JBQVE7OztBQUU3RCxNQUFNLFdBQVc7QUFDZixjQURlO0dBQVgsQ0FGdUQ7O0FBTTdELE1BQU0sZUFBZSxNQUFNLEdBQU4sQ0FBVSxVQUFDLEtBQUQsRUFBVzs0QkFDWCxNQUFNLElBQU4sQ0FBVyxLQUFYLENBQWlCLEdBQWpCLEVBRFc7Ozs7UUFDaEMsb0NBRGdDO1FBQ25CLDRCQURtQjs7QUFFeEMsUUFBTSxjQUFjLGFBQWEsV0FBYixFQUEwQixHQUExQixDQUFkLENBRmtDO0FBR3hDLFdBQU8sWUFBWSxFQUFFLGtCQUFGLEVBQVksT0FBTyxPQUFPLE1BQU0sSUFBTixDQUFkLEVBQTJCLFlBQXZDLEVBQThDLFVBQTlDLEVBQVosQ0FBUCxDQUh3QztHQUFYLENBQXpCLENBTnVEOztBQVk3RCxTQUFPLFFBQVEsR0FBUixDQUFZLFlBQVosRUFBMEIsSUFBMUIsQ0FBK0I7V0FBTTtHQUFOLENBQXRDLENBWjZEO0NBQXhEOzs7Ozs7QUFtQkEsU0FBUyxpQkFBVCxRQUFnRDtNQUFsQiwwQkFBa0I7TUFBUixrQkFBUTs7QUFDckQsTUFBTSxTQUFTLENBQ2IsbUJBQVcsd0JBQW1CLFNBQVMsSUFBVCxhQUE5QixDQURhLENBQVQsQ0FEK0M7QUFJckQsTUFBSSxTQUFTLElBQVQsRUFBZTtBQUNqQixXQUFPLElBQVAsQ0FBWSxLQUFLLElBQUwsQ0FBVSxTQUFTLElBQVQsQ0FBdEIsRUFEaUI7R0FBbkI7QUFHQSxTQUFPLFFBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsSUFBcEIsQ0FBeUIsaUJBQXNCOzs7UUFBcEIsb0JBQW9CO1FBQVYsZ0JBQVU7O0FBQ3BELFdBQU8sb0JBQU0sU0FBUyxJQUFULEVBQWUsSUFBckIsRUFBMkIsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FBUCxDQURvRDtHQUF0QixDQUFoQyxDQVBxRDtDQUFoRCIsImZpbGUiOiJ1dGlsaXRpZXMvc3BlY2lmaWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgVXRpbGl0eTogU3BlY2lmaWNcbiAqXG4gKiBDb21tb24gdGFza3MgZm9yIHRoZSBhcHBsaWNhdGlvblxuICovXG5cbmltcG9ydCByZXF1ZXN0IGZyb20gJ2dvdCdcbmltcG9ydCBfZXZhbCBmcm9tICdldmFsJ1xuXG4vLyBERVZFTE9QTUVOVDonaHR0cDovL2xvY2FsaG9zdDo4MDAwJ1xuY29uc3Qgc2VydmVyVXJsID0gJ2h0dHA6Ly91ZGlhcy5vbmxpbmUnXG5cbi8vIHByb2Nlc3NpbmcgYmxvY2tzIG9mIHRhc2tcbmNvbnN0IElOU1RSVUNUSU9OUyA9IHtcbiAgcmVtb3RlOiB7XG4gICAgZGF0YSAoeyBtYW5pZmVzdCwgdmFsdWUsIHBlZXIgfSkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcGVlci5zZWVkKHZhbHVlKS50aGVuKCh0b3JyZW50KSA9PiB7XG4gICAgICAgICAgbWFuaWZlc3QuZGF0YSA9IHRvcnJlbnQuaW5mb0hhc2hcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShtYW5pZmVzdClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICB9LFxuICAgcGFyYW1zICh7IG1hbmlmZXN0LCB2YWx1ZSwgZmllbGQgfSkge1xuICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICBpZiAoIW1hbmlmZXN0LnBhcmFtcykge1xuICAgICAgICAgbWFuaWZlc3QucGFyYW1zID0ge31cbiAgICAgICB9XG4gICAgICAgbWFuaWZlc3QucGFyYW1zW2ZpZWxkLm5hbWVdID0gdmFsdWVcbiAgICAgICByZXR1cm4gcmVzb2x2ZShtYW5pZmVzdClcbiAgICAgfSlcbiAgIH1cbiB9XG59XG5cbi8qKlxuICogQXBwbHkgaW5zdHJ1Y3Rpb25zIHRvIGRlZmluZSBhIG1hbmlmZXN0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWFuaWZlc3QgKHsgdHlwZSwgc2V0dXAsIHZhbHVlcywgcGVlciB9KSB7XG5cbiAgY29uc3QgbWFuaWZlc3QgPSB7XG4gICAgdHlwZVxuICB9XG5cbiAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gc2V0dXAubWFwKChmaWVsZCkgPT4ge1xuICAgIGNvbnN0IFsgZW52aXJvbm1lbnQsIGtleSBdID0gZmllbGQucm9sZS5zcGxpdCgnLScpXG4gICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSBJTlNUUlVDVElPTlNbZW52aXJvbm1lbnRdW2tleV1cbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb24oeyBtYW5pZmVzdCwgdmFsdWU6IHZhbHVlc1tmaWVsZC5uYW1lXSwgZmllbGQsIHBlZXIgfSlcbiAgfSlcblxuICByZXR1cm4gUHJvbWlzZS5hbGwoaW5zdHJ1Y3Rpb25zKS50aGVuKCgpID0+IG1hbmlmZXN0KVxufVxuXG4vKipcbiAqIEBwYXJhbSAge1t0eXBlXX0gbWFuaWZlc3QgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlUHJvY2Vzc2luZyAoeyBtYW5pZmVzdCwgcGVlciB9KSB7XG4gIGNvbnN0IGxvYWRlciA9IFtcbiAgICByZXF1ZXN0KGAke3NlcnZlclVybH0vdGFza3MvJHttYW5pZmVzdC50eXBlfS5ub2RlLmpzYClcbiAgXVxuICBpZiAobWFuaWZlc3QuZGF0YSkge1xuICAgIGxvYWRlci5wdXNoKHBlZXIucmVhZChtYW5pZmVzdC5kYXRhKSlcbiAgfVxuICByZXR1cm4gUHJvbWlzZS5hbGwobG9hZGVyKS50aGVuKChbcmVzcG9uc2UsIGRhdGFdKSA9PiB7XG4gICAgcmV0dXJuIF9ldmFsKHJlc3BvbnNlLmJvZHksIHRydWUpLndvcmsoZGF0YSlcbiAgfSlcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
