/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Wrapper(function(document) {
  return Wrapper_cached(document, this);
});