/**
 * A simple document wrapper
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Class(Wrapper, {
  // returns the window reference
  window: function() {
    return wrap(this._.defaultView || this._.parentWindow);
  }
}),

// a common local wrapped document reference
current_Document = wrap(document);
