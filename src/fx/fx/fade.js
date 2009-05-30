/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Fade = new Class(Fx.Morph, {
  extend: {
    OPTIONS: Object.merge(Fx.OPTIONS, {
      direction: 'out'
    })
  },
  
  start: function(direction) {
    direction = direction || this.options.direction;
    var opacity = direction == 'in' ? 1 : direction == 'out' ? 0 : direction;
    
    if (opacity == 0) this.onFinish(function() { this.element.hide() });
    if (opacity == 1) this.element.setOpacity(0).show();
    
    this.$super({opacity: opacity});
  }
});