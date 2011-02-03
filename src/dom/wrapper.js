/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */

var Wrapper = RightJS.Wrapper = new Class({
  // predefining the property in the prototype
  _: undefined,

  /**
   * Default constructor
   *
   * @param mixed raw dom unit
   * @return void
   */
  initialize: function(raw_object) {
    this._ = raw_object;
  }
});

// exposing the cache so it could be manupulated externally
Wrapper.Cache = Wrappers_Cache;

// instantiating the actual class object for a wrapper
function Wrapper_makeKlass() {
  /**
   * Default wrappers Klass function
   *
   * @param mixed the raw object
   * @param Object options
   * @return void
   */
  return function(object, options) {
    Class_checkPrebind(this);
    this.initialize(object, options);
    var item = this._, uid = UID_KEY in item ? item[UID_KEY] :
      // NOTE we use positive indexes for dom-elements and negative for everything else
      (item[UID_KEY] = (item.nodeType === 1 ? 1 : -1) * UID++);

    Wrappers_Cache[uid] = this;
  };
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

/**
 * Event's own Klass function, we don't need to check
 * nothing in here, don't need to hit the wrappers cache and so one
 *
 * @param raw dom-event or a string event-name
 * @param bounding element or an object with options
 * @return void
 */
function Event_Klass(event, bound_element) {
  if (typeof(event) === 'string') {
    event = $ext({type: event}, bound_element);
    this.stopped = event.bubbles === false;

    if (isHash(bound_element)) {
      $ext(this, bound_element);
    }
  }

  this._             = event;
  this.type          = event.type;

  this.which         = event.which;
  this.keyCode       = event.keyCode;

  this.target        = wrap(
    // Webkit throws events on textual nodes as well, gotta fix that
    event.target && 'nodeType' in event.target && event.target.nodeType === 3 ?
      event.target.parentNode : event.target
  );

  this.currentTarget = wrap(event.currentTarget);
  this.relatedTarget = wrap(event.relatedTarget);

  this.pageX         = event.pageX;
  this.pageY         = event.pageY;

  // making old IE attrs looks like w3c standards
  if (IE8_OR_LESS && 'srcElement' in event) {
    this.which         = event.button === 2 ? 3 : event.button === 4 ? 2 : 1;

    this.target        = wrap(event.srcElement) || bound_element;
    this.relatedTarget = this.target._ === event.fromElement ? wrap(event.toElement) : this.target;
    this.currentTarget = bound_element;

    var scrolls = this.target.win().scrolls();

    this.pageX = event.clientX + scrolls.x;
    this.pageY = event.clientY + scrolls.y;
  }
}


/**
 * Private quick wrapping function, unlike `$`
 * it doesn't search by ID and handle double-wrapps
 * just pure dom-wrapping functionality
 *
 * @param raw dom unit
 * @return Wrapper dom-wrapper
 */
function wrap(object) {
  if (object != null) {
    var wrapper = UID_KEY in object ? Wrappers_Cache[object[UID_KEY]] : undefined;

    if (wrapper !== undefined) {
      return wrapper;
    } else if (object.nodeType === 1) {
      return new Element(object);
    } else if (object.nodeType === 9) {
      return new Document(object);
    } else if (object.window == object) {
      return new Window(object);
    } else if (isElement(object.target) || isElement(object.srcElement)) {
      return new Event(object);
    }
  }

  return object;
}