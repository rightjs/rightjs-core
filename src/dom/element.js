/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
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
    
    if (options['class'])   element.setClass(options['class']);
    if (options['style'])   element.setStyle(options['style']);
    if (options['observe']) element.observe(options['observe']);
    
    return element.set(Object.without(options, 'class', 'style', 'observe'));
  },
  
  extend: {
    /**
     * prepares an element for usage
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (element && !element['cleanCache']) {
        $ext(element, Element.Methods);
        element.cleanCache(); // cleans the events cache
      }
      return element;
    },
    
    Methods: {} // will be filled up in the submodules
  }
  
});