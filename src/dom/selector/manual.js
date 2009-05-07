/**
 * represents a manual (virtual) selector strategy
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Manual = new Class({
  ATOMS_SPLIT_RE: /(\s*([~>+ ])\s*)(?![^\s\)\]]*(\)|\]))/,
  
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
        if (atoms[1].rel != ' ' && atoms[1].rel != '>') this._hsr = true; // checking if the rule has siblings relations
        
        var sub_founds = [], sub_result, index;
        for (var i=0; i < founds.length; i++) {
          sub_result = this.select(founds[i], atoms.slice(1));
          
          if (atoms[1].rel == '>') {
            // injecting intersecting search results, so they were placed correctly
            // FIXME there gotta be a better way
            for (var j=0; j < sub_result.length; j++) {
              if ((index = founds.indexOf(sub_result[j])) != -1) {
                sub_result = sub_result.slice(0, index+1).concat(
                  this.select(founds[index], atoms.slice(1))).concat(
                    sub_result.slice(index+1));
              }
            }
          }
          
          sub_founds = sub_founds.concat(sub_result);
        }
        
        founds = sub_founds;
      }
      
      // removing duplications and reorganizing the result in a case of siblings search
      if (atoms.length == this.atoms.length && atoms.length > 1 && founds.length > 1)
        founds = this._hsr ? this.sortFounds(founds.uniq(), node) : founds.uniq();
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
    // if there's more than one atom, we match the element in a context
    if (!this.atoms || this.atoms.length > 1) {
      if (element.parentNode) {
          // searching for the top parent node
          // NOTE: don't use the Element.parents in here to avoid annecessary elements extending
          var p = element, parent;
          while ((p = p.parentNode)) parent = p;
        } else {
          // putting the element in a temporary context so we could test it
          var parent = document.createElement('div'), fake_parent = true;
          parent.id = '-----fake'; // <- this id is used in the manual 'match' method, to determine if the element originally had no parent node
          parent.appendChild(element);
        }

        var match = this.select(parent).includes(element);
        if (fake_parent) Element.remove(element);
    } else {
      // if there's just one atom, we simple match against it.
      var match = this.atoms[0].match(element);
    }
    
    return match;
  },
  
// protected
  
  // reorganising the search result in the original structure order
  // so it was consitent with the native css-matching algorithm
  //
  // FIXME: there gotta be a better way
  sortFounds: function(founds, node) {
    var result = [], child = node.firstChild;
    
    while (child) {
      if (founds.indexOf(child) != -1)
        result.push(child);
      else
        result = result.concat(this.sortFounds(founds, child));
        
      child = child.nextSibling;
    }
    
    return result;
  },

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