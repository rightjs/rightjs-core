/**
 * Common DOM Element unit methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.Commons = {
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(name, value) {
    if (typeof(name)=='object') {
      Object.extend(this, name);
    } else {
      this.setAttribute(name, value);
    }
    return this;
  },
  
  /**
   * returns the attribute value for the name
   *
   * @param String attr name
   * @return mixed value
   */
  get: function(name) {
    return this.getAttribute(name);
  },
  
  
  
  hidden: function() {
    
  },
  
  hide: function(effect, options) {
    
  },
  
  show: function(effect, options) {
    
  },
  
  toggle: function(effect, options) {
    
  }
}