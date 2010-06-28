/**
 * The DOM Element unit structures handling module
 *
 * NOTE: all the methods will process and return only the Element nodes
 *       all the textual nodes will be skipped
 *
 * NOTE: if a css-rule was specified then the result of the method
 *       will be filtered/adjusted depends on the rule
 *
 * Credits:
 *   The naming principle and most of the names are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The insertions system implementation is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  parent: function(css_rule) {
    return css_rule ? this.parents(css_rule)[0] : $(this._.parentNode);
  },
  
  parents: function(css_rule) {
    return this.rCollect('parentNode', css_rule);
  },
  
  subNodes: function(css_rule) {
    return this.select(css_rule).filter(function(element) {
      return element.parentNode === this._;
    }, this);
  },
  
  siblings: function(css_rule) {
    return this.prevSiblings(css_rule).reverse().concat(this.nextSiblings(css_rule));
  },
  
  nextSiblings: function(css_rule) {
    return this.rCollect('nextSibling', css_rule);
  },
  
  prevSiblings: function(css_rule) {
    return this.rCollect('previousSibling', css_rule);
  },
  
  next: function(css_rule) {
    return this.nextSiblings(css_rule)[0];
  },
  
  prev: function(css_rule) {
    return this.prevSiblings(css_rule)[0];
  },
  
  /**
   * removes the elemnt out of this parent node
   *
   * @return Element self
   */
  remove: function() {
    var element = this._, parent = element.parentNode;
    if (parent) {
      parent.removeChild(element);
    }
    return this;
  },
  
  /**
   * handles the elements insertion functionality
   *
   * The content might be one of the following data
   *
   *  o) an element instance
   *  o) a String, which will be converted into content to insert (all the scripts will be parsed out and executed)
   *  o) a list of Elements 
   *  o) a hash like {position: content}
   *
   * @param mixed data to insert
   * @param String position to insert  top/bottom/before/after/instead
   * @return Element self
   */
  insert: function(content, position) {
    if ('_' in content) content = content._;
    if (isHash(content)) {
      for (var pos in content) {
        this.insert(content[pos], pos)
      }
    } else {
      var scripts, element = this._;
      position = (position||'bottom').toLowerCase();
      
      if (typeof(content) !== 'object') {
        content = (''+content).stripScripts(function(s) { scripts = s; });
      }
      
      Element_insertions[position](element, content.tagName ? content :
        Element_createFragment.call(
          (position === 'bottom' || position === 'top') ?
            element : element.parentNode, content
        )
      );
      
      // FF doesn't marks selected options correctly with a textual content
      if (element.tagName === 'SELECT' && isString(content)) {
        $A(element.getElementsByTagName('option')).each(function(option) {
          option.selected = !!option.getAttribute('selected');
        });
      }
      
      if (scripts) $eval(scripts);
    }
    
    return this;
  },
  
  /**
   * Inserts the element inside the given one at the given position
   *
   * @param mixed destination element reference
   * @param String optional position
   * @return Element this
   */
  insertTo: function(element, position) {
    $(element).insert(this, position);
    return this;
  },
  
  /**
   * replaces the current element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  replace: function(content) {
    return this.insert(content, 'instead');
  },
  
  /**
   * updates the content of the element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  update: function(content) {
    if (typeof(content) !== 'object' && !(this._.tagName in Element_wraps)) {
      var scripts;
      this._.innerHTML = (''+content).stripScripts(function(s) { scripts = s; });
      if (scripts) $eval(scripts);
    } else {
      this.clean().insert(content);
    }
    return this;
  },
  
  /**
   * Returns the html content of the elemnt
   *
   * @return String html content
   */
  html: function() {
    return this._.innerHTML;
  },
  
  /**
   * wraps the element with the given element
   *
   * @param Element wrapper
   * @return Element self
   */
  wrap: function(wrapper) {
    var element = this._, parent = element.parentNode;
    if (parent) {
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);
    }
    return this;
  },
  
  /**
   * removes all the child nodes out of the element
   *
   * @return Element self
   */
  clean: function() {
    while (this._.firstChild) {
      this._.removeChild(this._.firstChild);
    }
    
    return this;
  },
  
  /**
   * checks if the element has no child nodes
   *
   * @return boolean check result
   */
  empty: function() {
    return this.html().blank();
  },

  /**
   * recursively collects nodes by pointer attribute name
   *
   * @param name String pointer attribute name
   * @param rule String optional css-atom rule
   * @return Array found elements
   */
  rCollect: function(attr, css_rule) {
    var node = this._, result = [], first;

    while ((node = node[attr])) {
      if (node.tagName && (!css_rule || $(node).match(css_rule))) {
        result.push(new Element(node));
      }
    }
    
    return result;
  }
});

// list of insertions handling functions
// NOTE: each of the methods will be called in the contects of the current element
var Element_insertions = {
  bottom: function(target, content) {
    target.appendChild(content);
  },
  
  top: function(target, content) {
    target.firstChild ? target.insertBefore(content, target.firstChild) : target.appendChild(content);
  },
  
  after: function(target, content) {
    var parent = target.parentNode, sibling = target.nextSibling;
    sibling ? parent.insertBefore(content, sibling) : parent.appendChild(content);
  },
  
  before: function(target, content) {
    target.parentNode.insertBefore(content, target);
  },
  
  instead: function(target, content) {
    target.parentNode.replaceChild(content, target);
  }
},
  
// converts any data into a html fragment unit
Element_createFragment = function(content) {
  var fragment = document.createDocumentFragment();
    
  if (isString(content)) {
    var tmp   = document.createElement('div'),
        wrap  = Element_wraps[this.tagName] || ['', '', 0],
        depth = wrap[2];
          
    tmp.innerHTML = wrap[0] + content + wrap[1];
    
    while (depth > 0) {
      tmp = tmp.firstChild;
      depth--;
    }
    
    content = tmp.childNodes;
  }
  
  for (var i=0, length = content.length; i < length; i++) {
    // in case of NodeList unit, the elements will be removed out of the list during the appends
    // therefore if that's an array we use the 'i' variable, and if it's a collection of nodes
    // then we always hit the first element of the stack
    fragment.appendChild(content[content.length == length ? i : 0]);
  }
  
  return fragment;
},


// the element insertion wrappers list
Element_wraps_t1 = '<table><tbody>',
Element_wraps_t2 = '</tbody></table>',
Element_wraps = {
  TABLE:  ['<table>',                   '</table>',                    1],
  TBODY:  [Element_wraps_t1,            Element_wraps_t2,              2],
  TR:     [Element_wraps_t1+'<tr>',     '</tr>'+Element_wraps_t2,      3],
  TD:     [Element_wraps_t1+'<tr><td>', '</td></tr>'+Element_wraps_t2, 4],
  SELECT: ['<select>',                  '</select>',                   1]
};

$alias(Element_wraps, {
  OPTGROUP: 'SELECT',
  THEAD:    'TBODY',
  TFOOT:    'TBODY',
  TH:       'TD'
});