/**
 * there is the form-elements additional methods container
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Form.Element = {
  /**
   * IE browsers manual elements extending
   *
   * @param Element element
   * @return Element extended element
   */
  ext: function(element) {
    // highjack the native methods to be able to call them froum our wrappers
    element._blur   = element.blur;
    element._focus  = element.focus;
    element._select = element.select;
    
    return $ext(element, this.Methods);
  },
  
  Methods: {
   /**
    * uniform access to the element values
    *
    * @return String element value
    */
    getValue: function() {
      if (this.type == 'select-multiple') {
        return $A(this.childNodes).map(function(option) {
          return option.selected ? option.value : null;
        }).compact();
      } else {
        return this.value;
      }
    },

    /**
    * uniform accesss to set the element value
    *
    * @param String value
    * @return Element this
    */
    setValue: function(value) {
      if (this.type == 'select-multiple') {
        value = (isArray(value) ? value : [value]).map(String);
        $A(this.childNodes).each(function(option) {
          option.selected = value.includes(option.value);
        });
      } else {
        this.value = value;
      }
      return this;
    },

    /**
     * makes the element disabled
     *
     * @return Element this
     */
    disable: function() {
      this.disabled = true;
      this.fire('disable');
      return this;
    },

    /**
     * makes the element enabled
     *
     * @return Element this
     */
    enable: function() {
      this.disabled = false;
      this.fire('enable');
      return this;
    },
    
    /**
     * focuses on the element
     *
     * @return Element this
     */
    focus: function() {
      this._focus();
      this.focused = true;
      this.fire('focus');
      return this;
    },
    
    /**
     * focuses on the element and selects its content
     *
     * @return Element this
     */
    select: function() {
      this.focus();
      this._select();
      return this;
    },
    
    /**
     * looses the element focus
     *
     * @return Element this
     */
    blur: function() {
      this._blur();
      this.focused = false;
      this.fire('blur');
      return this;
    }
  }
};

Observer.createShortcuts(Form.Element.Methods, $w('disable enable focus blur'));

try { // extending the input element prototypes
  [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement].each(function(klass) {
    $alias(klass.prototype, {
      blur:   '_blur',
      focus:  '_focus',
      select: '_select'
    });
    $ext(klass.prototype, Form.Element.Methods);
  });
} catch(e) {}
