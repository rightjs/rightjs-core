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
      var element = old_function(id);
      
      // old IE browses match both, ID and NAME
      if (element !== null && RightJS.isString(id) && element.id !== id) 
        element = RightJS.$$('#'+id)[0];
        
      return element ? RightJS.Element.prepare(element) : element;
    }
  })(RightJS.$);
  
  
  /**
   * Overloading the native method to extend the new elements as it is
   * in all the other browsers
   *
   * @param String tag name
   * @return Element
   */
  document.createElement = (function(old_method) {
    return function(tag) {
      return RightJS.Element.prepare(old_method(tag));
    }
  })(document.createElement);
}