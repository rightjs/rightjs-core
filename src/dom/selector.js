/**
 * The DOM elements selection handling
 *
 * NOTE: this module is just a wrap over the native CSS-selectors feature
 *       see the olds/css.js file for the manual selector code
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */

/**
 * Native css-selectors include the current element into the search context
 * and as we actually search only inside of the element we add it's tag
 * as a scope for the search
 */
function stub_rule(css_rule, tag) {
  var rule = css_rule || '*', element = tag._,
    tag_name = 'tagName' in element ? element.tagName : null;

  return tag_name === null ? rule : rule.replace(/(^|,)/g, '$1'+ tag_name + ' ');
}

[Element, Document].each('include', {
  /**
   * Extracts the first element matching the css-rule,
   * or just any first element if no css-rule was specified
   *
   * @param String css-rule
   * @return Element matching node or null
   */
  first: function(css_rule) {
    return $(this._.querySelector(stub_rule(css_rule, this)));
  },

  /**
   * Finds a list of matching nodes, or all the descendant nodes if no css-rule provided
   *
   * @param String css-rule
   * @param boolean raw-search
   * @return Array of elements
   */
  find: function(css_rule, raw) {
    var result = $A(this._.querySelectorAll(stub_rule(css_rule, this)));
    return raw === true ? result : result.map($);
  },

  /**
   * checks if the element matches this css-rule
   *
   * NOTE: the element should be attached to the page
   *
   * @param String css-rule
   * @return Boolean check result
   */
  match: function(css_rule) {
    // finding the top parent element (the element might not be on the document)
    var element = this._, parent = element, result, faking = false;

    while (parent.parentNode !== null && parent.parentNode.nodeType !== 11) {
      parent = parent.parentNode;
    }

    // creating a fake context when needed
    if (element === parent) {
      parent = document.createElement('div');
      parent.appendChild(element);
      faking = true;
    }

    result = $(parent).find(css_rule, true).indexOf(element) !== -1;

    if (faking) {
      parent.removeChild(element);
    }

    return result;
  }
});
