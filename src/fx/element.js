/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Credits:
 *   Some ideas are inspired by 
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods((function(methods) {
  var old_hide   = methods.hide,
      old_show   = methods.show,
      old_resize = methods.resize;

return {

  /**
   * hides the element with given visual effect
   *
   * @param String fx name
   * @param Object fx options
   */
  hide: function(fx, options) {
    return fx ? this.fx(fx, ['out', options], old_hide) : old_hide.call(this);
  },
  
  /**
   * shows the element with the given visual effect
   *
   * @param String fx name
   * @param Object fx options
   */
  show: function(fx, options) {
    return fx ? this.fx(fx, ['in', options], old_show) : old_show.call(this);
  },
  
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
      return old_resize.call(this, width, height);
    }
  },
  
  /**
   * runs the Fx.Morth effect to the given style
   *
   * @param Object style or a String class names
   * @param Object optional effect options
   * @return Element self
   */
  morph: function(style, options) {
    return this.fx('morph', [style, options || {}]); // <- don't replace with arguments
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
  
}})(Element.Methods));