/**
 * OLD IE 6,7 browsers document adjustments 
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
if (Browser.OLD) {
  $ext(document, {
    getElementById: (function(old_method) {
      return function(id) {
        return Element.prepare(old_method(id));
      };
    })(document.getElementById),

    createElement: (function(old_method) {
      return function(tag) {
        return Element.prepare(old_method(tag));
      }
    })(document.createElement)
  });
}