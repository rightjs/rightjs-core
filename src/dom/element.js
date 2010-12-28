/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

// Element constructor options mapper
var element_arguments_map = {
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
  this._ = element = document.createElement(element);

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
};

//
// IE 6,7,8 (not 9!) browsers have a bug with checkbox and radio input elements
// it doesn't place the 'checked' property correctly, so we kinda hacking
// the Element constructor a bit for them
//
try {
  document.createElement('<input/>'); // <- works for IE < 9 only
  element_constructor = patch_function(element_constructor, /(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3!==undefined)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  );
} catch (e) {}

/**
 * The actual elements wrapper
 *
 */
var Element = RightJS.Element = new Wrapper({
  /**
   * constructor
   *
   * NOTE: this constructor will dynamically typecast
   *       the wrappers depending on the element tag-name
   *
   * @param String element tag name or an HTMLElement instance
   * @param Object options
   * @return Element element
   */
  initialize: function(element, options) {
    if (typeof element === 'string') {
      this.construct(element, options);
    } else {
      this._ = element;
    }
  },

// protected

  // constructs the event
  construct: element_constructor
});

Element.Wrappers = Element_wrappers;
