/**
 * Here are the Form unit Xhr extensions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Form.include({
  /**
   * sends the form via xhr request
   *
   * @param Options xhr request options
   * @return Form this
   */
  send: function(options) {
    options = options || {};
    options['method'] = options['method'] || this.method || 'post';
    
    new Xhr(this.get('action') || document.location.href, options
      ).onRequest(this.disable.bind(this)
      ).onComplete(this.enable.bind(this)).send(this);
    
    return this;
  },
  
  /**
   * makes the form be remote by default
   *
   * @param Object default options
   * @return Form this
   */
  remotize: function(options) {
    this.onsubmit = function() {
      this.send.bind(this, Object.merge({spinner: this.first('.spinner')}, options)).delay(20);
      return false;
    };
      
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
    this.onsubmit = dummy();
    this.remote   = false;
    return this;
  }
});