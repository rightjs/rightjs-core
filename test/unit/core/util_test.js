/**
 * There are the util methods test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var UtilTest = TestCase.create({
  name: "UtilTest",
  
  testDefined: function() {
    var smth = null;
    this.assert(defined(smth));
    
    var smth = false;
    this.assert(defined(smth));
    
    var smth = 0;
    this.assert(defined(smth));
  },
  
  testDefinedReturnsFalse: function() {
    var smth = {};
    this.assertFalse(defined(smth['smth']));
    
    var smth = [];
    this.assertFalse(defined(smth[0]));
  },
  
  testIsObject: function() {
    this.assert(isObject({}));
    this.assertFalse(isObject(1));
    this.assertFalse(isObject('a'));
    this.assertFalse(isObject(null));
    this.assertFalse(isObject(false));
    this.assertFalse(isObject(function() {}));
  },
  
  testIsFunction: function() {
    this.assert(isFunction(function() {}));
    this.assertFalse(isFunction(1));
    this.assertFalse(isFunction({}));
    this.assertFalse(isFunction('a'));
    this.assertFalse(isFunction(null));
    this.assertFalse(isFunction(false));
  },
  
  test$A: function() {
    var args;
    (function() { args = $A(arguments); })(1,2,3,4);
    this.assertEqual([1,2,3,4], args);
  }
});