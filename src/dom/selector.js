/**
 * The DOM elements selection handling
 *
 * NOTE: this module is just a wrap over the native CSS-selectors feature
 *       see the olds/css.js file for the manual selector code
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include((function() {
  /**
   * Native css-selectors include the current element into the search context
   * and as we actually search only inside of the element we add it's tag
   * as a scope for the search
   */
  function stub_rule(css_rule, tag) {
    return css_rule ? css_rule.replace(/(^|,)/g, '$1'+ tag + ' ') : '*';
  };
  
return {
  /**
   * Extracts the first element matching the css-rule,
   * or just any first element if no css-rule was specified
   *
   * @param String css-rule
   * @return Element matching node or null
   */
  first: function(css_rule) {
    return this.querySelector(stub_rule(css_rule, this.tagName));
  },
  
  /**
   * Selects a list of matching nodes, or all the descendant nodes if no css-rule provided
   *
   * @param String css-rule
   * @return Array of elements
   */
  select: function(css_rule) {
    return $A(this.querySelectorAll(stub_rule(css_rule, this.tagName)));
  },
  
  /**
   * checks if the element matches this css-rule
   *
   * NOTE: the element should be attached to the page
   *
   * @param String css-rule
   * @return Boolean check result
   */
  match: function(css_rule) {
    var result, parent = this.tagName === 'HTML' ? this.ownerDocument : this.parents().last();
    
    // if it's a single node putting it into the context
    result = $(parent || $E('p').insert(this)).select(css_rule).include(this);
    
    if (!parent) this.remove();
    
    return result;
  }
}})());

// document-level hooks
$ext(document, {
  first: function(css_rule) {
    return this.querySelector(css_rule);
  },
  
  select: function(css_rule) {
    return $A(this.querySelectorAll(css_rule));
  }
});
