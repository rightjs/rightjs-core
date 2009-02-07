/**
 * The DOM Element unit structures handling module
 *
 * NOTE: all the methods will process and return only the Element nodes
 *       all the textual nodes will be skipped
 *
 * NOTE: if a css-rule was specified then the result of the method
 *       will be filtered/adjusted depends on the rule
 *
 *       the css-rule might be a string, a Selector or a Selector.Atom instance
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
$ext(Element.Methods, {
  parent: function(css_rule) {
    return css_rule ? this.up(css_rule) : $(this.parentNode);
  },
  
  parents: function(css_rule) {
    return this.rCollect('parentNode', css_rule);
  },
  
  subNodes: function(css_rule) {
    return $(this.firstChild) ? (this.firstChild.tagName ? [this.firstChild] : []
      ).concat(this.firstChild.rCollect('nextSibling', css_rule)) : [];
  },
  
  siblings: function(css_rule) {
    return this.parentNode ? $(this.parentNode).subNodes(css_rule).without(this) : [];
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
  
  up: function(css_rule) {
    return this.parents(css_rule).first();
  },
  
  down: function(css_rule) {
    return this.select(css_rule).first();
  },
  
  select: function(css_rule) {
    return new Selector(css_rule).select(this);
  },
  
  match: function(css_rule) {
    return new Selector(css_rule).match(this);
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
      if (node.tagName && (!css_rule || $(node).match(css_rule))) {
        nodes.push($(node));
      }
    }
    
    return nodes;
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
  
  insert: function(content, position) {
    
  },
  
  replace: function(content) {
    
  },
  
  wrap: function(element) {
    
  },
  
  clean: function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    
    return this;
  },
  
  empty: function() {
    return this.innerHTML.blank();
  }
});
