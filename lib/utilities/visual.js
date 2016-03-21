'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['            _              '], ['            _              ']),
    _templateObject2 = _taggedTemplateLiteral(['           | |_            '], ['           | |_            ']),
    _templateObject3 = _taggedTemplateLiteral([' _   _  ___| (_) __ _   __ '], [' _   _  ___| (_) __ _   __ ']),
    _templateObject4 = _taggedTemplateLiteral(['| | | |  _   | |/ _\' | / / '], ['| | | |  _   | |/ _\' | / / ']),
    _templateObject5 = _taggedTemplateLiteral(['| |_| | |_|  | | (_| |_  '], ['| |_| | |_|  | | (_| |_\\ \\ ']),
    _templateObject6 = _taggedTemplateLiteral(['_____|______|_|__,_|___/ '], ['\\_____|______|_|\\__,_|___/ ']);

exports.showLogo = showLogo;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } /**
                                                                                                                                                   * # Utility: Visual
                                                                                                                                                   *
                                                                                                                                                   * Helper functions for graphical representations
                                                                                                                                                   */

/**
 * Print logo
 */
function showLogo() {
  var logo = [aa(_templateObject), aa(_templateObject2), aa(_templateObject3), aa(_templateObject4), aa(_templateObject5), aa(_templateObject6)];
  logo.forEach(function (line) {
    return console.log('\t' + _chalk2.default.red.bold(line));
  });
}

/**
 * ascii art formatter
 * @param  {[type]} strings   [description]
 * @param  {[type]} ...values [description]
 * @return {[type]}           [description]
 */
function aa(strings) {
  var raw = [].slice.call(strings.raw, 0);
  return raw.join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy92aXN1YWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztRQVdnQjs7QUFMaEI7Ozs7Ozs7Ozs7Ozs7OztBQUtPLFNBQVMsUUFBVCxHQUFtQjtBQUN4QixNQUFNLE9BQU8sQ0FDWCxtQkFEVyxFQUVYLG9CQUZXLEVBR1gsb0JBSFcsRUFJWCxvQkFKVyxFQUtYLG9CQUxXLEVBTVgsb0JBTlcsQ0FBUCxDQURrQjtBQVN4QixPQUFLLE9BQUwsQ0FBYSxVQUFDLElBQUQ7V0FBVSxRQUFRLEdBQVIsUUFBaUIsZ0JBQU0sR0FBTixDQUFVLElBQVYsQ0FBZSxJQUFmLENBQWpCO0dBQVYsQ0FBYixDQVR3QjtDQUFuQjs7Ozs7Ozs7QUFrQlAsU0FBUyxFQUFULENBQWEsT0FBYixFQUFpQztBQUMvQixNQUFNLE1BQU0sR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLFFBQVEsR0FBUixFQUFhLENBQTNCLENBQU4sQ0FEeUI7QUFFL0IsU0FBTyxJQUFJLElBQUosQ0FBUyxFQUFULENBQVAsQ0FGK0I7Q0FBakMiLCJmaWxlIjoidXRpbGl0aWVzL3Zpc3VhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBVdGlsaXR5OiBWaXN1YWxcbiAqXG4gKiBIZWxwZXIgZnVuY3Rpb25zIGZvciBncmFwaGljYWwgcmVwcmVzZW50YXRpb25zXG4gKi9cblxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJ1xuXG4vKipcbiAqIFByaW50IGxvZ29cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dMb2dvKCl7XG4gIGNvbnN0IGxvZ28gPSBbXG4gICAgYWFgICAgICAgICAgICAgXyAgICAgICAgICAgICAgYCxcbiAgICBhYWAgICAgICAgICAgIHwgfF8gICAgICAgICAgICBgLFxuICAgIGFhYCBfICAgXyAgX19ffCAoXykgX18gXyAgIF9fIGAsXG4gICAgYWFgfCB8IHwgfCAgXyAgIHwgfC8gXycgfCAvIC8gYCxcbiAgICBhYWB8IHxffCB8IHxffCAgfCB8IChffCB8X1xcIFxcIGAsXG4gICAgYWFgXFxfX19fX3xfX19fX198X3xcXF9fLF98X19fLyBgXG4gIF1cbiAgbG9nby5mb3JFYWNoKChsaW5lKSA9PiBjb25zb2xlLmxvZyhgXFx0JHtjaGFsay5yZWQuYm9sZChsaW5lKX1gKSlcbn1cblxuLyoqXG4gKiBhc2NpaSBhcnQgZm9ybWF0dGVyXG4gKiBAcGFyYW0gIHtbdHlwZV19IHN0cmluZ3MgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IC4uLnZhbHVlcyBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGFhIChzdHJpbmdzLCAuLi52YWx1ZXMpIHtcbiAgY29uc3QgcmF3ID0gW10uc2xpY2UuY2FsbChzdHJpbmdzLnJhdywgMClcbiAgcmV0dXJuIHJhdy5qb2luKCcnKVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
