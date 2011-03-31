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
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

Element.include({
  parent: function(css_rule) {
    var parent = this._.parentNode, parent_type = parent && parent.nodeType;

    return css_rule ? this.parents(css_rule)[0] :
      (parent_type === 1 || parent_type === 9) ? // <- IE6 sometimes has a fragment node in there
      wrap(parent) : null;
  },

  parents: function(css_rule) {
    return recursively_collect(this, 'parentNode', css_rule);
  },

  children: function(css_rule) {
    return this.find(css_rule).filter(function(element) {
      return element._.parentNode === this._;
    }, this);
  },

  siblings: function(css_rule) {
    return this.prevSiblings(css_rule).reverse().concat(this.nextSiblings(css_rule));
  },

  nextSiblings: function(css_rule) {
    return recursively_collect(this, 'nextSibling', css_rule);
  },

  prevSiblings: function(css_rule) {
    return recursively_collect(this, 'previousSibling', css_rule);
  },

  next: function(css_rule) {
    return !css_rule && this._.nextElementSibling !== undefined ?
      wrap(this._.nextElementSibling) : this.nextSiblings(css_rule)[0];
  },

  prev: function(css_rule) {
    return !css_rule && this._.previousElementSibling !== undefined ?
      wrap(this._.previousElementSibling) : this.prevSiblings(css_rule)[0];
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
   *  o) a String (all the scripts will be parsed out and executed)
   *  o) a list of Elements
   *  o) a hash like {position: content}
   *
   * @param mixed data to insert
   * @param String position to insert  top/bottom/before/after/instead
   * @return Element self
   */
  insert: function(content, position) {
    var scripts = null, element = this._;
    position = position === undefined ? 'bottom' : position;

    if (typeof(content) !== 'object') {
      scripts = content = (''+content);
    } else if (content instanceof Element) {
      content = content._;
    }

    Element_insertions[position](element,
      content.nodeType === undefined ?
        Element_createFragment(
          (position === 'bottom' || position === 'top') ?
            element : element.parentNode, content
        ) : content
    );

    if (scripts !== null) { scripts.evalScripts(); }

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
   * A shortcut to uppend several units into the element
   *
   * @param mixed data
   * ..................
   * @return Element this
   */
  append: function(first) {
    return this.insert(isString(first) ? $A(arguments).join('') : arguments);
  },

  /**
   * updates the content of the element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  update: function(content) {
    if (typeof(content) !== 'object') {
      content = '' + content;

      try {
        this._.innerHTML = content;
      } catch(e) {
        return this.clean().insert(content);
      }

      content.evalScripts();

      return this;
    } else {
      return this.clean().insert(content);
    }
  },

  /**
   * Works with the Element's innerHTML property
   * This method works both ways! if a content is provided
   * then it will be assigned, otherwise will return
   * the innerHTML property
   *
   * @param String html content
   * @return String html content or Element this
   */
  html: function(content) {
    return content === undefined ? this._.innerHTML : this.update(content);
  },

  /**
   * Works with the Element's innerHTML property as a text
   * when set something, it will appear as is with everything quoted
   * when get, will return a string without any tags in it
   *
   * @param String text content
   * @return String text content or Element this
   */
  text: function(text) {
    return text === undefined ? (this._.textContent || this._.innerText) :
      this.update(this.doc()._.createTextNode(text));
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
   * wraps the element with the given element
   *
   * @param Element wrapper
   * @return Element self
   */
  wrap: function(wrapper) {
    var element = this._, parent = element.parentNode;
    if (parent) {
      wrapper = $(wrapper)._;
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
   * Creates a clean clone of the element without any events attached to it
   *
   * @return Element new clone
   */
  clone: function() {
    return new Element(this._.cloneNode(true));
  },

  /**
   * Returns an index of the element among the other child elements
   *
   * NOTE: doesn't count the textual nodes!
   *
   * @return Integer index
   */
  index: function() {
    var node    = this._,
        sibling = node.parentNode.firstChild,
        index   = 0;

    while (sibling !== node) {
      if (sibling.nodeType === 1) { // counting elements only
        index ++;
      }
      sibling = sibling.nextSibling;
    }

    return index;
  }
});

/**
 * Recursively collects the target element's related nodes
 *
 * @param Element context
 * @param name String pointer attribute name
 * @param rule String optional css-atom rule
 * @return Array found elements
 */
function recursively_collect(where, attr, css_rule) {
  var node = where._, result = [], i=0, no_rule = !css_rule;

  while ((node = node[attr])) {
    if (node.nodeType === 1 && (no_rule || wrap(node).match(css_rule))) {
      result[i++] = wrap(node);
    }
  }

  return result;
}

// list of insertions handling functions
// NOTE: each of the methods will be called in the contects of the current element
var Element_insertions = {
  bottom: function(target, content) {
    target.appendChild(content);
  },

  top: function(target, content) {
    if (target.firstChild !== null) {
      target.insertBefore(content, target.firstChild);
    } else {
      target.appendChild(content);
    }
  },

  after: function(target, content) {
    var parent = target.parentNode, sibling = target.nextSibling;
    if (sibling !== null) {
      parent.insertBefore(content, sibling);
    } else {
      parent.appendChild(content);
    }
  },

  before: function(target, content) {
    target.parentNode.insertBefore(content, target);
  },

  instead: function(target, content) {
    target.parentNode.replaceChild(content, target);
  }
},

// the element insertion wrappers list
Element_wraps = {
  TBODY:  ['<TABLE>',            '</TABLE>',                           2],
  TR:     ['<TABLE><TBODY>',     '</TBODY></TABLE>',                   3],
  TD:     ['<TABLE><TBODY><TR>', '</TR></TBODY></TABLE>',              4],
  COL:    ['<TABLE><COLGROUP>',  '</COLGROUP><TBODY></TBODY></TABLE>', 2],
  LEGEND: ['<FIELDSET>',         '</FIELDSET>',                        2],
  AREA:   ['<map>',              '</map>',                             2],
  OPTION: ['<SELECT>',           '</SELECT>',                          2]
};

$alias(Element_wraps, {
  OPTGROUP: 'OPTION',
  THEAD:    'TBODY',
  TFOOT:    'TBODY',
  TH:       'TD'
});

// converts any data into a html fragment unit
var fragment = document.createDocumentFragment(),
    tmp_cont = document.createElement('DIV');

function Element_createFragment(context, content) {
  if (typeof(content) === 'string') {
    var tag   = context.tagName,
        tmp   = tmp_cont,
        wrap  = tag in Element_wraps ? Element_wraps[tag] : ['', '', 1],
        depth = wrap[2];

    tmp.innerHTML = wrap[0] + '<'+ tag + '>' + content + '</'+ tag + '>' + wrap[1];

    while (depth-- !== 0) {
      tmp = tmp.firstChild;
    }

    content = tmp.childNodes;

    while (content.length !== 0) {
      fragment.appendChild(content[0]);
    }

  } else {
    for (var i=0, length = content.length, node; i < length; i++) {
      node = content[content.length === length ? i : 0];
      fragment.appendChild(node instanceof Element ? node._ : node);
    }
  }

  return fragment;
}
