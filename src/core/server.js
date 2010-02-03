/**
 * Node.JS export hooks
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
if (exports) {
  exports.$ext       = $ext;
  exports.$break     = $break;
  exports.$alias     = $alias;
  exports.defined    = defined;
  exports.isFunction = isFunction;
  exports.isString   = isString;
  exports.isHash     = isHash;
  exports.isArray    = isArray;
  exports.$A         = $A;
  exports.$w         = $w;
  exports.Class      = Class;
  exports.Options    = Options;
  exports.Observer   = Observer;
}
