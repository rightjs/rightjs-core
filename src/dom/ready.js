/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
[window, document].each(function(object) {
  Observer.createShortcuts(object, ['ready']);
  var ready = object.ready.bind(object);
  
  if (Browser.IE) {
    var tmp = $E('div');
    (function() {
      var loaded = false;
      try {
        document.body.appendChild(tmp);
        tmp.remove();
        loaded = true;
      } catch(e) { arguments.callee.delay(50);}
      if (loaded) ready();
    })();
  } else if (document['readyState'] !== undefined) {
    (function() {
      $w('loaded complete').includes(document.readyState) ? ready() : arguments.callee.delay(50);
    })();
  } else {
    document.addEventListener('DOMContentLoaded', ready, false);
  }
  
});