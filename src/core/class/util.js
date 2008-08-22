/**
 * This module contains some utils which hepls handling new classes definition
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Class.Util = {
  /**
   * handles the class superclass catching up
   *
   * @param Function class
   * @param Class superclass
   * @return void
   */
  catchSuper: function(klass, parent) {
    if (parent && defined(parent.prototype)) {  
      klass.parent = parent;
      var s_klass = function() {};
      s_klass.prototype = parent.prototype;
      klass.prototype = new s_klass;
    }
  },
  
  /**
   * handles the inline extendings on class definitions
   *
   * @param Function class
   * @param Object user's properties
   * @return void
   */
  catchExtends: function(klass, properties) {
    if (properties['extend']) {
      var extends = properties['extend'];
      if (!(extends instanceof Array))
        extends = [extends];
      
      klass.extend.apply(klass, extends);
      properties = Object.without(properties, 'extend');
    }
  },
  
  /**
   * handles the inline includes of the class definitions
   *
   * @param Function class
   * @param Object user's properties
   * @return void
   */
  catchIncludes: function(klass, properties) {
    if (properties['include']) {
      var includes = properties['include'];
      if (!(includes instanceof Array))
        includes = [includes];

      klass.include.apply(klass, includes);
      properties = Object.without(properties, 'include');
    }
  }
};