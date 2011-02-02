/**
 * Some String level shortcuts to handle collections of elements
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */

/**
 * Some nice shortcuts for the document-level events delegation handling
 *
 * USAGE:
 *
 *   "ul#main-menu li".on("click", function() { alert('clicked'); });
 *   "ul#main-menu li".on("mouseover", "addClass", "hovered");
 *   "ul#main-menu li".on("mouseout", "removeClass", "hovered");
 *
 *   // or like that in a shash
 *   "ul#main-menu li".on({
 *     click:     function() { alert('clicked'); },
 *     mouseover: ['addClass',    'hovered'],
 *     mouseout:  ['removeClass', 'hovered'],
 *     dblclick:  'hide'
 *   });
 *
 *
 *   "#css.rule".observes('click');
 *   "#css.rule".observes('click', function() {});
 *   "#css.rule".observes('click', 'method_name');
 *   ....
 *
 *   "#css.rule".stopObserving('click');
 *   "#css.rule".stopObserving('click', function() {});
 *   "#css.rule".stopObserving('click', 'method_name');
 *    ....
 */
Object.each({
  on:            'delegate',
  stopObserving: 'undelegate',
  observes:      'delegates'
}, function(name, method) {
  String.prototype[name] = function() {
    var args = $A(arguments), result;

    args.splice(1,0,''+this);
    result = current_Document[method].apply(current_Document, args);

    return result === current_Document ? this : result;
  };
});
var old_on = String.prototype.on;
String.prototype.on = function(hash) {
  if (isHash(hash)) {
    for (var key in hash) {
      old_on.apply(this, [key].concat([hash[key]]));
    }
  } else {
    old_on.apply(this, arguments);
  }
  return this;
};

/**
 * building the list of String#onEvent shortucts
 *
 * USAGE:
 *
 *    "#css.rule".onClick(function() {...});
 *    "#css.rule".onMouseover('method_name');
 */
Event_delegation_shortcuts.each(function(name) {
  String.prototype['on'+name.capitalize()] = function() {
    return this.on.apply(this, [name].concat($A(arguments)));
  };
});

/**
 * The rest of the DOM methods access
 *
 * USAGE:
 *   "#css.rule".addClass('boo-hoo');
 *   "#css.rule".setStyle({color: 'red'});
 *
 */
$w('Element Input Form').each(function(klass) {
  Object.each(klass in RightJS ? RightJS[klass].prototype : {}, function(name, method) {
    if (isFunction(method) && !(name in String.prototype)) {
      String.prototype[name] = function() {
        var nodes = $$(this, true), i=0, l = nodes.length, first=true, element, result;
        for (; i < l; i++) {
          element = wrap(nodes[i]);
          result  = element[name].apply(element, arguments);

          // checking if that's a data-retrieving call
          if (first) {
            if (result !== element) {
              return result;
            }
            first = false;
          }
        }

        // don't return the string itself in here,
        // it will screw with data-retrieving calls on empty collections
        return null;
      };
    }
  });
});