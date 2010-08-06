/**
 * JSLint checker
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
load("util/test/jslint.js");
load("util/test/rightly_check.js");

rightly_check("build/right-src.js", [
//  the okay errors
//  "Expected an identifier and instead saw 'undefined' (a reserved word).",
//  "Use '===' to compare with 'null'.",
//  "Use '!==' to compare with 'null'.",
//  "Expected an assignment or function call and instead saw an expression.",
//  "Expected a 'break' statement before 'case'."
]);

