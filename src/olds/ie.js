/**
 * Old IE browser hacks
 *
 *   Keep them in one place so they were more compact
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
if (Browser.OLD) {
  // loads DOM element extensions for selected elements
  $ = (function(old_function) {
    return function(id) {
      var element = old_function(id);
      return element ? Element.prepare(element) : element;
    }
  })($);
  
  
  $ext(document, {
/* TODO Not sure about this thing for now
        It's kinda makes sense, but it will perform
        double check in node search operations
        
    getElementById: (function(old_method) {
      return function(id) {
        return Element.prepare(old_method(id));
      };
    })(document.getElementById),
 */
    
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

        if (self['Form']) {
          switch(element.tagName) {
            case 'FORM':
              Form.ext(element);
              break;

            case 'INPUT':
            case 'SELECT':
            case 'BUTTON':
            case 'TEXTAREA':
              Form.Element.ext(element);
              break;
          }
        }
      }
      return element;
    }
  });
  
  Element.addMethods((function() {
    var old_collect = Element.Methods.rCollect;
    
    return {
      rCollect: function(attr, css_rule) {
        return old_collect.call(this, attr, css_rule).each(Element.prepare);
      }
    }
  })());
}