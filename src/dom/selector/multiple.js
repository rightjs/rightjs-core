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
    this.selectors = [];
    
    var rules = css_rule.split(',');
    for (var i=0; i < rules.length; i++) {
      if (!rules[i].blank()) {
        this.selectors.push(new Selector.Manual(rules[i]));
      }
    }
  },

  /**
   * searches for the first matching subnode
   *
   * @param Element base node
   * @return Element matching element or null if nothing found
   */
  first: function(node) {
    var founds = [];
    for (var i=0; i < this.selectors.length; i++) {
      var found = this.selectors[i].first(node);
      if (found) founds.push(found);
    }
    
    return founds.first();
  },

  /**
   * selects all the matching subnodes
   *
   * @param Element base node
   * @return Array found nodes
   */
  select: function(node) {
    var founds = [];
    for (var i=0; i < this.selectors.length; i++)
      founds.merge(this.selectors[i].select(node));

    return founds;
  },

  /**
   * checks if the node matches the rule
   *
   * @param Element node to check
   * @return boolean check result
   */
  match: function(node) {
    for (var i=0; i < this.selectors.length; i++) {
      if (this.selectors[i].match(node))
        return true;
    }
    return !this.selectors.length; // fallback true only if there's no rules on the list
  }
});
