/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
 // Element constructor options mapper
var options_map = {
  id:      ['id',        0],
  html:    ['innerHTML', 0],
  'class': ['className', 0],
  style:   ['setStyle',  1],
  on:      ['on',        1]
},

// preserving the old Element class
old_Element = WIN.Element,

// defining the new Element object
Element = RightJS.Element = function(tag, options) {
  var element = DOC.createElement(tag);
  
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
  Element = RightJS.Element = eval('['+Element.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  )+']')[0];
}

// connecting the old Element instance to the new one for IE browsers
if (old_Element) {
  $ext(Element, old_Element);
  Element.parent = old_Element;
}

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
  
  Methods: {} // DO NOT Extend this object manually unless you really need it, use Element#include
});