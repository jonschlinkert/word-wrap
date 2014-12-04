/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var should = require('should');
var wrap = require('./');

var str = 'A project without documentation is like a project that doesn\'t exist. Verb solves this by making it dead simple to generate project documentation, using simple markdown templates, with zero configuration required.        ';

describe('wrap', function () {
  it('should use defaults to wrap words in the given string:', function () {
    wrap(str).should.equal('  A project without documentation is like a project \n  that doesn\'t exist. Verb solves this by making it \n  dead simple to generate project documentation, \n  using simple markdown templates, with zero \n  configuration required.        ');
  });

  it('should wrap to the specified width:', function () {
    wrap(str, {width: 40}).should.equal('  A project without documentation is like \n  a project that doesn\'t exist. Verb \n  solves this by making it dead simple to \n  generate project documentation, using \n  simple markdown templates, with zero \n  configuration required.        ');
  });

  it('should indent the specified amount:', function () {
    wrap(str, {indent: '      '}).should.equal('      A project without documentation is like a project \n      that doesn\'t exist. Verb solves this by making it \n      dead simple to generate project documentation, \n      using simple markdown templates, with zero \n      configuration required.        ');
  });

  it('should use the given string for newlines:', function () {
    wrap(str, {newline: '\n\n-'}).should.equal('  A project without documentation is like a project \n\n-that doesn\'t exist. Verb solves this by making it \n\n-dead simple to generate project documentation, \n\n-using simple markdown templates, with zero \n\n-configuration required.        ');
  });

  it('should trim trailing whitespace:', function () {
    wrap(str, {trim: true}).should.equal('  A project without documentation is like a project\n  that doesn\'t exist. Verb solves this by making it\n  dead simple to generate project documentation,\n  using simple markdown templates, with zero\n  configuration required.');
  });
});

