/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
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
try {
  document.createElement('<input/>'); // <- works for IE < 9 only

  make_element = function(tag, options) {
    if (tag === 'input' && options !== undefined) {
      tag = '<input name="'+ options.name +
        '" type='+ options.type +
        (options.checked ? ' checked' : '') +
      '/>';
    }

    return document.createElement(tag);
  };
} catch (e) {}

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
          case 'style': inst.setStyle(options[key]);     break;
          case 'on':    inst.on(options[key]);           break;
          default:      inst.set(key, options[key]);
        }
      }
    }
  } else {
    inst._ = element;
  }
}

/**
 * Element's own Klass function
 * we need that because it does some dynamic typecasting mumbo jumbo
 * plus we would like to optimize some stuff here and there
 *
 * @param raw dom element or the tag name
 * @param Object options
 * @return Element instance
 */
function Element_Klass(element, options) {
  Element_initialize(this, element, options);

  var inst = this, raw = inst._, cast = Wrapper.Cast(raw),
      uid = UID_KEY in raw ? raw[UID_KEY] : (raw[UID_KEY] = UID++);

  if (cast !== undefined) {
    inst = new cast(raw);
    if ('$listeners' in this) {
      inst.$listeners = this.$listeners;
    }
  }

  Wrappers_Cache[uid] = inst;

  return inst;
}

// searches for a suitable class for dynamic typecasting
Wrapper.Cast = function(unit) {
  return unit.tagName in Element_wrappers ? Element_wrappers[unit.tagName] : undefined;
};
