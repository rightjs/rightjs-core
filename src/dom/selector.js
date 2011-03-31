/**
 * The DOM elements selection handling
 *
 * NOTE: this module is just a wrap over the native CSS-selectors feature
 *       see the olds/css.js file for the manual selector code
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

[Element, Document].each('include', {
  /**
   * Extracts the first element matching the css-rule,
   * or just any first element if no css-rule was specified
   *
   * @param String css-rule
   * @return Element matching node or null
   */
  first: function(css_rule) {
    return !css_rule && this._.firstElementChild !== undefined ? wrap(this._.firstElementChild) : wrap(this._.querySelector(css_rule || '*'));
  },

  /**
   * Finds a list of matching nodes, or all the descendant nodes if no css-rule provided
   *
   * @param String css-rule
   * @param boolean raw-search
   * @return Array of elements
   */
  find: function(css_rule, raw) {
    var query = this._.querySelectorAll(css_rule || '*'), result, i=0, l = query.length;

    if (raw === true) {
      result = $A(query);
    } else {
      for (result = []; i < l; i++) {
        result[i] = wrap(query[i]);
      }
    }

    return result;
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

    result = wrap(parent).find(css_rule, true).indexOf(element) !== -1;

    if (faking) {
      parent.removeChild(element);
    }

    return result;
  }
});
