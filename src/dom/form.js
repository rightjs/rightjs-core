/**
 * The form unit class and extensions
 *
 * Credits:
 *   The basic principles of the module are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
function Form(options) {
  var options = options || {}, remote = options.remote,
    form = new Element('form', Object.without(options, 'remote'));
  
  if (remote) form.remotize();
  
  return form;
};

$ext(Form, {
  Methods: {},
  
  /**
   * Extends the form functionality
   *
   * @param Object methods hash
   * @return void
   */
  include: function(methods, dont_overwrite) {
    $ext(Form.Methods, methods, dont_overwrite);
    
    try { // trying to extend the form element prototype
      $ext(HTMLFormElement.prototype, methods, dont_overwrite);
    } catch(e) {}
  }
});

Form.include({
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
      return !['submit', 'button', 'reset', 'image', null].includes(input.type);
    });
  },
  
  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    var first = this.inputs().first(function(input) { return input.type != 'hidden'; });
    if (first) first.focus();
    return this.fire('focus');
  },
  
  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this.getElements().each('blur');
    return this.fire('blur');
  },
  
  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this.getElements().each('disable');
    return this.fire('disable');
  },
  
  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this.getElements().each('enable');
    return this.fire('enable');
  },
  
  /**
   * returns the list of the form values
   *
   * @return Object values
   */
  values: function() {
    var values = {};
    
    this.inputs().each(function(input) {
      if (!input.disabled && input.name && (!['checkbox', 'radio'].includes(input.type) || input.checked))
        values[input.name] = input.getValue();
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

// creating the shortcuts
Form.include(Observer.createShortcuts({}, $w('submit reset focus')), true);

