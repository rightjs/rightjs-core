/**
 * this module contains the Element unit XHR related extensions
 *
 * Credits:
 *   - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * performs an Xhr request to the given url
   * and updates the element internals with the responseText
   *
   * @param String url address
   * @param Object xhr options
   * @return Element this
   */
  load: function(url, options) {
    new Xhr(url, $ext({method: 'get'}, options)).update(this);
    return this;
  }
});
