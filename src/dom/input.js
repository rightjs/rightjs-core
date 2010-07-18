/**
 * The form input element class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Input = RightJS.Input = 

// retgistering the typecasted wrappers
Element_wrappers.INPUT    = 
Element_wrappers.BUTTON   =
Element_wrappers.SELECT   =
Element_wrappers.TEXTAREA = 

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
    if (!element || isHash(element)) {
      options = element || {};
    
      if (/textarea|select/.test(options.type || '')) {
        element = options.type;
        delete(options.type);
      } else {
        element = 'input';
      }
      
      this.construct(element, options);
    } else {
      this._ = element;
    }
  },
  
  /**
   * uniform access to the element values
   *
   * @return String element value
   */
  getValue: function() {
    if (this._.type == 'select-multiple') {
      return $A(this._.getElementsByTagName('option')).map(function(option) {
        return option.selected ? option.value : null;
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
      value = $A(isArray(value) ? value : [value]).map(String);
      $A(this._.getElementsByTagName('option')).each(function(option) {
        option.selected = value.includes(option.value);
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
    return this[value ? 'setValue' : 'getValue'](value);
  },
  
  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    this._.focus();
    this.focused = true;
    return this.fire('focus');
  },
  
  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this._.blur();
    this.focused = false;
    return this.fire('blur');
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
  }
}),

// creating the shortcuts
Input_shortcuts = $w('focus blur disable enable change');
Event_delegation_shortcuts = Event_delegation_shortcuts.concat(Input_shortcuts);

Input.include(Observer_createShortcuts({}, Input_shortcuts));