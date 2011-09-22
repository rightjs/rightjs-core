/**
 * Here are the Form unit Xhr extensions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2009-2011 Nikolay V. Nemshilov
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
    options.method = options.method || this._.method || 'post';

    this.xhr = new Xhr(
      this._.action || document.location.href,
      $ext({spinner: this.first('.spinner')}, options)
    )
    .onComplete(this.enable.bind(this))
    .onCancel(this.enable.bind(this))
    .send(this);

    this.disable.bind(this).delay(1); // webkit needs this async call with iframed calls
    return this;
  },

  /**
   * Cancels current Xhr request (if there are any)
   *
   * @return Form this
   */
  cancelXhr: function() {
    if (this.xhr instanceof Xhr) {
      this.xhr.cancel();
    }

    return this;
  },

  /**
   * makes the form be remote by default
   *
   * @param Object default options
   * @return Form this
   */
  remotize: function(options) {
    if (!this.remote) {
      this.on('submit', Form_remote_send, options);
      this.remote = true;
    }

    return this;
  },

  /**
   * removes the remote call hook
   *
   * @return Form this
   */
  unremotize: function() {
    this.stopObserving('submit', Form_remote_send);
    this.remote = false;
    return this;
  }
});

/**
 * Catches the form submit events and sends the form remotely
 *
 * @param Event submit
 * @param Object xhr options
 * @return void
 */
function Form_remote_send(event, options) {
  event.stop();
  this.send(options);
}

/**
 * Adds Xhr params handling if a Form element is passed to Xhr#send
 * 
 * @param Object params - could be Hash or Form element
 * @return Object
 */
Xhr.include({
  prepareParams: function(params) {
    if (params && params instanceof Form) {
      this.form = params;
      params = params.values();
    }
    return params;
  }
});
