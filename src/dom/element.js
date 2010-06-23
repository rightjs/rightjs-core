/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Element = (function(old_Element) {
  
  // Element constructor options mapper
  var options_map = {
    id:      ['id',        0],
    html:    ['innerHTML', 0],
    'class': ['className', 0],
    style:   ['setStyle',  1],
    on:      ['on',        1]
  };
  
  function new_Element(tag, options) {
    var element = document.createElement(tag);
    
    if (options) {
      for (var key in options) {
        if (options_map[key]) {
          if (options_map[key][1]) element[options_map[key][0]](options[key]);
          else element[options_map[key][0]] = options[key];
        } else {
          element.set(key, options[key]);
        }
      }
    }
    
    return element;
  };
  
  
  if (Browser.IE) {
    //
    // IE browsers have a bug with checked input elements
    // and we kinda hacking the Element constructor so that
    // it affected IE browsers only
    //
    new_Element = eval('['+new_Element.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
      '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
    )+']')[0];
  }
  
  // connecting the old Element instance to the new one for IE browsers
  if (old_Element) {
    $ext(new_Element, old_Element);
    new_Element.parent = old_Element;
  }
  
  return new_Element;
})(window.Element);


$ext(Element, {
  /**
   * registeres the methods on the custom element methods list
   * will add them to prototype and register at the Element.Methods hash
   * 
   * USAGE:
   *  Element.include({
   *    foo: function(bar) {}
   *  });
   *
   *  $(element).foo(bar);
   *
   * @param Object new methods list
   * @param Boolean flag if the method should keep the existing methods alive
   * @return Element the global Element object
   */
  include: function(methods, dont_overwrite) {
    $ext(this.Methods, methods, dont_overwrite);
    
    try { // busting up the basic element prototypes
      $ext((window.HTMLElement || this.parent).prototype, methods, dont_overwrite);
    } catch(e) {}
    
    return this;
  },
  
  Methods: {}, // DO NOT Extend this object manually unless you really need it, use Element#include
  
  /**
   * manual elements extending, in case of elements from another frames
   *
   * @param Element
   * @return Element
   */
  prepare: function(element) {
    if (element && !('set' in element)) {
      $ext(element, Element.Methods, true);

      if ('Form' in window) {
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
  },
  
  /**
   * Checks if the elements on the list need to be prepared
   * and prepares them all
   *
   * @param Array list of raw elements
   * @return Array list of prepared elements
   */
  prepareAll: function(list) {
    return !list[0] || 'set' in list[0] ? list : list.map(Element.prepare);
  }
});