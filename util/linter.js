/**
 * A wrapper around JSLint to drop things into the console
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
var RightJS = require('./right-server.js');
var JSLint  = require('./jslint').JSLINT;
var fs      = require('fs');

exports.Linter = new RightJS.Class({
  extend: {
    Options: {
      debug:    false, // no debug
      devel:    false, // no console.log s
      evil:     false, // no evals
      passfail: false, // don't stop on errors
      onevar:   false, // allow more than one 'var' definition
      forin:    true , // allow for in without ownershipt checks
      indent:   2    , // enforce 2 spaces indent
      maxerr:   12   , // max number of errors
    },

    Okays: [
      "Move 'var' declarations to the top of the function."
    ]
  },

  /**
   * Basic constructor
   *
   * @param {String} the source
   * @param {String} the linter options
   * @return void
   */
  initialize: function(src, options) {
    this.source  = src;
    this.options = options;
  },

  /**
   * Runs the linter
   *
   * @return {Linter} this
   */
  run: function() {
    var options = {}, okays = [];

    // extracting the additional options
    eval(fs.readFileSync(this.options).toString());

    JSLint.okays = this.constructor.Okays.concat(okays);

    JSLint(
      fs.readFileSync(this.source).toString(),
      Object.merge(this.constructor.Options, options)
    );

    this.errors = JSLint.errors.compact();

    return this;
  },

  /**
   * Prints out the check report
   *
   * @return {Linter} this
   */
  report: function() {

    if (this.errors.empty()) {
      console.log("\u001B[32m - JSLint check successfully passed\u001B[0m");
    } else {
      console.log("\u001B[31m - JSLint check failed in: "+ this.source + "\u001B[0m");

      this.errors.each(function(error) {
        var report = "\n", j=0, pointer='';
        for (; j < error.character-1; j++) { pointer += '-'; }

        report += "    \u001B[35m"+ error.reason +"\u001B[0m ";

        if (error.evidence) {
          report += "Line: "+ error.line + ", Char: "+ error.character + "\n";
          report += "    "+ error.evidence + "\n";
          report += "    \u001B[33m"+ pointer + "^\u001B[0m";
        }

        console.log(report);
      });

      console.log("\n")
    }
    return this;
  }

});