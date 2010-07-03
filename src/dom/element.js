/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

// preserving the old Element class
var old_Element = window.Element,

// Element constructor options mapper
element_arguments_map = {
  id:      'id',
  html:    'innerHTML',
  'class': 'className'
},

element_methods_map = {
  style:   'setStyle',
  on:      'on'
},

// caching the element instances to boos the things up
elements_cache = {},

// the elements building function
element_build = function(element, options) {
  // building the element
  if (typeof element === 'string') {
    element = (elements_cache[element] ||
      (elements_cache[element] = document.createElement(element))
    ).cloneNode(false);
  }
  
  // checking the wrappers cache to enforce a single instance
  var uid = element[UID_KEY] || (element[UID_KEY] = UID++);
  
  if (!(uid in Wrappers_Cache)) {
    Wrappers_Cache[uid] = this;
    
    this._ = element;

    // applying the options
    if (options) {
      for (var key in options) {
        if (key in element_arguments_map) {
          element[element_arguments_map[key]] = options[key];
        } else if (key in element_methods_map) {
          this[element_methods_map[key]](options[key]);
        } else {
          this.set(key, options[key]);
        }
      }
    }
  }

  return Wrappers_Cache[uid];
};

if (Browser.IE) {
  //
  // IE browsers have a bug with checked input elements
  // and we kinda hacking the Element constructor so that
  // it affected IE browsers only
  //
  element_build = eval('['+element_build.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  )+']')[0];
}

// NOTE: DON'T add the 'var' in front of the Element,
//       or IE will loose the reference to the old Element object
Element = RightJS.Element = BuildWrapper(element_build);

if (old_Element) {
  Element.extend(old_Element).parent = old_Element;
}

// predefine the uniq id key in the prototype to boost up future assignments
try {
  HTMLElement[PROTO][UID_KEY] = false;
} catch(e) {}