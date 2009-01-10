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
    var element = Element.prepare(document.createElement(tag_name)), options = options || {};
    
    if (options['class']) element.className = options['class'];
    if (options['style']) element.setStyle(options['style']);
    
    return element.set(Object.without(options, 'class', 'style'));
  },
  
  extend: {
    /**
     * prepares an element for usage
     *
     * @param Element
     * @return Element
     */
    prepare: function(element) {
      if (!element['setAttrs']) {
        Object.extend(element, Element.Commons);
        Object.extend(element, Element.Styles);
      }
      return element;
    }
  }
  
});