'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * # Parse
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * Parse and process inputs
                                                                                                                                                                                                                                                                   */

exports.default = parse;

var _fs = require('fs');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _visual = require('./utilities/visual');

var _package = require('../package.json');

var pkg = _interopRequireWildcard(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = (0, _fs.readdirSync)(__dirname + '/commands').map(function (file) {
	return require('./commands/' + file);
});

var invalid = '';

/**
 * [parse description]
 */
function parse() {
	var instances = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	return new Promise(function (resolve, reject) {

		var context = commands.reduce(function (context, _ref) {
			var command = _ref.command;
			var action = _ref.action;

			context[command.match(/^(\w+)\s?/)[1]] = action;
			return context;
		}, Object.create(null));

		_commander2.default.version(pkg.version).usage('<command> [parameter]').arguments('<command> [parameter]').action(function (command) {
			return invalid = command;
		});

		commands.forEach(function (_ref2) {
			var command = _ref2.command;
			var alias = _ref2.alias;
			var description = _ref2.description;
			var options = _ref2.options;
			var action = _ref2.action;

			var routine = _commander2.default.command(command).description(description);
			if (alias) {
				alias.forEach(routine.alias.bind(routine));
			}
			if (options) {
				Object.keys(options).forEach(function (name) {
					var _options$name = options[name];
					var flags = _options$name.flags;
					var description = _options$name.description;
					var transform = _options$name.transform;
					var defaultValue = _options$name.defaultValue;

					routine.option(flags, description, transform, defaultValue);
				});
			}
			routine.action(function (param, args) {
				var options = Object.create(null);
				if (routine.options && Array.isArray(routine.options)) {
					routine.options.forEach(function (option) {
						var long = option.long.replace('--', '');
						options[long] = routine[long];
					});
				}
				resolve(action.call(context, _extends({ param: param, args: args, options: options }, instances)));
			});
		});

		// default
		if (!process.argv.slice(2).length) {
			(0, _visual.showLogo)();
			_commander2.default.outputHelp();
			return resolve();
		}

		_commander2.default.parse(process.argv);

		if (invalid.length > 0) {
			return resolve('Invalid command "' + invalid + '" used!');
		}
	});
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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VUFBTyw4QkFBNEIsbUJBQTVCLENBQVAsQ0FEdUI7R0FBeEI7RUEvQ2tCLENBQW5CLENBRDhDO0NBQWhDIiwiZmlsZSI6InBhcnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIFBhcnNlXG4gKlxuICogUGFyc2UgYW5kIHByb2Nlc3MgaW5wdXRzXG4gKi9cblxuaW1wb3J0IHsgcmVhZGRpclN5bmMgfSBmcm9tICdmcydcbmltcG9ydCBwcm9ncmFtIGZyb20gJ2NvbW1hbmRlcidcblxuaW1wb3J0IHsgc2hvd0xvZ28gfSBmcm9tICcuL3V0aWxpdGllcy92aXN1YWwnXG5pbXBvcnQgKiBhcyBwa2cgZnJvbSAnLi4vcGFja2FnZS5qc29uJ1xuXG5jb25zdCBjb21tYW5kcyA9IHJlYWRkaXJTeW5jKGAke19fZGlybmFtZX0vY29tbWFuZHNgKS5tYXAoKGZpbGUpID0+IHJlcXVpcmUoYC4vY29tbWFuZHMvJHtmaWxlfWApKVxuXG52YXIgaW52YWxpZCA9ICcnXG5cbi8qKlxuICogW3BhcnNlIGRlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZSAoaW5zdGFuY2VzID0ge30pIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuXHRcdGNvbnN0IGNvbnRleHQgPSBjb21tYW5kcy5yZWR1Y2UoKGNvbnRleHQsIHsgY29tbWFuZCwgYWN0aW9uIH0pID0+IHtcblx0XHRcdGNvbnRleHRbY29tbWFuZC5tYXRjaCgvXihcXHcrKVxccz8vKVsxXV0gPSBhY3Rpb25cblx0XHRcdHJldHVybiBjb250ZXh0XG5cdFx0fSwgT2JqZWN0LmNyZWF0ZShudWxsKSlcblxuXHRcdHByb2dyYW1cblx0XHRcdC52ZXJzaW9uKHBrZy52ZXJzaW9uKVxuXHRcdFx0LnVzYWdlKCc8Y29tbWFuZD4gW3BhcmFtZXRlcl0nKVxuXHRcdFx0LmFyZ3VtZW50cygnPGNvbW1hbmQ+IFtwYXJhbWV0ZXJdJylcblx0XHRcdC5hY3Rpb24oKGNvbW1hbmQpID0+IGludmFsaWQgPSBjb21tYW5kKVxuXG5cdFx0Y29tbWFuZHMuZm9yRWFjaCgoeyBjb21tYW5kLCBhbGlhcywgZGVzY3JpcHRpb24sIG9wdGlvbnMsIGFjdGlvbiB9KSA9PiB7XG5cdFx0XHRjb25zdCByb3V0aW5lID0gcHJvZ3JhbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5jb21tYW5kKGNvbW1hbmQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKVxuXHRcdFx0aWYgKGFsaWFzKSB7XG5cdFx0XHRcdGFsaWFzLmZvckVhY2goOjpyb3V0aW5lLmFsaWFzKVxuXHRcdFx0fVxuXHRcdFx0aWYgKG9wdGlvbnMpIHtcblx0XHRcdFx0T2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaCgobmFtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHsgZmxhZ3MsIGRlc2NyaXB0aW9uLCB0cmFuc2Zvcm0sIGRlZmF1bHRWYWx1ZSB9ID0gb3B0aW9uc1tuYW1lXVxuXHRcdFx0XHRcdHJvdXRpbmUub3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbiwgdHJhbnNmb3JtLCBkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRyb3V0aW5lLmFjdGlvbigocGFyYW0sIGFyZ3MpID0+IHtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdFx0aWYgKHJvdXRpbmUub3B0aW9ucyAmJiBBcnJheS5pc0FycmF5KHJvdXRpbmUub3B0aW9ucykpIHtcblx0XHRcdFx0XHRyb3V0aW5lLm9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBsb25nID0gb3B0aW9uLmxvbmcucmVwbGFjZSgnLS0nLCAnJylcblx0XHRcdFx0XHRcdG9wdGlvbnNbbG9uZ10gPSByb3V0aW5lW2xvbmddXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXNvbHZlKGFjdGlvbi5jYWxsKGNvbnRleHQsIHsgcGFyYW0sIGFyZ3MsIG9wdGlvbnMsIC4uLmluc3RhbmNlcyB9KSlcblx0XHRcdH0pXG5cdFx0fSlcblxuXHRcdC8vIGRlZmF1bHRcblx0XHRpZiAoIXByb2Nlc3MuYXJndi5zbGljZSgyKS5sZW5ndGgpIHtcblx0XHRcdHNob3dMb2dvKClcblx0XHRcdHByb2dyYW0ub3V0cHV0SGVscCgpXG5cdFx0XHRyZXR1cm4gcmVzb2x2ZSgpXG5cdFx0fVxuXG5cdFx0cHJvZ3JhbS5wYXJzZShwcm9jZXNzLmFyZ3YpXG5cblx0XHRpZiAoaW52YWxpZC5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gcmVzb2x2ZShgSW52YWxpZCBjb21tYW5kIFwiJHtpbnZhbGlkfVwiIHVzZWQhYClcblx0XHR9XG5cdH0pXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
