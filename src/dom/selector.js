/**
 * The DOM elements selection handling class
 *
 * Credits:
 *   The naming principles of the unit are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */

// checking, monkeying and hooking the native css-selectors interface
//          IE8               W3C
[document, (Element.parent || self['HTMLElement'] || {}.constructor).prototype].each(function(object, i) {
  var old_selector     = object.querySelector;
  var old_selector_all = object.querySelectorAll;
  
  // the native selectors checking/monkeying
  var selectors = {};
  if (!old_selector) selectors.querySelector = function(css_rule) {
    return new Selector(css_rule).first(this);
  };
  if (!old_selector_all) selectors.querySelectorAll = function(css_rule) {
    return new Selector(css_rule).select(this);
  };
  
  // RightJS version of the selectors
  selectors.first = old_selector ? i ? function(css_rule) {
    return this.querySelector(this.tagName + ' ' + (css_rule || '*'));
  } : function(css_rule) {
    return this.querySelector(css_rule || '*');
  } : selectors.querySelector;
  
  selectors.select = old_selector_all ? i ? function(css_rule) {
    return $A(this.querySelectorAll(this.tagName + ' ' + (css_rule || '*')));
  } : function(css_rule) {
    return $A(this.querySelectorAll(css_rule || '*'));
  } : selectors.querySelectorAll;
  
  return i ? Element.addMethods(selectors) : $ext(object, selectors);
});


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
    
    this.cssRule = css_rule || '*';
    
    var strategy = 'Manual';
    if (this.cssRule.includes(',')) {
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
  first: Browser.OLD ? function(element) {
    var element = this.strategy.first(element);
    return  element ? $(element) : null;
  } : function(element) {
    return this.strategy.first(element);
  },
  
  /**
   * select all the subnodes of the element which are matching the rule
   *
   * @param Element element
   * @return Array list of found nodes
   */
  select: Browser.OLD ? function(element) {
    return this.strategy.select(element).map(Element.prepare);
  } : function(element) {
    return this.strategy.select(element);
  },
  
  /**
   * checks if the element matches the rule
   *
   * @param Element element
   * @return Boolean check result
   */
  match: function(element) {
    return this.strategy.match(element);
  }
});
