/**
 * this is a superclass for the bidirectional effects
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Twin = new Class(Fx.Morph, {
  
  /**
   * hides the element if it meant to be switched off
   *
   * @return Fx self
   */
  finish: function() {
    if (this.how == 'out') {
      old_hide.call(this.element);
    }
      
    return this.$super();
  },

// protected
  
  /**
   * assigns the direction of the effect in or out
   *
   * @param String 'in', 'out' or 'toggle', 'toggle' by default
   */
  setHow: function(how) {
    this.how = how || 'toggle';
    
    if (this.how == 'toggle')
      this.how = this.element.visible() ? 'out' : 'in';
  }

});