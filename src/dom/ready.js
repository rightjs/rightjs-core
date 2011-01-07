/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
Document.include({
  on: function(name) {
    if (name === 'ready' && !this._iR) {
      var document = this._, ready = this.fire.bind(this, 'ready');

      // IE and Konqueror browsers
      if ('readyState' in document) {
        (function() {
          if (['loaded','complete'].include(document.readyState)) {
            ready();
          } else {
            arguments.callee.delay(50);
          }
        })();
      } else {
        document.addEventListener('DOMContentLoaded', ready, false);
      }

      this._iR = true;
    }

    return this.$super.apply(this, arguments);
  }
});

Observer_createShortcuts(Document.prototype, ['ready']);