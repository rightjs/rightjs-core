/**
 * The DOM Element unit handling
 *
 * Credits:
 *   The basic principles of the elements extending are originated from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
window.Element = new Class(window.Element, {
  /**
   * basic constructor
   *
   * @param String tag name
   * @param Object new element options
   * @return Element object
   */
  initialize: function(tag_name, options) {
    if (Browser.IE && tag_name == 'input' && options && options.checked) {
      tag_name = '<input checked="true"/>';
    }
    
    var element = document.createElement(tag_name), options = options || {};
    
    if (options['html'])    { element.innerHTML = options['html'];  delete(options['html']);    }
    if (options['class'])   { element.className = options['class']; delete(options['class']);   }
    if (options['style'])   { element.setStyle(options['style']);   delete(options['style']);   }
    if (options['observe']) { element.observe(options['observe']);  delete(options['observe']); }
    
    for (var key in options)
      return element.set(options);
    return element;
  },
  
  extend: {
    /**
     * registeres the methods on the custom element methods list
     * will add them to prototype and will generate a non extensive static mirror
     * 
     * USAGE:
     *  Element.addMethods({
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
    addMethods: function(methods, dont_overwrite) {
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
    
    Methods: {} // DO NOT Extend this object manually unless you really need it, use Element#addMethods
  }
});