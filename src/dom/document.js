/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = BuildWrapper(function(document) {
  var uid = $uid(document);
  
  if (!Wrappers_Cache[uid]) {
    this._ = document;
    Wrappers_Cache[uid] = this;
  }
  
  return Wrappers_Cache[uid];
});