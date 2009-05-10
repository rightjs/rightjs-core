/**
 * The DOM elements selection handling class
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Selector = new Class({
  extend: {
    cache: {}
  },
    
  /**
   * constructor
   *
   * @param String css rule definition
   * @return void
   */
  initialize: function(css_rule) {
    var cached = isString(css_rule) ? Selector.cache[css_rule] : css_rule;
    if (cached) return cached;
    Selector.cache[css_rule] = this;
    
    this.setCssRule(css_rule);
    
    var strategy = 'Manual';
    if (document.querySelector) {
      strategy = 'Native';
    } else if (this.cssRule.includes(',')) {
      strategy = 'Multiple';
    }
    
    this.strategy = new Selector[strategy](this.cssRule);
  },
  
  /**
   * selects the first matching element which is a sub node of the given element
   * and matches the selector's css-rule
   *
   * @param Element element
   * @return Element matching element or null if nothing found
   */
  first: function(element) {
    var element = this.strategy.first(element);
    return  element ? $(element) : null;
  },
  
  /**
   * select all the subnodes of the element which are matching the rule
   *
   * @param Element element
   * @return Array list of found nodes
   */
  select: function(element) {
    return this.strategy.select(element).map($);
  },
  
  /**
   * checks if the element matches the rule
   *
   * @param Element element
   * @return Boolean check result
   */
  match: function(element) {
    return this.strategy.match(element);
  },
  
  /**
   * sets up the selector's css-rule
   *
   * @param String css-rule
   * @return Selector self
   */
  setCssRule: function(css_rule) {
    this.cssRule = css_rule || '*';
    
    // converting virtual selectors into real ones
    [
      [/:last(?!-)/g, ':last-child'],
      [/:only(?!-)/g, ':only-child'],
      [/:odd/g,  ':nth-child(2n+1)'],
      [/:even/g, ':nth-child(2n)'],
      [/:nth-child\(odd\)/g,  ':nth-child(2n+1)'],
      [/:nth-child\(even\)/g, ':nth-child(2n)'],
      [/:index\(\s*\d+\s*\)/g, function(m) {return ":nth-child("+(m.match(/\d+/).first().toInt() + 1)+")"}]
    ].each(function(pair) {
      this.cssRule = this.cssRule.replace(pair[0], pair[1]);
    }, this);
    
    return this;
  }
});
