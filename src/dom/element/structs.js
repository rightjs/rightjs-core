/**
 * The DOM Element unit structures handling module
 *
 * NOTE: all the methods will process and return only the Element nodes
 *       all the textual nodes will be skipped
 *
 * NOTE: if a css-rule was specified then the result of the method
 *       will be filtered/adjusted depends on the rule
 *
 *       the css-rule might be a string or a Selector instance
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods({
  parent: function(css_rule) {
    return css_rule ? this.parents(css_rule).first() : $(this.parentNode);
  },
  
  parents: function(css_rule) {
    return this.rCollect('parentNode', css_rule);
  },
  
  subNodes: function(css_rule) {
    return this.firstChild ? (this.firstChild.tagName ? [$(this.firstChild)] : []
      ).concat(this.rCollect.call(this.firstChild, 'nextSibling', css_rule)) : [];
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
    return this.nextSiblings(css_rule).first();
  },
  
  prev: function(css_rule) {
    return this.prevSiblings(css_rule).first();
  },
  
  first: function(css_rule) {
    return new Selector(css_rule).first(this);
  },
  
  select: function(css_rule) {
    return new Selector(css_rule).select(this);
  },
  
  match: function(css_rule) {
    return new Selector(css_rule).match(this);
  },
  
  /**
   * removes the elemnt out of this parent node
   *
   * @return Element self
   */
  remove: function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
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
    if (isHash(content)) {
      for (var position in content) {
        this.insert(content[position], position)
      }
    } else {
      var scripts = '';
      position = isString(position) ? position.toLowerCase() : 'bottom';
      
      if (isString(content)) {
        content = content.stripScripts(function(s, h) { scripts = s; });
      }
      
      Element.insertions[position].call(this, Element.insertions.createFragment.call(this, content));
      $eval(scripts);
    }
    return this;
  },
  
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
    if (isString(content)) {
      this.innerHTML = content.stripScripts();
      content.evalScripts();
    } else {
      this.clean().insert(content);
    }
    return this;
  },
  
  /**
   * wraps the element with the given element
   *
   * @param Element wrapper
   * @return Element self
   */
  wrap: function(element) {
    if (this.parentNode) {
      this.parentNode.replaceChild(element, this);
      element.appendChild(this);
    }
    return this;
  },
  
  /**
   * removes all the child nodes out of the element
   *
   * @return Element self
   */
  clean: function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    
    return this;
  },
  
  /**
   * checks if the element has no child nodes
   *
   * @return boolean check result
   */
  empty: function() {
    return this.innerHTML.blank();
  },

  /**
   * recursively collects nodes by pointer attribute name
   *
   * @param String pointer attribute name
   * @param String optional css-atom rule
   * @return Array found elements
   */
  rCollect: function(attr, css_rule) {
    var node = this, nodes = [];

    while ((node = node[attr])) {
      if (node.tagName && (!css_rule || new Selector(css_rule).match(node))) {
        nodes.push(Browser.OLD ? Element.prepare(node) : node);
      }
    }
    
    return nodes;
  }
});

// list of insertions handling functions
// NOTE: each of the methods will be called in the contects of the current element
Element.insertions = {
  bottom: function(element) {
    this.appendChild(element);
  },
  
  top: function(element) {
    this.firstChild ? this.insertBefore(element, this.firstChild) : this.appendChild(element);
  },
  
  after: function(element) {
    if (this.parentNode) {
      this.nextSibling ? this.parentNode.insertBefore(element, this.nextSibling) : this.parentNode.appendChild(element);
    }
  },
  
  before: function(element) {
    if (this.parentNode) {
      this.parentNode.insertBefore(element, this);
    }
  },
  
  instead: function(element) {
    if (this.parentNode) {
      this.parentNode.replaceChild(element, this);
    }
  },
  
  // converts any data into a html fragment unit
  createFragment: function(content) {
    var fragment;
    
    if (isString(content)) {
      var tmp = document.createElement('div'),
          wrap = Element.insertions.wraps[this.tagName] || ['', '', 0],
          depth = wrap[2];
          
      tmp.innerHTML = wrap[0] + content + wrap[1];
      
      while (depth > 0) {
        tmp = tmp.firstChild;
        depth--;
      }
      
      fragment = arguments.callee.call(this, tmp.childNodes);
      
    } else {
      fragment = document.createDocumentFragment();
      
      if (isNode(content)) {
        fragment.appendChild(content);
      } else if (content && content.length) {
        for (var i=0, length = content.length; i < length; i++) {
          // in case of NodeList unit, the elements will be removed out of the list during the appends
          // therefore if that's an array we use the 'i' variable, and if it's a collection of nodes
          // then we always hit the first element of the stack
          fragment.appendChild(content[content.length == length ? i : 0]);
        }
      }
    }
    
    return fragment;
  },
  
  wraps: {
    TABLE:  ['<table>',                '</table>',                   1],
    TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
    TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
    TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
    SELECT: ['<select>',               '</select>',                  1]
  }
};
$alias(Element.insertions.wraps, {
  THEAD: 'TBODY',
  TFOOT: 'TBODY',
  TH:    'TD'
});