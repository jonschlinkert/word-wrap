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

  var regexString = '.{1,' + width + '}';
  if (options.cut !== true) {
    regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  }

  var re = new RegExp(regexString, 'g');
  var lines = str.match(re) || [];
  // The regex split will take whitespace from the start of next line,
  // and put it on the end of the previous one. Need to move that back.
  var extraWhitespace = '';
  var result = indent + lines.map(function(line) {
    var fullLine = extraWhitespace + line;
    var match = line.match(/^(.+)\n([^\S\n]*)$/s);
    if (match) {
      fullLine = extraWhitespace + match[1];
      extraWhitespace = match[2];
    } else {
      extraWhitespace = '';
    }
    return escape(fullLine);
  }).join(newline);

  if (options.trim === true) {
    result = trimTabAndSpaces(result);
  }
  return result;
};

function identity(str) {
  return str;
}
