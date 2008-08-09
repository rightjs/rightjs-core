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
  
  test$A: function() {
    var args = $A(arguments);
    this.assertInstanceOf(Array, args);
  }
});