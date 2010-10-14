/**
 * The form input element class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var old_insert = Element[PROTO].insert,

Input = RightJS.Input =

// retgistering the typecasted wrappers
Element_wrappers.INPUT    =
Element_wrappers.BUTTON   =
Element_wrappers.SELECT   =
Element_wrappers.TEXTAREA =
Element_wrappers.OPTGROUP =

new Wrapper(Element, {
  /**
   * Constructor
   *
   * NOTE: this constructor can be called in several ways
   *
   *  Like normal Element
   *   var input = new Input('texarea', {...});
   *   var input = new Input(document.createElement('select'));
   *
   *  Or with options only which will make an INPUT element by default
   *    var input = new Input({type: 'password', name: 'password'});
   *
   * @param HTMLElement or a String tag name or Options for default 'input' tag
   * @param Object options
   * @return void
   */
  initialize: function(element, options) {
    // type to tag name conversion
    if (!element || (isHash(element) && !isElement(element))) {
      options = element || {};

      if (/textarea|select/.test(options.type || '')) {
        element = options.type;
        delete(options.type);
      } else {
        element = 'input';
      }
    }

    this.$super(element, options);
  },

  /**
   * Returns a reference to the input's form
   *
   * @return Form wrapped form
   */
  form: function() {
    return $(this._.form);
  },

  /**
   * SELECT element has a bug in FF that screws the selected options
   *
   * @param mixed content
   * @param String optional position
   * @return Input this
   */
  insert: function(content, position) {
    old_insert.call(this, content, position);

    // IE gets screwed when SELECT element is updated with async calls
    if (this._.add && Browser.IE && !this.first('OPTGROUP')) {
      var dummy_option_element = document.createElement('option');
      this._.add(dummy_option_element);
      this._.removeChild(dummy_option_element);
    }

    // FF doesn't marks selected options correctly with a textual content
    this.find('option').each(function(option) {
      option._.selected = !!option.get('selected');
    });

    return this;
  },

  /**
   * Overloading the method so it always called the '#insert' method
   *
   * @param mixed content
   * @return Input this
   */
  update: function(content) {
    return this.clean().insert(content);
  },

  /**
   * uniform access to the element values
   *
   * @return String element value
   */
  getValue: function() {
    if (this._.type == 'select-multiple') {
      return this.find('option').map(function(option) {
        return option._.selected ? option._.value : null;
      }).compact();
    } else {
      return this._.value;
    }
  },

  /**
   * uniform accesss to set the element value
   *
   * @param String value
   * @return Element this
   */
  setValue: function(value) {
    if (this._.type == 'select-multiple') {
      value = ensure_array(value).map(String);
      this.find('option').each(function(option) {
        option._.selected = value.include(option._.value);
      });
    } else {
      this._.value = value;
    }
    return this;
  },

  /**
   * Both ways getter/setter for the value parameter
   *
   * @param mixed value
   * @return mixed this or the value
   */
  value: function(value) {
    return this[value === undefined ? 'getValue' : 'setValue'](value);
  },

  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    this._.focus();
    this.focused = true;
    if (Browser.IE) { this.fire('focus', {bubbles: false}); }
    return this;
  },

  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this._.blur();
    this.focused = false;
    if (Browser.IE) { this.fire('blur', {bubbles: false}); }
    return this;
  },

  /**
   * focuses on the element and selects its content
   *
   * @return Element this
   */
  select: function() {
    this._.select();
    return this.focus();
  },

  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this._.disabled = true;
    return this.fire('disable');
  },

  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this._.disabled = false;
    return this.fire('enable');
  },

  /**
   * A bidirectional method to set/get the disabled status of the input field
   *
   * @param boolean optional value
   * @return Input in setter mode boolean in getter
   */
  disabled: function(value) {
    return value === undefined ? this._.disabled : this[value ? 'disable' : 'enable']();
  },

  /**
   * A bidirectional method to set/get the checked status of the input field
   *
   * @param boolean optional value
   * @return Input in setter mode boolean in getter
   */
  checked: function(value) {
    if (value === undefined) {
      value = this._.checked;
    } else {
      this._.checked = value;
      value = this;
    }

    return value;
  }
});

