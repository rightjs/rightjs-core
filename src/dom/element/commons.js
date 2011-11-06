/**
 * Common DOM Element unit methods
 *
 * Credits:
 *   Most of the naming system in the module inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(hash, value) {
    if (typeof(hash) === 'string') { var val = {}; val[hash] = value; hash = val; }

    var key, element = this._;

    for (key in hash) {
      if (key === 'style') {
        this.setStyle(hash[key]);
      } else {
        // some attributes are not available as properties
        if (!(key in element)) {
          element.setAttribute(key, ''+hash[key]);
        }
        if (key.substr(0,5) !== 'data-') {
          element[key] = hash[key];
        }
      }
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
    var element = this._, value = element[name] || element.getAttribute(name);
    return value === '' ? null : value;
  },

  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) !== null;
  },

  /**
   * erases the given attribute of the element
   *
   * @param String attr name
   * @return Element self
   */
  erase: function(name) {
    this._.removeAttribute(name);
    return this;
  },

  /**
   * checks if the elemnt is hidden
   *
   * NOTE: will check css level computed styles too
   *
   * @return boolean check result
   */
  hidden: function() {
    return this.getStyle('display') === 'none';
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
    if (this.visible()) {
      this._d = this.getStyle('display');
      this._.style.display = 'none';
    }

    return this;
  },

  /**
   * shows the element
   *
   * @return Element self
   */
  show: function() {
    if (this.hidden()) {
      var element   = this._, value = this._d, dummy;

      // trying to guess the default 'style.display' for this kind of elements
      if (!value || value === 'none') {
        dummy = $E(element.tagName).insertTo(HTML);
        value = dummy.getStyle('display');
        dummy.remove();
      }

      // failsafe in case the user been naughty
      if (value === 'none') {
        value = 'block';
      }

      element.style.display = value;
    }

    return this;
  },

  /**
   * toggles the visibility state of the element
   *
   * @return Element self
   */
  toggle: function() {
    return this[this.visible() ? 'hide' : 'show']();
  },

  /**
   * shows the element and hides all the sibligns
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  radio: function(effect, options) {
    this.siblings().each('hide', effect, options);
    return this.show();
  },

  /**
   * Sets/gets the `data-smth` data attribute and
   * automatically converts everything in/out JSON
   *
   * @param String key name
   * @param mixed data or `undefined` to erase
   * @return mixed Element self or extracted data
   */
  data: function(key, value) {
    key = 'data-'+ key;

    if (value === undefined) {
      if ((value = this._.getAttribute(key))) {
        value = JSON.parse(value);
      } else {
        value = null;
      }
    } else {
      if (value === null) {
        this._.removeAttribute(key);
      } else {
        this._.setAttribute(key, JSON.stringify(value));
      }
      value = this;
    }

    return value;
  }
});
