/**
 * The Regexp class extentions
 *
 * Credits:
 *   Inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(RegExp, {
  /**
   * Escapes the string for safely use as a regular expression
   *
   * @param String raw string
   * @return String escaped string
   */
  escape: function(string) {
    return String(string).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }
});