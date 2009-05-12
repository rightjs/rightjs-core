/**
 * The DOM Element unit handling
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
    var element = $(document.createElement(tag_name)), options = options || {};
    
    if (options['html'])    { element.update(options['html']);     delete(options['html']);    }
    if (options['class'])   { element.setClass(options['class']);  delete(options['class']);   }
    if (options['style'])   { element.setStyle(options['style']);  delete(options['style']);   }
    if (options['observe']) { element.observe(options['observe']); delete(options['observe']); }
    
    return element.set(options);
  },
  
  extend: {
    Methods: {}, // DO NOT Extend this object manually unless you need it, use Element#addMethods
    
    /**
     * IE browsers manual elements extending
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (element && element.tagName && !element.set) {
        $ext(element, Element.Methods, true);
        
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
      return element;
    },
    
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
      } catch(e) {}
      
      return this;
    },
    
    /**
     * creates a fragment out of the incomming data
     *
     * @param mixed a string of html, or a list of nodes or a single node
     * @return DocumentFragment
     */
    createFragment: function(content) {
      var fragment;
      
      if (isString(content)) {
        fragment = content.toFragment();
        
      } else {
        fragment = document.createDocumentFragment();
        
        if (isNode(content)) {
          fragment.appendChild(content);
        } else if (content && content.length) {
          for (var i=0, length = content.length; i < length; i++) {
            // in case of NodeList unit, the elements will be removed out of the list during the appends
            // therefore if that's an array we use the 'i' variable, and if it's a collection of nodes
            // then we always hit the first element of the stack
            fragment.appendChild(content[content.length == length ? i : 0]);
          }
        }
      }
      
      return fragment;
    }
  }
});