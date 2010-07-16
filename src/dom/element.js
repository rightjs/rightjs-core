/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

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

Element_wrappers = {},

// caching the element instances to boos the things up
elements_cache = {},

/**
 * The elements constructor
 *
 * NOTE: this function is called in a context of a dom-wrapper
 *
 * @param String element tag name
 * @param Object options
 * @return HTMLElement
 */
element_constructor = function(element, options) {
  // building the element
  this._ = element = (element in elements_cache ? elements_cache[element] :
    (elements_cache[element] = document.createElement(element))
  ).cloneNode(false);

  // applying the options
  if (options !== undefined) {
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
  
  return element;
};

if (Browser.IE) {
  //
  // IE browsers have a bug with checked input elements
  // and we kinda hacking the Element constructor so that
  // it affected IE browsers only
  //
  element_constructor = eval('['+element_constructor.toString().replace(/(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  )+']')[0];
}

/**
 * The actual elements wrapper
 *
 * @param String element tag name or an HTMLElement instance
 * @param Object options
 * @return Element element
 */
var Element = RightJS.Element = new Wrapper(function(element, options) {
  if (typeof element === 'string') {
    element = element_constructor.call(this, element, options);
  }
  
  var tag = element.tagName, instance = Wrapper_cached(element, this);
  
  // dynamically swapping the wrapper if we have it in the system
  if (instance === this && tag in Element_wrappers) {
    delete(Wrappers_Cache[element[UID_KEY]]);
    instance = new Element_wrappers[tag](element);
    instance.$listeners = this.$listeners || [];
  }
  
  return instance;
});

Element.Wrappers = Element_wrappers;

// predefine the uniq id key in the prototype to boost up future assignments
try {
  HTMLElement[PROTO][UID_KEY] = false;
} catch(e) {}
