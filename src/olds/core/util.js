/**
 * The core util extensions for the OLD IE browsers
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
if (Browser.OLD) {
  $ = (function(old_function) {
    return function(id) {
      return Element.prepare(old_function(id));
    }
  })($);
}