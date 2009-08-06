/**
 * represents a complex, multi ruled select strategy
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Multiple  = new Class({
  
  /**
   * constructor
   *
   * @param String css-rule
   */
  initialize: function(css_rule) {
    this.cssRule = css_rule;
    this.selectors = css_rule.split(',').map(function(rule) {
      return rule.blank() ? null : new Selector.Manual(rule);
    }).compact();
  },

  /**
   * searches for the first matching subnode
   *
   * @param Element base node
   * @return Element matching element or null if nothing found
   */
  first: function(node) {
    return this.selectors.map('first', node).first(function(i) { return !!i;});
  },

  /**
   * selects all the matching subnodes
   *
   * @param Element base node
   * @return Array found nodes
   */
  select: function(node) {
    return this.selectors.map('select', node, null).flatten().uniq();
  },

  /**
   * checks if the node matches the rule
   *
   * @param Element node to check
   * @return boolean check result
   */
  match: function(node) {
    return this.selectors.some('match', node) || !this.selectors.length;
  }
});
