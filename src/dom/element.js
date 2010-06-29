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
elements_cache = {};

// NOTE: DON'T add the 'var' in front of the Element,
//       or IE will loose the reference to the old Element object
Element = RightJS.Element = function(element, options) {
  if (typeof element === 'string') {
    // building the element
    element = (element in elements_cache ? elements_cache[element] :
      (elements_cache[element] = document.createElement(element))
    ).cloneNode(false);
  }
  
  this._ = element;

  // applying the options
  if (options) {
    for (var key in options) {
      if (key in element_arguments_map) {
        element[element_arguments_map[key]] = options[key];
      } else if (key in element_methods_map) {
        element[element_methods_map[key]](options[key]);
      } else {
        this.set(key, options[key]);
      }
    }
  }
};

if (Browser.IE) {
  //
  // IE browsers have a bug with checked input elements
  // and we kinda hacking the Element constructor so that
  // it affected IE browsers only
  //
  Element = eval('['+Element.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  )+']')[0];
}

if (old_Element) {
  $ext(Element, old_Element).parent = old_Element;
}

make_extensible(Element);