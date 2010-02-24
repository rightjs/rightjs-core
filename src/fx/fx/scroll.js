/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Fx.Scroll = new Class(Fx, {
  prepare: function(value) {
    this.before = {};
    this.after  = value;
    
    if (defined(value.x)) this.before.x = this.element.scrollLeft;
    if (defined(value.y)) this.before.y = this.element.scrollTop;
  },
  
  render: function(delta) {
    var before = this.before, key;
    for (key in before) {
      this.element['scroll' + (key == 'x' ? 'Left' : 'Top')] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }
});