/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Slide = new Class(Fx.Tween, {
  extend: {
    OPTIONS: Object.merge(Fx.OPTIONS, {
      direction: 'top'
    })
  },
  
  start: function(how) {
    this.setHow(how);
    
    var width = this.element.offsetWidth+'px', height = this.element.offsetHeight+'px';
    
    // swopping the element with a processing frame
    this._element = this.element;
    this.element = $E('div').setStyle({overflow: 'hidden', width: width, height: height});
    this._element.wrap(this.element);
    
    // swopping the element back on cancel
    this.onCancel('_swapBack');
    
    return this.$super(this._endStyle(this.options.direction, width, height));
  },
  
  finish: function() {
    this._swapBack();
    return this.$super();
  },
  
// protected
  
  // swaps the element and working frame back
  _swapBack: function() {
    if (this._element) {
      this.element.replace(this._element);
      this.element = this._element;
      this._element = null;
    }
  },
  
  // calculates the final style
  _endStyle: function(direction, width, height) {
    var style = {};
    
    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';
      
      if (direction == 'right') {
        style['marginLeft'] = width;
      } else if (direction == 'bottom') {
        style['marginTop'] = height;
      }
      
    } else if (this.how == 'in') {
      this._element.show();
      width  = this._element.offsetWidth  + 'px';
      height = this._element.offsetHeight + 'px';
      
      if (['top', 'bottom'].includes(direction)) {
        style['height'] = height;
        this.element.style.width = width;
      } else {
        style['width'] = width;
        this.element.style.height = height;
      }
      
      if (direction == 'right') {
        this.element.style.marginLeft = width;
        style['marginLeft'] = '0px'
      } else if (direction == 'bottom') {
        this.element.style.marginTop = height;
        style['marginTop'] = '0px';
      }
    }
    
    return style;
  }
});