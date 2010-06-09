/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
[WIN, DOC].each(function(object) {
  Observer.createShortcuts(object, ['ready']);
  var ready = object.fire.bind(object, 'ready');
  
  // IE and Konqueror browsers
  if ('readyState' in DOC) {
    (function() {
      ['loaded','complete'].includes(DOC.readyState) ? ready() : arguments.callee.delay(50);
    })();
  } else {
    DOC.addEventListener('DOMContentLoaded', ready, false);
  }
  
});