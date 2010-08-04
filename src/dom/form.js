/**
 * The form unit class and extensions
 *
 * Credits:
 *   The basic principles of the module are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */

var Form = RightJS.Form = Element_wrappers.FORM = new Wrapper(Element, {
  /**
   * constructor
   *
   * NOTE: this constructor can be called as a normal Element constructor
   *       or with the options only, which will make a FORM element
   *
   *   var form = new Form(raw_form_object_element);
   *   var form = new Form({method: 'post', action: '/boo/hoo'});
   *
   * @param Object options or HTMLFormElement object
   * @return void
   */
  initialize: function(in_options) {
    var options = in_options || {}, remote = 'remote' in options;
    
    if (isHash(options)) {
      this.construct('form', Object.without(options, 'remote'));
    }
  
    if (remote) this.remotize();
  },
  
  /**
   * returns the form elements as an array of extended units
   *
   * @return Array of elements
   */
  elements: function() {
    return this.select('input,button,select,textarea');
  },
  
  // DEPRECATED
  getElements: function() {
    return this.elements();
  },
  
  /**
   * returns the list of all the input elements on the form
   *
   * @return Array of elements
   */
  inputs: function() {
    return this.elements().filter(function(input) {
      return !['submit', 'button', 'reset', 'image', null].includes(input._.type);
    });
  },
  
  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    var element = this.inputs().first(function(input) {
      return input._.type !== 'hidden';
    });
    
    if (element) element.focus();
    
    return this;
  },
  
  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this.elements().each('blur');
    return this;
  },
  
  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this.elements().each('disable');
    return this;
  },
  
  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this.elements().each('enable');
    return this;
  },
  
  /**
   * returns the list of the form values
   *
   * @return Object values
   */
  values: function() {
    var values = {}, value, name, element, input;
    
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

// creating the event shortcuts
Element_add_event_shortcuts('submit reset focus blur disable enable change');