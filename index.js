/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014-2023, Jon Schlinkert.
 * Released under the MIT License.
 */

function trimEnd(str) {
  let lastCharPos = str.length - 1;
  let lastChar = str[lastCharPos];
  while (lastChar === ' ' || lastChar === '\t') {
    lastChar = str[--lastCharPos];
  }
  return str.substring(0, lastCharPos + 1);
}

function trimTabAndSpaces(str) {
  const lines = str.split('\n');
  const trimmedLines = lines.map((line) => trimEnd(line));
  return trimmedLines.join('\n');
}

function identity(str) {
  return str;
}

/**
 * Advance past a single ANSI/CSI/OSC escape sequence starting at `i`.
 * Returns the index after the sequence (or i+1 if not an escape).
 */
function skipAnsi(str, i) {
  var c = str.charCodeAt(i);
  if (c !== 0x1b && c !== 0x9b) {
    return i;
  }

  // CSI: ESC [ ... letter   or  0x9b ... letter
  if (c === 0x9b || (c === 0x1b && str[i + 1] === '[')) {
    i = (c === 0x9b) ? i + 1 : i + 2;
    while (i < str.length) {
      var ch = str[i++];
      if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) {
        break;
      }
    }
    return i;
  }

  // OSC: ESC ] ... BEL or ESC \
  if (c === 0x1b && str[i + 1] === ']') {
    i += 2;
    while (i < str.length) {
      if (str.charCodeAt(i) === 0x07) {
        return i + 1;
      }
      if (str.charCodeAt(i) === 0x1b && str[i + 1] === '\\') {
        return i + 2;
      }
      i++;
    }
    return i;
  }

  // Other ESC + one byte
  return Math.min(i + 2, str.length);
}

function hasAnsi(str) {
  return str.indexOf('\u001b') !== -1 || str.indexOf('\u009b') !== -1;
}

/**
 * Wrap using visible (non-ANSI) width so colour codes do not inflate the count.
 */
function wrapAnsiAware(str, width, cut) {
  var lines = [];
  var line = '';
  var visible = 0;
  var i = 0;
  var lastBreakPos = -1; // index in `line` of last whitespace break candidate
  var lastBreakVisible = 0;

  function pushLine(content) {
    lines.push(content);
    line = '';
    visible = 0;
    lastBreakPos = -1;
    lastBreakVisible = 0;
  }

  while (i < str.length) {
    var start = i;
    var next = skipAnsi(str, i);
    if (next > i) {
      // ANSI: zero visible width, keep in place
      line += str.slice(i, next);
      i = next;
      continue;
    }

    var ch = str[i];
    if (ch === '\n') {
      pushLine(line);
      i++;
      continue;
    }

    var isSpace = ch === ' ' || ch === '\t' || ch === '\u200B';
    line += ch;
    visible++;
    i++;

    if (isSpace) {
      lastBreakPos = line.length;
      lastBreakVisible = visible;
    }

    if (visible > width) {
      if (cut === true || lastBreakPos === -1) {
        // Hard cut: keep current char on next line
        var overflow = line.slice(-1);
        var kept = line.slice(0, -1);
        // trim trailing spaces on kept
        pushLine(kept);
        if (overflow !== ' ' && overflow !== '\t') {
          line = overflow;
          visible = 1;
        }
      } else {
        var head = line.slice(0, lastBreakPos);
        var tail = line.slice(lastBreakPos);
        pushLine(head);
        // drop leading break whitespace from next line (except ZWSP keep?)
        var t = 0;
        while (t < tail.length && (tail[t] === ' ' || tail[t] === '\t')) {
          t++;
        }
        // preserve ANSI that was between break and text? already in tail
        line = tail.slice(t);
        // recompute visible of line
        visible = 0;
        for (var j = 0; j < line.length; ) {
          var n2 = skipAnsi(line, j);
          if (n2 > j) {
            j = n2;
            continue;
          }
          visible++;
          j++;
        }
        lastBreakPos = -1;
        lastBreakVisible = 0;
      }
    }
  }

  if (line.length || lines.length === 0) {
    lines.push(line);
  }
  return lines;
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

  var lines;
  if (hasAnsi(str)) {
    lines = wrapAnsiAware(str, width, options.cut === true);
  } else {
    var regexString = '.{1,' + width + '}';
    if (options.cut !== true) {
      regexString += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
    }
    var re = new RegExp(regexString, 'g');
    lines = str.match(re) || [];
  }

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
