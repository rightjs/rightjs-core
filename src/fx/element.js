/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods({
  /**
   * runs the Fx.Morth effect to the given style
   *
   * @param Object style or a String css-selector
   * @return Element self
   */
  morph: function(style, options) {
    new Fx.Morph(this, options).start(style);
    return this;
  },
  
  /**
   * highlights the element
   *
   * @param String start color
   * @param String optional end color
   * @param Object effect options
   * @return Element self
   */
  highlight: function(start, end) {
    var args = $A(arguments), options = {};
    
    if (isHash(args.last())) {
      options = args.pop();
    }
    
    new Fx.Highlight(this, options).start(args[0], args[1]);
    return this;
  }
  
});