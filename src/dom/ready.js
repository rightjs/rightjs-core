/**
 * The dom-ready event handling code
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
[window, document].each(function(object) {
  Observer.create(object, ['ready']);
  var ready = object.ready.bind(object);
  
  if (Browser.IE) {
    window.attachEvent('onload', ready);
  } else if (document['readyState'] !== undefined) {
    (function() {
      $w('loaded complete').includes(document.readyState) ? ready() : arguments.callee.delay(50);
    })();
  } else {
    document.addEventListener('DOMContentLoaded', ready, false);
  }
  
});