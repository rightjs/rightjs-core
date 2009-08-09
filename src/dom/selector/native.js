/**
 * represents the native browser's based selector strategy
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Native = new Class({
  initialize: function(css_rule) {
    this.cssRule = css_rule;
  },
  
  first: function(element) {
    return element.querySelector(this.fixedCssRule(element));
  },
  
  select: function(element) {
    return $A(element.querySelectorAll(this.fixedCssRule(element)));
  },
  
  // reusing the manual method, case it's the same
  match: Selector.Manual.prototype.match,
  
// protected

  // native method counts the element in the css rule scope by default
  // don't know why. probably just a Safari bug.
  // 
  // as a temporary solution add the element tag name as a scope so the result
  // contained only the internal nested nodes.
  fixedCssRule: function(element) {
    return (isElement(element) ? element.tagName+ ' ' : '') +this.cssRule;
  }
});