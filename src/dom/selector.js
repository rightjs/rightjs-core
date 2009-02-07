/**
 * The DOM elements selection handling class
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Selector = new Class({
  
  /**
   * constructor
   *
   * @param String css rule definition
   * @return void
   */
  initialize: function(css_rule) {
    var css_rule = css_rule || '*';
    if (isString(css_rule)) {
      if (css_rule.includes(',')) {
        return Selector.build(css_rule); // building selections collection
      } else {
        this.parseAtoms(css_rule);
      }
    } else {
      return css_rule; // bypassing the rule if it's already initialized
    }
  },
  
  /**
   * select all the subnodes of the element which are matching the rule
   *
   * @param Element element
   * @param Array optional atoms list, used for internal purposes in a recursive search
   * @return Array list of found nodes
   */
  select: function(element, atoms) {
    var founds = [], atoms = atoms || this.atoms, atom = atoms[0];

    if (atom) {
      founds = this.find[atom.rel](element, atom);
      
      // if there's more than one atom in the rule, then go recursively for the rest of the atoms
      if (atoms.length > 1) {
        var sub_founds = [];
        for (var i=0; i < founds.length; i++) {
          sub_founds.merge(this.select(founds[i], atoms.slice(1)));
        }
        founds = sub_founds;
      }
    }
    
    // extending the found elements
    for (var i=0; i < founds.length; i++)
      $(founds[i]);
    
    return founds;
  },
  
  /**
   * checks if the element matches the rule
   *
   * NOTE: will check only agains the first atom in the rule
   *
   * TODO: think about something like
   *
   *       this.select(document).includes(element);
   *
   *       this probably will go too slow, but work more correctly
   *
   * @param Element element
   * @return Boolean check result
   */
  match: function(element) {
    if (this.atoms.length > 1 && element.parentNode) {
      return this.select($(element).parents().last()).includes(element);
    } else {
      return !this.atoms[0] || this.atoms[0].match(element);
    }
  },

// protected
  ATOMS_SPLIT_RE: /(\s*([~>+ ])\s*)[^=]/,
  atoms: [],
  
  parseAtoms: function(css_rule) {
    this.atoms = [];
    
    var relation = null, match = null, Atom = Selector.Atom;
    
    while (match = css_rule.match(this.ATOMS_SPLIT_RE)) {
      separator_pos = css_rule.indexOf(match[0]);
      this.atoms.push(new Atom(css_rule.substring(0, separator_pos), relation));
      
      relation = match[2]; // <- puts the current relation to the next atom

      // chopping off the first atom of the rule
      css_rule = css_rule.substr(separator_pos+(match[1].length==1 ? 1 : match[1].length-1)).trim();
    }
    this.atoms.push(new Atom(css_rule, relation));
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
  },
  
  extend: {
    /**
     * this class represent a simple css-definition atom unit
     *
     * the main purpose is to organize the simpliest case of css-rule match.
     */
    Atom: new Class({
      id: null,
      tag: '*',
      classes: [],
      pseudo: null,
      pseudoValue: null,
      attrs: {},

      rel: ' ',

      ID_RE:     /#([\w\-_]+)/,
      TAG_RE:    /^[\w\*]+/,
      CLASS_RE:  /\.([\w\-\._]+)/,
      PSEUDO_RE: /:([\w\-]+)(\((.+?)\))*$/,
      ATTRS_RE:  /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/,

      /**
       * constructor
       *
       * @param String css-definition
       * @param String relation with the previous atom
       * @return void
       */
      initialize: function(css_rule, rel) {
        css_rule = css_rule.trim();
        this.rel = rel || ' ';
        
        // NOTE! dont change the order of the atom parsing, there might be collisions
        this.attrs = {};
        while((m = css_rule.match(this.ATTRS_RE))) {
          this.attrs[m[1]] = { op: m[2], value: m[5] || m[6] };
          css_rule = css_rule.replace(m[0], '');
        }
        
        if ((m = css_rule.match(this.PSEUDO_RE))) {
          this.pseudo = m[1];
          this.pseudoValue = m[3] == '' ? null : m[3];
          css_rule = css_rule.replace(m[0], '');
        } else {
          this.pseudo = null;
          this.pseudoValue = null;
        }
        
        this.id  = (css_rule.match(this.ID_RE) || [1, null])[1];
        this.tag = (css_rule.match(this.TAG_RE) || '*').toString().toLowerCase();
        this.classes = (css_rule.match(this.CLASS_RE) || [1, ''])[1].split('.').without('');
      },

      /**
       * cecks if the node matches the atom
       *
       * @param Element element
       * @return Boolean check result
       */
      match: function(element) {
        return !!(this.matchId(element) && this.matchTag(element) && this.matchClass(element) 
          && this.matchAttrs(element) && this.matchPseudo(element));
      },

    // protected

      matchId: function(element) {
        return !this.id || element.id == this.id;
      },

      matchTag: function(element) {
        return this.tag == '*' || element.tagName.toLowerCase() == this.tag;
      },

      matchClass: function(element) {
        if (this.classes.length) {
          var names = element.className.split(' ');
          return names.includes.apply(names, this.classes);
        }
        return true;
      },

      matchAttrs: function(element) {
        var matches = true;
        for (var key in this.attrs) {
          matches &= this.matchAttr(element, key, this.attrs[key]['op'], this.attrs[key]['value']);
        }
        return matches;
      },
      
      matchAttr: function(element, name, operator, value) {
        var attr = $(element).get(name) || '';
        switch(operator) {
          case '=':  return attr == value;
          case '*=': return attr.includes(value);
          case '^=': return attr.startsWith(value);
          case '$=': return attr.endsWith(value);
          case '!=': return attr != value;
          case '~=': return attr.split(' ').includes(value);
          case '|=': return attr.split('-').includes(value);
        }
        return false;
      },

      matchPseudo: function(element) {
        return !this.pseudo || (this.pseudoMatchers[this.pseudo] &&
          this.pseudoMatchers[this.pseudo].call(element, this.pseudoValue, this.pseudoMatchers));
      },

      /**
       * W3C pseudo matchers
       *
       * NOTE: methods of the module will be called in a context of an element
       */
      pseudoMatchers: {
        checked: function() {
          return this.checked;
        },
        
        disabled: function() {
          return this.disabled;
        },

        empty: function() {
          return !(this.innerText || this.innerHTML || this.textContent || '').length;
        },

        not: function(css_rule) {
          return !$(this).match(css_rule);
        },

        contains: function(text) {
          return (this.innerText || this.innerHTML || this.textContent || '').includes(text);
        },

        'first-child': function(tag_name) {
          var node = this;
          while ((node = node.previousSibling)) {
            if (node.tagName && (!tag_name || node.tagName == tag_name)) {
              return false;
            }
          }
          return true;
        },
        
        'first-of-type': function() {
          return arguments[1]['first-child'].call(this, this.tagName);
        },

        'last-child': function(tag_name) {
          var node = this;
          while ((node = node.nextSibling)) {
            if (node.tagName && (!tag_name || node.tagName == tag_name)) {
              return false;
            }
          }
          return true;
        },
        
        'last-of-type': function() {
          return arguments[1]['last-child'].call(this, this.tagName);
        },

        'only-child': function(tag_name, matchers) {
          return this.parentNode && matchers['first-child'].call(this, tag_name) 
            && matchers['last-child'].call(this, tag_name);
        },
        
        'only-of-type': function() {
          return arguments[1]['only-child'].call(this, this.tagName, arguments[1]);
        },

        'nth-child': function(number, matchers, tag_name) {
          if (!this.parentNode) return false;
          
          number = number.toLowerCase();
          
          if (number == 'n') return true;
          if (number == 'odd') number = '2n+1';
          if (number == 'even') number = '2n';
          
          if (number.includes('n')) {
            // parsing out the matching expression
            var a = b = 0;
            if (m = number.match(/^([+-]?\d*)?n([+-]?\d*)?$/)) {
              a = m[1] == '-' ? -1 : parseInt(m[1], 10) || 1;
              b = parseInt(m[2], 10) || 0;
            }
            
            // getting the element index
            var index = 1, node = this;
            while ((node = node.previousSibling)) {
              if (node.tagName && (!tag_name || node.tagName == tag_name)) index++;
            }
            
            return (index - b) % a == 0 && (index - b) / a >= 0;
            
          } else {
            return matchers['index'].call(this, number.toInt() - 1, matchers, tag_name);
          }
        },
        
        'nth-of-type': function(number) {
          return arguments[1]['nth-child'].call(this, number, arguments[1], this.tagName);
        },
        
        // virtual pseudo matchers
        index: function(number, matchers, tag_name) {
          number = isString(number) ? number.toInt() : number;
          var node = this, count = 0;
          while ((node = node.previousSibling)) {
            if (node.tagName && (!tag_name || node.tagName == tag_name) && ++count > number) return false;
          }
          return count == number;
        },
        
        odd: function() {
          return arguments[1]['nth-child'].call(this, 'odd');
        },
        
        even: function() {
          return arguments[1]['nth-child'].call(this, 'even');
        }
      }
    }),
    
    /**
     * builds a list of css-rule objects
     *
     * NOTE: returns the same object as received unless it's a string
     *
     * @param String css-definition
     * @return Array aka collection of css-rules
     */
    build: function(rule) {
      if (isString(rule)) {
        var rules = rule.split(','), rule=[];
        for (var i=0; i < rules.length; i++) {
          if (!rules[i].blank()) {
            rule.push(new Selector(rules[i].trim()));
          }
        }
        
        /**
         * virtual method for the rules collection so it behaved as a single selector
         *
         * selects all the sub-nodes of the element which matches each rule in the collection
         *
         * @param Element start node
         * @return Array search result
         */
        rule['select'] = function(element) {
          var founds = [];
          for (var i=0; i < this.length; i++) {
            founds.merge(this[i].select(element));
          }
          return founds;
        };
        
        /**
         * virtual method for the collection so it behaved like a selector
         *
         * checks the element agains all the selection in the collection
         *
         * @param Element element
         * @return Boolean check result
         */
        rule['match'] = function(element) {
          for (var i=0; i < this.length; i++) {
            if (this[i].match(element))
              return true;
          }
          return !this.length; // fallback true only if there's no rules on the list
        };
      }
      return rule;
    }
  }
});
