/**
 * Old IE browser hacks
 *
 *   Keep them in one place so they were more compact
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
if (RightJS.Browser.OLD) {
  // loads DOM element extensions for selected elements
  $ = RightJS.$ = (function(old_function) {
    return function(id) {
      var element = old_function(id), match = !RightJS.isString(id) || /^#([\w\-]+)/.exec(id);
      
      // old IE browses match both, ID and NAME
      if (element !== null && match !== null && element._.id !== match[1]) {
        element = RightJS.$(document).first(id);
        
      return element;
    }
  })(RightJS.$);
}