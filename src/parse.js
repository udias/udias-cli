/**
 * # Parse
 *
 * Parse and process inputs
 */

import { readdirSync } from 'fs'
import program from 'commander'

import { showLogo } from './utilities/visual'
import * as pkg from '../package.json'

const commands = readdirSync(`${__dirname}/commands`).map((file) => require(`./commands/${file}`))

var invalid = ''

/**
 * [parse description]
 */
export default function parse (instances = {}) {
	return new Promise((resolve, reject) => {

		const context = commands.reduce((context, { command, action }) => {
			context[command.match(/^(\w+)\s?/)[1]] = action
			return context
		}, Object.create(null))

		program
			.version(pkg.version)
			.usage('<command> [parameter]')
			.arguments('<command> [parameter]')
			.action((command) => invalid = command)

		commands.forEach(({ command, alias, description, options, action }) => {
			const routine = program
											.command(command)
											.description(description)
			if (alias) {
				alias.forEach(::routine.alias)
			}
			if (options) {
				Object.keys(options).forEach((name) => {
					const { flags, description, transform, defaultValue } = options[name]
					routine.option(flags, description, transform, defaultValue)
				})
			}
			routine.action((param, args) => {
				const options = Object.create(null)
				if (routine.options && Array.isArray(routine.options)) {
					routine.options.forEach((option) => {
						const long = option.long.replace('--', '')
						options[long] = routine[long]
					})
				}
				resolve(action.call(context, { param, args, options, ...instances }))
			})
		})

		// default
		if (!process.argv.slice(2).length) {
			showLogo()
			program.outputHelp()
			return resolve()
		}

		program.parse(process.argv)

		if (invalid.length > 0) {
			return resolve(`Invalid command "${invalid}" used!`)
		}
	})
}
