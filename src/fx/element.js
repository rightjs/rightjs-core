/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods({
  /**
   * hides the element with given visual effect
   *
   * @param String fx name
   * @param Object fx options
   */
  hide: function(fx, options) {
    return fx ? this.fx(fx, ['out', options], this._hide) : this._hide();
  },
  _hide: Element.Methods.hide,
  
  /**
   * shows the element with the given visual effect
   *
   * @param String fx name
   * @param Object fx options
   */
  show: function(fx, options) {
    return fx ? this.fx(fx, ['in', options], this._show) : this._show();
  },
  _show: Element.Methods.show,
  
  /**
   * resizes the element using the Morph visual effect
   *
   * @param Integer width
   * @param Integer height
   * @param Object options
   */
  resize: function(width, height, options) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    if (options) {
      var style = {};
      if (isNumber(height)) style.height = height+'px';
      if (isNumber(width))  style.width  = width +'px';
      
      if (!isHash(options)) options = {duration: options};
      
      return this.fx('morph', [style, options]);
    } else {
      return this._resize(width, height);
    }
  },
  _resize: Element.Methods.resize,
  
  /**
   * runs the Fx.Morth effect to the given style
   *
   * @param Object style or a String class names
   * @param Object optional effect options
   * @return Element self
   */
  morph: function(style, options) {
    return this.fx('morph', [style, options]);
  },
  
  /**
   * highlights the element
   *
   * @param String start color
   * @param String optional end color
   * @param Object effect options
   * @return Element self
   */
  highlight: function() {
    return this.fx('highlight', arguments);
  },
  
  /**
   * runs the Fx.Fade effect on the element
   *
   * @param mixed fade direction 'in' 'out' or a float number
   * @return Element self
   */
  fade: function() {
    return this.fx('fade', arguments);
  },
  
  /**
   * runs the Fx.Slide effect on the element
   *
   * @param String 'in' or 'out'
   * @param Object effect options
   * @return Element self
   */
  slide: function() {
    return this.fx('slide', arguments);
  },
  
// protected

  // runs an Fx on the element
  fx: function(name, args, on_finish) {
    var args = $A(args).compact(), options = {};
    if (isHash(args.last())) { options = args.pop(); }
    
    var fx = new Fx[name.capitalize()](this, options);
    if (on_finish) fx.onFinish(on_finish.bind(this));
    fx.start.apply(fx, args);
    
    return this;
  }
  
});