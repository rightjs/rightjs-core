/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Fx.Scroll = new Class(Fx, {
  prepare: function(value) {
    this.before = {};
    this.after  = value;
    
    if (value.x != undefined) this.before.x = this.element.scrollLeft;
    if (value.y != undefined) this.before.y = this.element.scrollTop;
  },
  
  render: function(delta) {
    for (var key in this.after) {
      this.element['scroll' + (key === 'x' ? 'Left' : 'Top')] = this.before[key] + (this.after[key] - this.before[key]) * delta;
    }
  }
});