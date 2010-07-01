/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// !NOTE the class itself is defined in the core/util.js file
//       because we needed a reference to it in there
Wrapper[PROTO]._ = null; // predefining the key to speed up the assignment

/**
 * Building the dom-wrapper with a caching system
 * The idea is to keep a single wrapper instance all the time
 *
 * @return Wrapper class
 */
var BuildWrapper = function(Klass) {
  Klass[PROTO] = new Wrapper;
  make_extensible(Klass);
  return Klass;
};
