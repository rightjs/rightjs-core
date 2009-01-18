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
    if (isHash(name)) {
      for (var key in name)
        this.set(key, name[key]);
    } else {
      this[name] = value;
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
    var value = this.getAttribute(name);
    return value == '' ? null : value;
  },
  
  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) != null;
  },
  
  /**
   * checks if the elemnt is hidden
   *
   * NOTE: will check css level computed styles too
   *
   * @return boolean check result
   */
  hidden: function() {
    return this.getStyle('display') == 'none';
  },
  
  /**
   * checks if the element is visible
   *
   * @return boolean check result
   */
  visible: function() {
    return !this.hidden();
  },
  
  /**
   * hides the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  hide: function(effect, options) {
    this.__prevDisplay = this.getStyle('display');
    this.style.display = 'none';
    return this;
  },
  
  /**
   * shows the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  show: function(effect, options) {
    this.style.display = this.__prevDisplay || '';
    return this;
  },
  
  /**
   * toggles the visibility state of the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  toggle: function(effect, options) {
    return this[this.hidden() ? 'show' : 'hide'](effect, options);
  },
  
  /**
   * removes the elemnt out of this parent node
   *
   * @return Element self
   */
  remove: function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
    return this;
  }
}