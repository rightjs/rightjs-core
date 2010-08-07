/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Wrapper({
  initialize: function(document) {
    this._ = document;
  }
});