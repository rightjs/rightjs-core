/**
 * An abstract attributes based Fx
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Fx.Attr = new Class(Fx, {

  prepare: function(attrs) {
    this.before = {};
    this.after  = attrs;
    var key, element = this.element._;

    for (key in attrs) {
      this.before[key] = element[key];
    }
  },

  render: function(delta) {
    var key, element = this.element._, before = this.before;
    for (key in before) {
      element[key] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }

});