/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Class(Wrapper, {
  // returns the window reference
  window: function() {
    return $(this._.defaultView || this._.parentWindow);
  }
});
