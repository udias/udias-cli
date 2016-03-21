/**
 * # Utility: Visual
 *
 * Helper functions for graphical representations
 */

import chalk from 'chalk'

/**
 * Print logo
 */
export function showLogo(){
  const logo = [
    aa`            _              `,
    aa`           | |_            `,
    aa` _   _  ___| (_) __ _   __ `,
    aa`| | | |  _   | |/ _' | / / `,
    aa`| |_| | |_|  | | (_| |_\ \ `,
    aa`\_____|______|_|\__,_|___/ `
  ]
  logo.forEach((line) => console.log(`\t${chalk.red.bold(line)}`))
}

/**
 * ascii art formatter
 * @param  {[type]} strings   [description]
 * @param  {[type]} ...values [description]
 * @return {[type]}           [description]
 */
function aa (strings, ...values) {
  const raw = [].slice.call(strings.raw, 0)
  return raw.join('')
}
