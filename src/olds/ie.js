/**
 * Old IE browser hacks
 *
 *   Keep them in one place so they were more compact
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
if (Browser.OLD) {
  // loads DOM element extensions for selected elements
  $ = (function(old_function) {
    return function(id) {
      var element = old_function(id);
      
      // old IE browses match both, ID and NAME
      if (element !== null && isString(id) && element.id !== id) 
        element = $$('#'+id)[0];
        
      return element ? Element.prepare(element) : element;
    }
  })($);
  
  
  $ext(document, {
    /**
     * Overloading the native method to extend the new elements as it is
     * in all the other browsers
     *
     * @param String tag name
     * @return Element
     */
    createElement: (function(old_method) {
      return function(tag) {
        return Element.prepare(old_method(tag));
      }
    })(document.createElement)
  });
  
  
  
  $ext(Element, {
    /**
     * IE browsers manual elements extending
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (element && element.tagName && !element.set) {
        $ext(element, Element.Methods, true);

        if (window.Form) {
          switch(element.tagName) {
            case 'FORM':
              $ext(element, Form.Methods);
              break;

            case 'INPUT':
            case 'SELECT':
            case 'BUTTON':
            case 'TEXTAREA':
              $ext($alias(element, {
                _blur:   'blur',
                _focus:  'focus',
                _select: 'select'
              }), Form.Element.Methods);
              break;
          }
        }
      }
      return element;
    }
  });
  
  Element.include((function() {
    var old_collect = Element.Methods.rCollect;
    
    return {
      rCollect: function(attr, css_rule) {
        return old_collect.call(this, attr, css_rule).each(Element.prepare);
      }
    }
  })());
}