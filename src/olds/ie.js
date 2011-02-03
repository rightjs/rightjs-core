/**
 * Old IE browser hacks
 *
 *   Keep them in one place so they were more compact
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
if (RightJS.Browser.OLD && RightJS.Browser.IE) {
  // loads DOM element extensions for selected elements
  window.$ = RightJS.$ = (function(old_function) {
    return function(id) {
      var element = old_function(id);

      // old IE browses match both, ID and NAME
      if (element && element instanceof RightJS.Element &&
        RightJS.isString(id) && element._.id !== id
      ) {
        element = RightJS.$(document).first('#'+ id);
      }

      return element;
    };
  })(RightJS.$);
}
