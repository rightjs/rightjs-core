/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

var Element = RightJS.Element = new Class(Wrapper, {
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
    Element_initialize(this, element, options);
  }

}, Element_Klass),

Element_wrappers = Element.Wrappers = {},
elements_cache = {},

/**
 * bulds dom-elements
 *
 * @param String element tag name
 * @param Object options
 * @return HTMLElement
 */
make_element = function (tag, options) {
  return (tag in elements_cache ? elements_cache[tag] : (
    elements_cache[tag] = document.createElement(tag)
  )).cloneNode(false);
};

//
// IE 6,7,8 (not 9!) browsers have a bug with checkbox and radio input elements
// it doesn't place the 'checked' property correctly, plus there are some issues
// with clonned SELECT objects, so we are replaceing the elements maker in here
//
if (IE8_OR_LESS) {
  make_element = function(tag, options) {
    if (options !== undefined && (tag === 'input' || tag === 'button')) {
      tag = '<'+ tag +' name="'+ options.name +
        '" type="'+ options.type +'"'+
        (options.checked ? ' checked' : '') + ' />';

      delete(options.name);
      delete(options.type);
    }

    return document.createElement(tag);
  };
}

/**
 * Basic element's constructor
 *
 * @param Element wrapper instance
 * @param mixed raw dom element of a string tag name
 * @param Object options
 * @return void
 */
function Element_initialize(inst, element, options) {
  if (typeof element === 'string') {
    inst._ = make_element(element, options);

    if (options !== undefined) {
      for (var key in options) {
        switch (key) {
          case 'id':    inst._.id        = options[key]; break;
          case 'html':  inst._.innerHTML = options[key]; break;
          case 'class': inst._.className = options[key]; break;
          case 'on':    inst.on(options[key]);           break;
          default:      inst.set(key, options[key]);
        }
      }
    }
  } else {
    inst._ = element;
  }
}
