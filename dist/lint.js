/**
 * JSLint checker
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
load("util/test/jslint.js");
load("util/test/rightly_check.js");

rightly_check("build/right-src.js", [
//  the okay errors
  "Do not use Number as a constructor.", // used to create those nice timer pointers
  "Expected a 'break' statement before 'case'.", // in some cases we don't need the break
  "Expected a 'break' statement before 'default'."
]);

