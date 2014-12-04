/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014, Jon Schlinkert, contributors.
 * Licensed under the MIT License
 *
 * Adapted from http://james.padolsey.com/javascript/wordwrap-for-javascript/
 */

module.exports = function(str, options) {
  options = options || {};
  if (str == null) {
    return str;
  }

  var width = options.width || 50;
  var indent = (typeof options.indent === 'undefined')
    ? '  '
    : options.indent;

  var newline = options.newline || '\n' + indent;

  var re = new RegExp('.{1,' + width + '}(\\s|$)|\\S+?(\\s|$)', 'g');
  var res = indent + str.match(re).join(newline);
  if (options.trim === true) {
    res = res.replace(/[ \t]*$/gm, '');
  }
  return res;
};
