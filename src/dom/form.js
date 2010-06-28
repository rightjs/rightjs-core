/**
 * The form unit class and extensions
 *
 * Credits:
 *   The basic principles of the module are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Form = RightJS.Form = function(in_options) {
  var options = in_options || {}, remote = 'remote' in options,
    form = new Element('form', Object.without(options, 'remote'));
  
  if (remote) form.remotize();
  
  return form;
};

(Form.include = Element.include)({
  /**
   * returns the form elements as an array of extended units
   *
   * @return Array of elements
   */
  getElements: function() {
    return this.select('input,button,select,textarea');
  },
  
  /**
   * returns the list of all the input elements on the form
   *
   * @return Array of elements
   */
  inputs: function() {
    return this.getElements().filter(function(input) {
      return !['submit', 'button', 'reset', 'image', null].includes(input._.type);
    });
  },
  
  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    var element = this._;
    
    if (Element_isForm(this)) {
      element = this.inputs().first(function(input) { return input._.type != 'hidden'; });
    }
    
    if (element) element.focus();
    
    return this.fire('focus');
  },
  
  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    if (Element_isForm(this)) {
      this.getElements().each('blur');
    } else {
      this._.blur();
    }
    
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
    if (Element_isForm(this)) {
      this.getElements().each('disable');
    } else {
      this._.disabled = true;
    }
    
    return this.fire('disable');
  },
  
  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    if (Element_isForm(this)) {
      this.getElements().each('enable');
    } else {
      this._.disabled = false;
    }
    
    return this.fire('enable');
  },
  
  /**
   * uniform access to the element values
   *
   * @return String element value
   */
  getValue: function() {
    if (this._.type === 'select-multiple') {
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
   * returns the list of the form values
   *
   * @return Object values
   */
  values: function() {
    var values = {}, value, name, element;
    
    this.inputs().each(function(element) {
      input = element._;
      name  = input.name;
      if (!input.disabled && name && (!['checkbox', 'radio'].includes(input.type) || input.checked)) {
        value = element.getValue();
        if (name.endsWith('[]'))
          value = (values[name] || []).concat([value]);
        
        values[name] = value;
      }
    });
    
    return values;
  },
  
  /**
   * returns the key/values organized ready to be sent via a get request
   *
   * @return String serialized values
   */
  serialize: function() {
    return Object.toQueryString(this.values());
  }
});

function Element_isForm(element) {
  return element._.tagName === 'FORM';
};

// creating the shortcuts
Form.include(Observer.createShortcuts({}, String_addShorts($w('submit reset focus blur disable enable change'))));
