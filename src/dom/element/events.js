/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
[Element, Document, Window].each('include', $ext(Observer_create({}), {
  /**
   * The basic events handling attachment method
   * SEE Observer#on for more details about supported arguments
   *
   * @returnt this
   */
  on: function() {
    Observer_on(this, arguments, function(hash) {

      if (hash.e === 'mouseenter' || hash.e === 'mouseleave') {
        mouse_io_activate();
        hash.n = hash.e;
        hash.w = dummy(); // so IE didn't bother
      } else {
        if (hash.e === 'contextmenu' && Browser.Konqueror) {
          hash.n = 'rightclick';
        } else if (hash.e === 'mousewheel' && Browser.Gecko) {
          hash.n = 'DOMMouseScroll';
        } else {
          hash.n = hash.e;
        }

        hash.w = function(event) {
          event = new Event(event, hash.t);
          if (hash.f.apply(hash.t, (hash.r?[]:[event]).concat(hash.a)) === false) {
            event.stop();
          }
        };
      }

      if (Browser_IE) {
        hash.t._.attachEvent('on'+hash.n, hash.w);
      } else {
        hash.t._.addEventListener(hash.n, hash.w, false);
      }

      return hash;
    });

    return this;
  },

  /**
   * Stops an event handling
   *
   * @param String event name or a function callback
   * @param function callback or nothing
   * @return this
   */
  stopObserving: function(event, callback) {
    Observer_stopObserving(this, event, callback, function(hash) {
      if (Browser_IE) {
        hash.t._.detachEvent('on'+ hash.n, hash.w);
      } else {
        hash.t._.removeEventListener(hash.n, hash.w, false);
      }
    });

    return this;
  },

  /**
   * Artificially trigers the event on the element
   *
   * @param string event name or an Event instance
   * @param Object options
   * @return this
   */
  fire: function(event, options) {
    var parent = this.parent && this.parent();

    if (!(event instanceof Event)) {
      event = new Event(event, $ext({target: this._}, options));
    }

    event.currentTarget = this;

    (this.$listeners || []).each(function(hash) {
      if (hash.e === event.type && hash.f.apply(this, (hash.r?[]:[event]).concat(hash.a)) === false) {
        event.stop();
      }
    }, this);

    if (!event.stopped && parent && parent.fire) {
      parent.fire(event);
    }

    return this;
  },

  /**
   * a simple events terminator method to be hooked like this.onClick('stopEvent');
   *
   * @return false
   */
  stopEvent: function() { return false; }
}));

// couple more shortcuts for the window
Observer_createShortcuts(Window[PROTO], $w('blur focus scroll resize load'));

/**
 * Registers a list of event-binding shortcuts like
 *  $(element).onClick
 *  $(element).onMouseover
 *
 * @param String space separated event names
 * @return void
 */
function Element_add_event_shortcuts(tokens) {
  tokens = $w(tokens);
  Event_delegation_shortcuts = Event_delegation_shortcuts.concat(tokens);

  Observer_createShortcuts(Element[PROTO], tokens);
  Observer_createShortcuts(Document[PROTO], tokens);
}

Element_add_event_shortcuts(
  'click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup'
);
