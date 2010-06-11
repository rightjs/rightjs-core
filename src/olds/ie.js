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
  
  
  RightJS.$ext(document, {
    /**
     * Overloading the native method to extend the new elements as it is
     * in all the other browsers
     *
     * @param String tag name
     * @return Element
     */
    createElement: (function(old_method) {
      return function(tag) {
        return RightJS.Element.prepare(old_method(tag));
      }
    })(document.createElement)
  });
  
  
  
  RightJS.$ext(RightJS.Element, {
    /**
     * IE browsers manual elements extending
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (element && element.tagName && !element.set) {
        RightJS.$ext(element, RightJS.Element.Methods, true);

        if (RightJS.Form) {
          switch(element.tagName) {
            case 'FORM':
              RightJS.$ext(element, RightJS.Form.Methods);
              break;

            case 'INPUT':
            case 'SELECT':
            case 'BUTTON':
            case 'TEXTAREA':
              RightJS.$ext(RightJS.$alias(element, {
                _blur:   'blur',
                _focus:  'focus',
                _select: 'select'
              }), RightJS.Form.Element.Methods);
              break;
          }
        }
      }
      return element;
    }
  });
  
  RightJS.Element.include((function() {
    var old_collect = RightJS.Element.Methods.rCollect;
    
    return {
      rCollect: function(attr, css_rule) {
        return old_collect.call(this, attr, css_rule).each(RightJS.Element.prepare);
      }
    }
  })());
}