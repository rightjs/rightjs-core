/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Wrapper({
  initialize: function(document) {
    this._ = document;
  },

  // returns the window reference
  window: function() {
    return $(this._.defaultView || this._.parentWindow);
  }
});
