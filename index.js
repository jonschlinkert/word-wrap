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

  function identity(str) {
    return str;
  };
  var escape = typeof options.escape === 'function'
    ? options.escape
    : identity;

  var re = new RegExp('.{1,' + width + '}(\\s+|$)|\\S+?(\\s+|$)', 'g')
    , wasCutMidWord = false;

  if (options.cut) {
    re = new RegExp('.{1,' + width + '}', 'g');
    // if the character right before the last line is not whitespace, then the
    //   line was cut mid-word.
    wasCutMidWord = !str.charAt(str.length - (str.length % width) - 1).match(/\s/);
  }

  var lines = str.match(re) || [];

  // Incompatible with cut because there's no easy way to determine whether
  //   the last line was cut mid-word
  if (options.amendOrphan === true) {
    lines = handleOrphan(lines, width, wasCutMidWord);
  }

  var res = indent + lines.map(escape).join(newline);

  if (options.trim === true) {
    res = res.replace(/[ \t]*$/gm, '');
  }
  return res;
};

function handleOrphan(lines, width, wasCutMidWord) {
  var len = lines.length
    // WS: word separator
    , WS = /\s+/
    , lastLine = lines[len - 1]
    , secondToLastLine = lines[len - 2]
    , orphanAdopter = getLastWord(secondToLastLine)
    , amendedLastLine = orphanAdopter + (wasCutMidWord ? '' : ' ') + lastLine;

  // we only want to handle orphans when:
  //  - there's more than one line,
  //  - the second to last line has more than one word
  //  - the last line has only a single word
  //  - the amended line would not pass width
  var shouldHandleOrphan = len > 1
    && secondToLastLine.trim()
      .split(WS)
      .length > 1
    &&  lastLine.trim()
      .split(WS)
      .length === 1
    && width >= amendedLastLine.length;

  if (shouldHandleOrphan) {
    // remove the last two elements from the array
    lines.splice(-2);

    // we need to remove trailing whitespace from the secondToLastLine in order
    //   to remove the orphanAdopter correctly
    secondToLastLine = removeTrailingSpace(secondToLastLine);

    // remove orphanAdopter
    secondToLastLine = secondToLastLine.slice(0, secondToLastLine.length - orphanAdopter.length);

    lines = lines.concat(secondToLastLine, amendedLastLine);
  }

  return lines;

  // helper functions
  function getLastWord(line) {
    var words = line.split(WS);
    // if the last element in the array is an empty string (resulting from the
    //   regex split), then we call pop again to get the word.
    return words.pop() || words.pop();
  }
  function removeTrailingSpace(str) {
    return str.replace(/^(.*?)[\s]*$/, '$1');
  }
}
