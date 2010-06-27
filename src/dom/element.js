/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

RightJS.Element = function Element(element, options) {
  if (typeof element === 'string') {
    // building the element
    element = (element in elements_cache ? elements_cache[element] :
      (elements_cache[element] = document.createElement(element))
    ).cloneNode(false);
  
    // applying the options
    if (options) {
      for (var key in options) {
        if (key in element_arguments_map) {
          element[element_arguments_map[key]] = options[key];
        } else if (key in element_methods_map) {
          element[element_methods_map[key]](options[key]);
        } else {
          element.set(key, options[key]);
        }
      }
    }
  }
  
  // saving the raw elemnt reference
  this._ = element;
},

// Element constructor options mapper
element_arguments_map = {
  id:      'id',
  html:    'innerHTML',
  'class': 'className'
},

element_methods_map = {
  style:   'setStyle',
  on:      'on'
}

// caching the element instances to boos the things up
elements_cache = {};

if (Browser.IE) {
    //
  // IE browsers have a bug with checked input elements
  // and we kinda hacking the Element constructor so that
  // it affected IE browsers only
  //
  Element = eval('['+Element.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  )+']')[0];
  
  // preserving the old Element class
  var old_Element = window.Element;
  $ext(Element, old_Element).parent = old_Element;
}

make_extensible(Element);