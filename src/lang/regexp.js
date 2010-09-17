/**
 * The Regexp class extentions
 *
 * Credits:
 *   Inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */


 /**
  * Escapes the string for safely use as a regular expression
  *
  * @param String raw string
  * @return String escaped string
  */
RegExp.escape = function(string) {
  return (''+string).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
};
