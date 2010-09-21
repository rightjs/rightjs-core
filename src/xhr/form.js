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

/**
 * Catches the form submit events and sends the form remotely
 *
 * @param Event submit
 * @param Object xhr options
 * @return void
 */
function remote_send(event, options) {
  event.stop();
  this.send(Object.merge({spinner: this.first('.spinner')}, options));
}

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

    new Xhr(this._.action || document.location.href, options)
      .onComplete(this.enable.bind(this)).send(this);

    this.disable.bind(this).delay(1); // webkit needs this async call with iframed calls
    return this;
  },

  /**
   * makes the form be remote by default
   *
   * @param Object default options
   * @return Form this
   */
  remotize: function(options) {
    if (!this.observes('submit', remote_send)) {
      this.on('submit', remote_send, options);
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
    this.stopObserving('submit', remote_send);
    this.remote = false;

    return this;
  }
});
