/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = function(document) {
  this._ = document;
};

make_extensible(Document).include({
  byId: function(id) {
    return this._.getElementById(id);
  }
});