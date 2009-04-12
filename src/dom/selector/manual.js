/**
 * represents a manual (virtual) selector strategy
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Manual = new Class({
  ATOMS_SPLIT_RE: /(\s*([~>+ ])\s*)[^=]/,
  
  /**
   * constructor
   *
   * @param String css-rule
   */
  initialize: function(css_rule) {
    var css_rule = css_rule.trim();
    this.cssRule = css_rule;
    this.atoms = [];

    var relation = null, match = null;

    while (match = css_rule.match(this.ATOMS_SPLIT_RE)) {
      separator_pos = css_rule.indexOf(match[0]);
      this.atoms.push(new Selector.Atom(css_rule.substring(0, separator_pos), relation));

      relation = match[2]; // <- puts the current relation to the next atom

      // chopping off the first atom of the rule
      css_rule = css_rule.substr(separator_pos+(match[1].length==1 ? 1 : match[1].length-1)).trim();
    }
    this.atoms.push(new Selector.Atom(css_rule, relation));
  },

  /**
   * searches for the first matching subnode
   *
   * @param Element base node
   * @return Element matching element or null if nothing found
   */
  first: function(node) {
    return this.select(node).first();
  },

  /**
   * selects all the matching subnodes
   *
   * @param Element base node
   * @return Array found nodes
   */
  select: function(node, atoms) {
    var founds = [], atoms = atoms || this.atoms, atom = atoms[0];
    
    if (atom) {
      founds = this.find[atom.rel](node, atom);
      
      // if there is more atoms go recoursively
      if (atoms.length > 1) {
        var sub_founds = [];
        for (var i=0; i < founds.length; i++) {
          sub_founds.merge(this.select(founds[i], atoms.slice(1)));
        }
        founds = sub_founds;
      }
    }

    return founds;
  },

  /**
   * checks if the node matches the rule
   *
   * @param Element node to check
   * @return boolean check result
   */
  match: function(element) {
    if (element.parentNode) {
      var parent = Element.parents(element).last();
    } else {
      // putting the element in a temporary context so we could test it
      var parent = document.createElement('div'), fake_parent = true;
      parent.appendChild(element);
    }
    
    var match = this.select(parent).includes(element);
    
    if (fake_parent) parent.removeChild(element);
    
    return match;
  },
  
// protected

  find: {
    /**
     * search for any descendant nodes
     */
    ' ': function(element, atom) {
      var all = element.getElementsByTagName(atom.tag), matched = [];
      for (var i=0; i < all.length; i++) {
        if (atom.match(all[i])) {
          matched.push(all[i]);
        }
      }

      return matched;
    },

    /**
     * search for immidate descendant nodes
     */
    '>': function(element, atom) {
      var node = element.firstChild, matched = [];
      while (node) {
        if (atom.match(node)) {
          matched.push(node);
        }
        node = node.nextSibling;
      }
      return matched;
    },

    /**
     * search for immiate sibling nodes
     */
    '+': function(element, atom) {
      while ((element = element.nextSibling)) {
        if (element.tagName) {
          if (atom.match(element))
            return [element];
          break;
        }
      }
      return [];
    },

    /**
     * search for late sibling nodes
     */
    '~': function(element, atom) {
      var match = [];
      while ((element = element.nextSibling)) {
        if (atom.match(element))
          match.push(element);
      }
      return match;
    }
  } 

});