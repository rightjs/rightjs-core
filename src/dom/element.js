/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
self.Element = (function(old_Element) {
  
  var new_Element = function(tag, options) {
    var element = document.createElement(tag), options = options || {};
    
    if (options.id)       { element.id = options.id;              delete(options.id);       }
    if (options.html)     { element.innerHTML = options.html;     delete(options.html);     }
    if (options['class']) { element.className = options['class']; delete(options['class']); }
    if (options.style)    { element.setStyle(options.style);      delete(options.style);    }
    if (options.observe)  { element.observe(options.observe);     delete(options.observe);  }
    
    for (var key in options) // a filter in case there is no keys in the options left
      return element.set(options);
    return element;
  };
  
  
  if (Browser.IE) {
    //
    // IE browsers have a bug with checked input elements
    // and we kinda hacking the Element constructor so that
    // it affected IE browsers only
    //
    new_Element = eval('['+new_Element.toString().replace(/(\((\w+), (\w+)\) \{)/,
      '$1if($2=="input"&&$3&&$3.checked)$2="<input checked=true/>";'
    )+']')[0];
  }
  
  // connecting the old Element instance to the new one for IE browsers
  if (old_Element) {
    $ext(new_Element, old_Element);
    new_Element.parent = old_Element;
  }
  
  return new_Element;
})(self.Element);


$ext(Element, {
  /**
   * registeres the methods on the custom element methods list
   * will add them to prototype and will generate a non extensive static mirror
   * 
   * USAGE:
   *  Element.include({
   *    foo: function(bar) {}
   *  });
   *
   *  $(element).foo(bar);
   *  Element.foo(element, bar);
   *
   * @param Object new methods list
   * @param Boolean flag if the method should keep the existing methods alive
   * @return Element the global Element object
   */
  include: function(methods, dont_overwrite) {
    $ext(this.Methods, methods, dont_overwrite);
    
    try { // busting up the basic element prototypes
      $ext(HTMLElement.prototype, methods, dont_overwrite);
    } catch(e) {
      try { // IE8 native element extension
        $ext(this.parent.prototype, methods, dont_overwrite);
      } catch(e) {}
    }
    
    return this;
  },
  
  Methods: {} // DO NOT Extend this object manually unless you really need it, use Element#include
});

// the old interface alias, NOTE will be nuked
Element.addMethods = Element.include;