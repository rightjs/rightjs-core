/**
 * represents a manual (virtual) selector strategy
 *
 * Credits:
 *   Some principles were inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
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
  select: function(node) {
    var founds, atom, index, sub_founds;
    
    for (var i=0; i < this.atoms.length; i++) {
      atom = this.atoms[i];
      if (i == 0) {
        founds =  this.find[atom.rel](node, atom);
        
      } else {
        if (i > 1) founds = this.uniq(founds);
        
        for (var j=0; j < founds.length; j++) {
          sub_founds = this.find[atom.rel](founds[j], atom);
          
          sub_founds.unshift(1); // <- nuke the parent node out of the list
          sub_founds.unshift(j); // <- position to insert the subresult

          founds.splice.apply(founds, sub_founds);
          
          j += sub_founds.length - 3;
        }
      }
    }
    
    return this.atoms.length > 1 ? this.uniq(founds) : founds;
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
          var parent = document.createElement('div'), parent_is_fake = true;
          parent.id = '-----fake'; // <- this id is used in the manual 'match' method,
                                   // to determine if the element originally had no parent node
          parent.appendChild(element);
        }

        var match = this.select(parent).includes(element);
        if (parent_is_fake) parent.removeChild(element);
    } else {
      // if there's just one atom, we simple match against it.
      var match = this.atoms[0].match(element);
    }
    
    return match;
  },
  
// protected
  uniq: function(elements) {
    var uniq = [], uids = [], uid;
    for (var i=0; i < elements.length; i++) {
      uid = $uid(elements[i]);
      if (!uids[uid]) {
        uniq.push(elements[i]);
        uids[uid] = true;
      }
    }
    
    return uniq;
  },

  find: {
    /**
     * search for any descendant nodes
     */
    ' ': function(element, atom) {
      var founds = $A(element.getElementsByTagName(atom.tag));
      if (atom.hasNonTagMatcher) {
        var matching = [];
        for (var i=0; i < founds.length; i++) {
          if (atom.match(founds[i]))
            matching.push(founds[i]);
        }
        return matching;
      }
      return founds;
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
          return atom.match(element) ? [element] : [];
        }
      }
      return [];
    },

    /**
     * search for late sibling nodes
     */
    '~': function(element, atom) {
      var founds = [];
      while ((element = element.nextSibling)) {
        if (atom.match(element))
          founds.push(element);
      }
      return founds;
    }
  } 

});