'use strict';

/* deps: mocha */
var assert = require('assert');
var wrap = require('./');

var str = 'A project without documentation is like a project that doesn\'t exist. Verb solves this by making it dead simple to generate project documentation, using simple markdown templates, with zero configuration required.        ';

describe('wrap', function () {
  it('should use defaults to wrap words in the given string:', function () {
    assert.equal(wrap(str), '  A project without documentation is like a project \n  that doesn\'t exist. Verb solves this by making it \n  dead simple to generate project documentation, \n  using simple markdown templates, with zero \n  configuration required.        ');
  });

  it('should wrap to the specified width:', function () {
    assert.equal(wrap(str, {width: 40}), '  A project without documentation is like \n  a project that doesn\'t exist. Verb \n  solves this by making it dead simple to \n  generate project documentation, using \n  simple markdown templates, with zero \n  configuration required.        ');
  });

  it('should indent the specified amount:', function () {
    assert.equal(wrap(str, {indent: '      '}), '      A project without documentation is like a project \n      that doesn\'t exist. Verb solves this by making it \n      dead simple to generate project documentation, \n      using simple markdown templates, with zero \n      configuration required.        ');
  });

  it('should use the given string for newlines:', function () {
    assert.equal(wrap(str, {newline: '\n\n-'}), '  A project without documentation is like a project \n\n-that doesn\'t exist. Verb solves this by making it \n\n-dead simple to generate project documentation, \n\n-using simple markdown templates, with zero \n\n-configuration required.        ');
  });

  it('should run the escape function on each line', function () {
    assert.equal(
      wrap(str, {escape: function(e) {return e.replace('\'', '\\\'')}}),
      '  A project without documentation is like a project \n  that doesn\\\'t exist. Verb solves this by making it \n  dead simple to generate project documentation, \n  using simple markdown templates, with zero \n  configuration required.        '
    )
  });

  it('should trim trailing whitespace:', function () {
    assert.equal(wrap(str, {trim: true}), '  A project without documentation is like a project\n  that doesn\'t exist. Verb solves this by making it\n  dead simple to generate project documentation,\n  using simple markdown templates, with zero\n  configuration required.');
  });

  it('should handle strings with just newlines', function () {
    assert.equal(wrap('\r\n', {indent: '\r\n', width: 18}), '\r\n');
  });

  it('should handle strings that break where there are multiple spaces', function() {
    assert.equal(wrap('foo foo.  bar', {width:8}), '  foo foo.  \n  bar');
    assert.equal(wrap('foo foo.  bar', {width:8, trim: true}), '  foo foo.\n  bar');
  });

  it('should cut one long word', function() {
    assert.equal(wrap('Supercalifragilisticexpialidocious', {width:24, cut:true}), '  Supercalifragilisticexpi\n  alidocious');
  });

  it('should cut long words', function() {
    assert.equal(wrap('Supercalifragilisticexpialidocious and Supercalifragilisticexpialidocious', {width:24, cut:true}), '  Supercalifragilisticexpi\n  alidocious and Supercali\n  fragilisticexpialidociou\n  s');
  });

  it('should handle orphans', function() {
    assert.equal(wrap('This is an orphan', {width:10, amendOrphan:true}), '  This is \n  an orphan');

    // handle more than a single whitespace character between orphan and orphan adopter to keep existing functionality
    assert.equal(wrap('This is \t  an orphan', {width:10, amendOrphan:true}), '  This is \t  \n  an orphan');

    assert.equal(wrap('Nope, no orphan here', {width:11, amendOrphan:true}), '  Nope, no \n  orphan here');

    // don't handle if the amended line length would be greater than width
    assert.equal(wrap("Don't amend orphan", {width:11, amendOrphan:true}), "  Don't amend \n  orphan");

    // handle when cut = true
    assert.equal(wrap('What a Supercalif', {width:10, amendOrphan:true, cut:true}), '  What a \n  Supercalif');

    // except when the amended cut line has length > width
    assert.equal(wrap('What a Supercalif', {width:9, amendOrphan:true, cut:true}), '  What a Su\n  percalif');
  });
});
