/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);
    
    if (this.how == 'in') {
      old_show.call(this.element.setStyle({opacity: 0}));
    }
    
    return this.$super({opacity: isNumber(how) ? how : this.how == 'in' ? 1 : 0});
  }
});