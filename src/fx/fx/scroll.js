/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Fx.Scroll = new Class(Fx, {
  
  initialize: function(element, options) {
    element = $(element);
    // swapping the actual scrollable when it's the window
    this.$super(element instanceof Window ? element._.document[Browser.WebKit ? 'body' : 'documentElement'] : element, options);
  },
  
  prepare: function(value) {
    this.before = {};
    this.after  = value;
    
    if ('x' in value) this.before.x = this.element._.scrollLeft;
    if ('y' in value) this.before.y = this.element._.scrollTop;
  },
  
  render: function(delta) {
    var before = this.before, key;
    for (key in before) {
      this.element._['scroll' + (key == 'x' ? 'Left' : 'Top')] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }
});