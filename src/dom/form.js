/**
 * The form unit class and extensions
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Form = new Class(Element, {
  /**
   * generic forms creation constructor
   *
   * @param Object form options
   */
  initialize: function(options) {
    var options = options || {}, remote = options['remote'], options = Object.without(options, 'remote'),
      form = this.$super('form', options);
    
    if (remote) form.remotize();
    
    return form;
  },
  
  extend: {
    /**
     * invokes the form element extending procedure
     *
     * @param Element form
     * @return Form element
     */
    ext: function(element) {
      Observer.createShortcuts(element, $w('submit reset focus'));
      return $ext(element, this.Methods);
    },
    
    Methods: {
      /**
       * returns the form elements as an array of extended units
       *
       * @return Array of elements
       */
      getElements: function() {
        return $A(this.elements).walk($);
      },
      
      /**
       * returns the list of all the input elements on the form
       *
       * @return Array of elements
       */
      inputs: function() {
        return this.getElements().filter(function(input) {
          return !input.type || !['submit', 'button', 'reset'].includes(input.type);
        });
      },
      
      /**
       * focuses on the first input element on the form
       *
       * @return Form this
       */
      focus: function() {
        var first = this.inputs().any(function(input) { return input.type != 'hidden'; });
        if (first) first.focus();
        return this;
      },
      
      /**
       * removes focus out of all the form elements
       *
       * @return Form this
       */
      blur: function() {
        this.getElements().walk('blur');
        return this;
      },
      
      /**
       * disables all the elements on the form
       *
       * @return Form this
       */
      disable: function() {
        this.getElements().walk('disable');
        return this;
      },
      
      /**
       * enables all the elements on the form
       *
       * @return Form this
       */
      enable: function() {
        this.getElements().walk('enable');
        return this;
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
      },
      
      /**
       * sends the form via xhr request
       *
       * @params Options xhr request options
       * @return Form this
       */
      send: function(options) {
        this.disable();
        
        options['method'] = options['method'] || this.get('method') || 'post';
        
        new Xhr(this.get('action') || document.location.href, options
          ).onRequest(this.disable.bind(this)
          ).onComplete(this.enable.bind(this)).send(this);
        
        return this;
      },
      
      /**
       * makes the form be remote by default
       *
       * @params Object default options
       * @return Form this
       */
      remotize: function(options) {
        this.onsubmit = function() { this.send(options); return false; };
        this.remote   = true;
        return this;
      },
      
      /**
       * removes the remote call hook
       *
       * NOTE: will nuke onsubmit attribute
       *
       * @return Form this
       */
      unremotize: function() {
        this.onsubmit = function() {};
        this.remote   = false;
        return this;
      }
    }
  }
});