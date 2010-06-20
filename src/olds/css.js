/**
 * The manual css-selector feature implementation
 *
 * NOTE: this will define the standard css-selectors interface
 *       with the same names as native css-selectors implementation
 *       the actual public Element level methods for the feature
 *       is in the dom/selector.js file
 *
 * Credits:
 *   - Sizzle    (http://sizzlejs.org)      Copyright (C) John Resig
 *   - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
if (!document.querySelector) {
  RightJS.Element.include((function() {
    /**
     * The token searchers collection
     */
    var search = {
      // search for any descendant nodes
      ' ': function(element, tag) {
        return RightJS.$A(element.getElementsByTagName(tag));
      },

      // search for immidate descendant nodes
      '>': function(element, tag) {
        var result = [], node = element.firstChild;
        while (node) {
          if (tag == '*' || node.tagName == tag)
            result.push(node);
          node = node.nextSibling;
        }
        return result;
      },

      // search for immiate sibling nodes
      '+': function(element, tag) {
        while ((element = element.nextSibling)) {
          if (element.tagName)
            return (tag == '*' || element.tagName == tag) ? [element] : [];
        }
        return [];
      },

      // search for late sibling nodes
      '~': function(element, tag) {
        var result = [];
        while ((element = element.nextSibling))
          if (tag == '*' || element.tagName == tag)
            result.push(element);
        return result;
      }
    };
    
    
    /**
     * Collection of pseudo selector matchers
     */
    var pseudos = {
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
        if (!this.parentNode) return false;
        number = number.toLowerCase();

        if (number == 'n') return true;

        if (number.includes('n')) {
          // parsing out the matching expression
          var a = b = 0;
          if ((m = number.match(/^([+-]?\d*)?n([+-]?\d*)?$/))) {
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
        number = RightJS.isString(number) ? number.toInt() : number;
        var node = this, count = 0;
        while ((node = node.previousSibling)) {
          if (node.tagName && (!tag_name || node.tagName == tag_name) && ++count > number) return false;
        }
        return count == number;
      }
    };
    
    // the regexps collection
    var chunker   = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g;
    var id_re     = /#([\w\-_]+)/;
    var tag_re    = /^[\w\*]+/;
    var class_re  = /\.([\w\-\._]+)/;
    var pseudo_re = /:([\w\-]+)(\((.+?)\))*$/;
    var attrs_re  = /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/;
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    /**
     * Builds an atom matcher
     *
     * @param String atom definition
     * @return Object atom matcher
     */
    var atoms_cache = {};
    function build_atom(atom) {
      if (!atoms_cache[atom]) {
        var id, tag, classes, attrs, pseudo, values_of_pseudo, match, func, desc = {};
        
        // grabbing the attributes 
        while((match = atom.match(attrs_re))) {
          attrs = attrs || {};
          attrs[match[1]] = { o: match[2], v: match[5] || match[6] };
          atom = atom.replace(match[0], '');
        }
        
        // extracting the pseudos
        if ((match = atom.match(pseudo_re))) {
          pseudo = match[1];
          values_of_pseudo = match[3] == '' ? null : match[3];
          atom = atom.replace(match[0], '');
        }
        
        // getting all the other options
        id      = (atom.match(id_re)    || [1, null])[1];
        tag     = (atom.match(tag_re)   || '*').toString().toUpperCase();
        classes = (atom.match(class_re) || [1, ''])[1].split('.').without('');
        
        desc.tag = tag;
        
        //
        // HACK HACK HACK
        //
        // building the matcher function
        //
        // NOTE: we kinda compile a cutom filter function in here 
        //       the point is to create a maximally optimized method
        //       that will make only this atom checks and will filter
        //       a list of elements in a single call
        //
        if (id || classes.length || attrs || pseudo) {
          var filter = 'function(y){'+
            'var e,r=[],z=0,x=y.length;'+
            'for(;z<x;z++){'+
              'e=y[z];_f_'+
            '}return r}';
            
          var patch_filter = function(code) {
            filter = filter.replace('_f_', code + '_f_');
          };
          
          // adding the ID check conditions
          if (id) patch_filter('if(e.id!=i)continue;');
          
          // adding the classes matching code
          if (classes.length) patch_filter(
            'if(e.className){'+
              'var n=e.className.split(" ");'+
              'if(n.length==1&&c.indexOf(n[0])==-1)continue;'+
              'else{'+
                'for(var i=0,l=c.length,b=false;i<l;i++)'+
                  'if(n.indexOf(c[i])==-1){'+
                    'b=true;break;}'+
                    
              'if(b)continue;}'+
            '}else continue;'
          );
          
          // adding the attributes matching conditions
          if (attrs) patch_filter(
            'var p,o,v,k,b=false;'+
            'for (k in a){p=e.getAttribute(k)||"";o=a[k].o;v=a[k].v;'+
              'if('+
                '(o=="="&&p!=v)||'+
                '(o=="*="&&!p.includes(v))||'+
                '(o=="^="&&!p.startsWith(v))||'+
                '(o=="$="&&!p.endsWith(v))||'+
                '(o=="~="&&!p.split(" ").includes(v))||'+
                '(o=="|="&&!p.split("-").includes(v))'+
              '){b=true;break;}'+
            '}if(b){continue;}'
          );
          
          // adding the pseudo matchers check
          if (pseudo in pseudos) {
            patch_filter('if(!S[P].call(e,V,S))continue;');
          }

          //
          // HACK HACK HACK
          //
          // Here we separate the names space from the outside
          // and inside of the function, so that when this thing
          // is optimized by the code compiler, it kept the necessary
          // variable names intackt
          //
          desc.filter = eval(
            "[function(i,t,c,a,P,V,S,s){return eval('['+s+']')[0]}]"
          )[0](
            id,tag,classes,attrs,pseudo,values_of_pseudo,pseudos,
            filter.replace('_f_', 'r.push(e)')
          );
        }
        
        atoms_cache[atom] = desc;
      }
      
      return atoms_cache[atom];
    };
    
    /**
     * Builds a single selector out of a simple rule chunk
     *
     * @param Array of a single rule tokens
     * @return Function selector
     */
    var tokens_cache = {};
    function build_selector(rule) {
      var rule_key = rule.join('');
      if (!tokens_cache[rule_key]) {
        for (var i=0; i < rule.length; i++) {
          rule[i][1] = build_atom(rule[i][1]);
        }
        
        // creates a list of uniq nodes
        var _uid = $uid;
        var uniq = function(elements) {
          var uniq = [], uids = [], uid;
          for (var i=0, length = elements.length; i < length; i++) {
            uid = _uid(elements[i]);
            if (!uids[uid]) {
              uniq.push(elements[i]);
              uids[uid] = true;
            }
          }

          return uniq;
        };
        
        // performs the actual search of subnodes
        var find_subnodes = function(element, atom) {
          var result = search[atom[0]](element, atom[1].tag);
          return atom[1].filter ? atom[1].filter(result) : result;
        };
        
        // building the actual selector function
        tokens_cache[rule_key] = function(element) {
          var founds, sub_founds;
          
          for (var i=0, i_length = rule.length; i < i_length; i++) {
            if (i == 0) {
              founds = find_subnodes(element, rule[i]);

            } else {
              if (i > 1) founds = uniq(founds);

              for (var j=0; j < founds.length; j++) {
                sub_founds = find_subnodes(founds[j], rule[i]);

                sub_founds.unshift(1); // <- nuke the parent node out of the list
                sub_founds.unshift(j); // <- position to insert the subresult

                founds.splice.apply(founds, sub_founds);

                j += sub_founds.length - 3;
              }
            }
          }
          
          return rule.length > 1 ? uniq(founds) : founds;
        };
      }
      return tokens_cache[rule_key];
    };
    
    
    /**
     * Builds the list of selectors for the css_rule
     *
     * @param String raw css-rule
     * @return Array of selectors
     */
    var selectors_cache = {}, chunks_cache = {};
    function split_rule_to_selectors(css_rule) {
      if (!selectors_cache[css_rule]) {
        chunker.lastIndex = 0;
        
        var rules = [], rule = [], rel = ' ', m, token;
        while ((m = chunker.exec(css_rule))) {
          token = m[1];
          
          if (token == '+' || token == '>' || token == '~') {
            rel = token;
          } else {
            rule.push([rel, token]);
            rel = ' ';
          }

          if (m[2]) {
            rules.push(build_selector(rule));
            rule = [];
          }
        }
        rules.push(build_selector(rule));
        
        selectors_cache[css_rule] = rules;
      }
      return selectors_cache[css_rule];
    };
    
    
    /**
     * The top level method, it just goes throught the css-rule chunks
     * collect and merge the results that's it
     *
     * @param Element context
     * @param String raw css-rule
     * @return Array search result
     */
    function select_all(element, css_rule) {
      var selectors = split_rule_to_selectors(css_rule), result = [];
      for (var i=0, length = selectors.length; i < length; i++)
        result = result.concat(selectors[i](element));
      
      if (RightJS.Browser.OLD) result.forEach(RightJS.Element.prepare);
      
      return result;
    };
    
    
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    // the previous dom-selection methods replacement
    var dom_extension = {
      first: function(css_rule) {
        return this.select(css_rule)[0];
      },
      
      select: function(css_rule) {
        return select_all(this, css_rule || '*');
      }
    };
    
    // replacing the document-level search methods
    RightJS.$ext(document, dom_extension);
    
    // patching the $$ function to make it more efficient
    $$ = RightJS.$$ = function(css_rule) {
      return select_all(document, css_rule || '*');
    };
    
    // sending the extension to the Element#include
    return dom_extension;
  })());
}