/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);
    
    if (this.how == 'in')
      this.element.setOpacity(0).show();
    
    return this.$super({opacity: isNumber(how) ? how : this.how == 'in' ? 1 : 0});
  }
});