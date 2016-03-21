/**
 * # Task: Source - Library
 *
 *
 */

import { emptyDirSync } from 'fs-extra'
import gulp from 'gulp'
const $ = require('gulp-load-plugins')()

/**
 *
 *
 * @param  {Object}  env -
 * @return {Promise}     -
 */
export default (env) => {
  return new Promise((resolve, reject) => {
    const MATCH_ALL = `${env.SRC}/**/*`
    const target = `${env.LIB}`
    emptyDirSync(target)
    transform(gulp.src(MATCH_ALL), target)
    .on('error', reject)
    .on('end', () => {
      if (__DEVELOPMENT__) {
        $.watch(MATCH_ALL, (file) => {
          transform(gulp.src(file.path, { base: `${env.SRC}` }), target)
          .on('end', () => console.log('[CHANGE]', $.util.colors.yellow(file.path)))
        })
      }
      return resolve()
    })
  })
}

/**
* Lazypipe alternative for re-usable code.
*
* @param  {Stream} stream -
* @param  {string} target -
* @return {Stream}        -
*/
function transform (stream, target) {
  return stream
  .pipe($.plumber(::console.error))
  .pipe($.sourcemaps.init())
    .pipe($.babel({/** see .babelrc **/}))
  .pipe($.sourcemaps.write())
  .pipe($.plumber.stop())
  .pipe(gulp.dest(target))
}
