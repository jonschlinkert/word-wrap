/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014-2023, Jon Schlinkert.
 * Released under the MIT License.
 */

function trimEnd(str) {
  let lastCharPos = str.length - 1;
  let lastChar = str[lastCharPos];
  while(lastChar === ' ' || lastChar === '\t') {
    lastChar = str[--lastCharPos];
  }
  return str.substring(0, lastCharPos + 1);
}

function trimTabAndSpaces(str) {
  const lines = str.split('\n');
  const trimmedLines = lines.map((line) => trimEnd(line));
  return trimmedLines.join('\n');
}

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
  var escape = typeof options.escape === 'function'
    ? options.escape
    : identity;

  // cut:true uses /.{1,width}/g, and `.` does not match newlines, so
  // embedded newlines would be dropped. Wrap each line independently.
  if (options.cut === true && str.indexOf('\n') !== -1) {
    var lineOpts = {};
    for (var key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        lineOpts[key] = options[key];
      }
    }
    // Avoid re-entering this branch on lines that contain no newlines.
    // (lines from split never contain \n)
    return str.split('\n').map(function(line) {
      return module.exports(line, lineOpts);
    }).join('\n');
  }

  var regexString = '.{1,' + width + '}';
  if (options.cut !== true) {
    regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  }

  var re = new RegExp(regexString, 'g');
  var lines = str.match(re) || [];
  var result = indent + lines.map(function(line) {
    if (line.slice(-1) === '\n') {
      line = line.slice(0, line.length - 1);
    }
    return escape(line);
  }).join(newline);

  if (options.trim === true) {
    result = trimTabAndSpaces(result);
  }
  return result;
};

function identity(str) {
  return str;
}
