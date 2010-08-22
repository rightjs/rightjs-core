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
    var before = this.before = {}, element = this.element._;
    
    this.after  = value;
    
    if ('x' in value) { before.x = element.scrollLeft; }
    if ('y' in value) { before.y = element.scrollTop;  }
  },
  
  render: function(delta) {
    var before = this.before, key;
    for (key in before) {
      this.element._['scroll' + (key == 'x' ? 'Left' : 'Top')] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }
});