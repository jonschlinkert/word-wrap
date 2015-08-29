/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 *
 * Adapted from http://james.padolsey.com/javascript/wordwrap-for-javascript/
 * @attribution
 */

module.exports = function(str, options) {
  options = options || {};
  if (str == null) {
    return str;
  }

  var width = options.width || 50;
  var indent = (typeof options.indent === 'string')
    ? options.indent
    : '  ';

  var newline = options.newline || '\n' + indent;

  var escape = options.escape || function(str){return str;};

  var re = new RegExp('.{1,' + width + '}(\\s+|$)|\\S+?(\\s+|$)', 'g');

  if (options.cut) {
    re = new RegExp('.{1,' + width + '}', 'g');
  }

  var lines = str.match(re) || [];
  var res = indent + lines.map(function(str){return escape(str)}).join(newline);

  if (options.trim === true) {
    res = res.replace(/[ \t]*$/gm, '');
  }
  return res;
};
