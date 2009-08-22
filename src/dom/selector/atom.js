/**
 * this class represent a simple css-definition atom unit
 *
 * the main purpose is to organize the simpliest case of css-rule match for the manual matcher.
 *
 * Credits:
 *   Some functionality and principles are inspired by css-selectors in
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Selector.Atom = new Class({
  id: null,
  tag: '*',
  classes: [],
  pseudo: null,
  pseudoValue: null,
  attrs: {},

  rel: ' ', // relations with the previous atom

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
    this.hasNonTagMatcher = !css_rule.match(/^[a-z\*]+$/);
    
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
    this.tag = (css_rule.match(this.TAG_RE) || '*').toString().toUpperCase();
    this.classes = (css_rule.match(this.CLASS_RE) || [1, ''])[1].split('.').without('');
    
    this.buildMatch();
  },

  /**
   * cecks if the node matches the atom
   *
   * @param Element element
   * @return Boolean check result
   */
  match: null, // this method is dinamically generated depend on the situation

// protected

  // building the match method for the particular case
  buildMatch: function() {
    var matchers = [];
    
    if (this.id)                   matchers.push('matchId');
    if (this.tag != '*')           matchers.push('matchTag');
    if (this.classes.length)       matchers.push('matchClass');
    if (!Object.empty(this.attrs)) matchers.push('matchAttrs');
    if (this.pseudo)               matchers.push('matchPseudo');
    
    if (matchers.length == 1) {
      this.match = this[matchers[0]];
    } else if (matchers.length) {
      var length = matchers.length;
      this.match = function(element) {
        for (var i=0; i < length; i++)
          if (!this[matchers[i]](element))
            return false;
        return true;
      }
    } else {
      this.match = function() { return true; }
    }
  },

  matchId: function(element) {
    return element.id == this.id;
  },

  matchTag: function(element) {
    return element.tagName == this.tag;
  },

  matchClass: function(element) {
    if (element.className) {
      var names = element.className.split(' ');
      if (names.length == 1) {
        return this.classes.indexOf(names[0]) != -1;
      } else {
        for (var i=0, length = this.classes.length; i < length; i++)
          if (names.indexOf(this.classes[i]) == -1)
            return false;
            
        return true;
      }
    }
    return false;
  },

  matchAttrs: function(element) {
    var matches = true;
    for (var key in this.attrs) {
      matches &= this.matchAttr(element, key, this.attrs[key]['op'], this.attrs[key]['value']);
    }
    return matches;
  },
  
  matchAttr: function(element, name, operator, value) {
    var attr = element.getAttribute(name) || '';
    switch(operator) {
      case '=':  return attr == value;
      case '*=': return attr.includes(value);
      case '^=': return attr.startsWith(value);
      case '$=': return attr.endsWith(value);
      case '~=': return attr.split(' ').includes(value);
      case '|=': return attr.split('-').includes(value);
      default:   return attr != '';
    }
    return false;
  },

  matchPseudo: function(element) {
    return this.pseudoMatchers[this.pseudo].call(element, this.pseudoValue, this.pseudoMatchers);
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
      return matchers['first-child'].call(this, tag_name) 
        && matchers['last-child'].call(this, tag_name);
    },
    
    'only-of-type': function() {
      return arguments[1]['only-child'].call(this, this.tagName, arguments[1]);
    },

    'nth-child': function(number, matchers, tag_name) {
      if (!matchers.hasParent(this)) return false;
      number = number.toLowerCase();
      
      if (number == 'n') return true;
      
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
    
// protected
    index: function(number, matchers, tag_name) {
      number = isString(number) ? number.toInt() : number;
      var node = this, count = 0;
      while ((node = node.previousSibling)) {
        if (node.tagName && (!tag_name || node.tagName == tag_name) && ++count > number) return false;
      }
      return count == number;
    },
    
    // checking if the element has a parent node
    // the '-----fake' parent is a temporary context for the element
    // just of the matching process
    hasParent: function(element) {
      return element.parentNode && element.parentNode.id != '-----fake';
    }
  }
});