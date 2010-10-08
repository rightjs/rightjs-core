/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
[Window, Document].each(function(object) {
  var proto = object[PROTO], old_on = proto.on;

  // redefining the observer method to catch up
  proto.on = function(name) {
    if (name == 'ready' && !this._wR) {
      var document = this._, ready = this.fire.bind(this, 'ready');
      document = document.nodeType == 9 ? document : document.document;

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

      this._wR = true;
    }
    return old_on.apply(this, arguments);
  };

  Observer_createShortcuts(proto, ['ready']);
});

/**
 * Deprecated method names aliases
 *
 * In RightJS 2 some methods were renamed so those are the aliases
 * to support the old API
 *
 * NOTE: Will be nuked in couple of releases!
 */
$alias(Element[PROTO], {
  subNodes: 'children',
  sizes:    'size',
  select:   'find'
});

$alias(Document[PROTO], {
  select:   'find'
});

$alias(Window[PROTO], {
  sizes: 'size'
});
