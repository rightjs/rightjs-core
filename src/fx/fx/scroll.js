/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
Fx.Scroll = new Class(Fx.Attr, {

  initialize: function(element, options) {
    element = $(element);
    // swapping the actual scrollable when it's the window
    this.$super(
      element instanceof Window ?
        element._.document[
          'body' in element._.document ? 'body' : 'documentElement'
        ] : element,
      options
    );
  },

  prepare: function(value) {
    var attrs = {};

    if ('x' in value) { attrs.scrollLeft = value.x; }
    if ('y' in value) { attrs.scrollTop  = value.y; }

    this.$super(attrs);
  }

});
