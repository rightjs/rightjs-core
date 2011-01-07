/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);

    if (this.how === 'in') {
      this.element.setStyle({opacity: 0}).show();
    }

    return this.$super({opacity: this.how === 'in' ? 1 : 0});
  }
});
