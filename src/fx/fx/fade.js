/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Fade = new Class(Fx.Tween, {
  start: function(how) {
    this.setHow(how);
    
    if (this.how == 'in')
      this.element.setOpacity(0).show();
    
    this.$super({opacity: typeof(how) == 'number' ? how : this.how == 'in' ? 1 : 0});
  }
});