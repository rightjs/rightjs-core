/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    Options: Object.merge(Fx.Options, {
      color:      '#FF8',
      transition: 'Exp'
    })
  },

// protected

  /**
   * starts the transition
   *
   * @param high String the hightlight color
   * @param back String optional fallback color
   * @return self
   */
  prepare: function(start, end) {
    var element       = this.element,
        element_style = element._.style,
        style_name    = 'backgroundColor',
        end_color     = end || element.getStyle(style_name);

    if (is_transparent(end_color)) {
      this.onFinish(function() { element_style[style_name] = 'transparent'; });

      // trying to find the end color
      end_color = [element].concat(element.parents())
        .map('getStyle', style_name)
        .reject(is_transparent)
        .compact().first() || '#FFF';
    }

    element_style[style_name] = (start || this.options.color);

    return this.$super({backgroundColor: end_color});
  }
});
