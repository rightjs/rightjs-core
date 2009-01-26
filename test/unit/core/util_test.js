/**
 * There are the util methods test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var UtilTest = TestCase.create({
  name: "UtilTest",
  
  test_$ext: function() {
    var obj1 = { a: 1, b: 2 };
    var obj2 = { b: 3, c: 4 };

    this.assertSame(obj1, $ext(obj1, obj2));
    this.assertEqual({ a:1, b:3, c:4 }, obj1);
  },

  test_$extWithoutOverwritting: function() {
    var obj1 = { a: 1, b: 2 };
    var obj2 = { b: 3, c: 4 };

    this.assertSame(obj1, $ext(obj1, obj2, true));
    this.assertEqual({ a:1, b:2, c:4 }, obj1);
  },
  
  test_$try: function() {
    var assigned1 = false;
    var assigned2 = false;
    
    this.assertNothingThrown(function() {
      this.assertEqual(2, $try(
        function() { throw 'problem'; assigned1 = true; return 1; },
        function() { assigned2 = true; return 2; },
        function() { assigned1 = true; return 3; }
      ));
    }, this);
    
    this.assertFalse(assigned1);
    this.assert(assigned2);
  },
   
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
  
  test_isHash: function() {
    this.assert(isHash({}));
    this.assert(isHash(new Object()));
    
    this.assertFalse(isHash(1));
    this.assertFalse(isHash([]));
    this.assertFalse(isHash('a'));
    this.assertFalse(isHash(null));
    this.assertFalse(isHash(false));
    this.assertFalse(isHash(function() {}));
    this.assertFalse(isHash(new String('a')));
  },
  
  test_isFunction: function() {
    this.assert(isFunction(function() {}));
    this.assert(isFunction(new Function()));
    
    this.assertFalse(isFunction(1));
    this.assertFalse(isFunction({}));
    this.assertFalse(isFunction([]));
    this.assertFalse(isFunction('a'));
    this.assertFalse(isFunction(null));
    this.assertFalse(isFunction(false));
  },
  
  test_isString: function() {
    this.assert(isString('a'));
    this.assert(isString(new String('a')));
    
    this.assertFalse(isString(1));
    this.assertFalse(isString({}));
    this.assertFalse(isString([]));
    this.assertFalse(isString(null));
    this.assertFalse(isString(false));
    this.assertFalse(isString(function() {}));
  },
  
  test_isArray: function() {
    this.assert(isArray([]));
    this.assert(isArray(new Array()));
    
    this.assertFalse(isArray(1));
    this.assertFalse(isArray({}));
    this.assertFalse(isArray('a'));
    this.assertFalse(isArray(null));
    this.assertFalse(isArray(false));
    this.assertFalse(isArray(function(){}));
  },
  
  test_isNumber: function() {
    this.assert(isNumber(1));
    this.assert(isNumber(1.1));
    this.assert(isNumber(new Number(1)));
    this.assert(isNumber(new Number(-1.1)));
    
    this.assertFalse(isNumber({}));
    this.assertFalse(isNumber([]));
    this.assertFalse(isNumber('1'));
    this.assertFalse(isNumber(null));
    this.assertFalse(isNumber(false));
    this.assertFalse(isNumber(function() {}));
  },
  
  test_$A: function() {
    var args;
    (function() { args = $A(arguments); })(1,2,3,4);
    this.assertEqual([1,2,3,4], args);
  },
  
  test_$N: function() {
    this.assertInstanceOf(Number, $N(1));
    this.assertInstanceOf(Number, $N(1.1));
    this.assertEqual($N(1), $N('1'));
    this.assertEqual($N(-1.1), $N('-1.1'));
    this.assert($N(1) == 1);
    this.assert($N(1.1) == 1.1);
  },
  
  test_$_Extending: function() {
    var el = document.createElement('div');
    
    this.assertSame(el, $(el));
    this.assertNotNull(el['hasClass'], "check if the object was prepared");
  },
  
  getFreshNode: function() {
    var id = 'some-testing-div-id';
    var el = document.getElementById(id);
    if (el) {
      el.parentNode.removeChild(el);
    }
    var el = document.createElement('div');
    el.id = id;
    
    document.body.appendChild(el);
    
    return el;
  },
  
  test_$_Search: function() {
    var el = this.getFreshNode();
    
    this.assertSame(el, $(el.id));
    this.assertNotNull(el['hasClass']);
  },
  
  test_$$: function() {
    var el = this.getFreshNode();
    el.className = 'some-weird-class';
    
    this.assertEqual([], $$('div.something-non-existing'));
    //this.assert($$('div.some-weird-class') == [el]);
  }
});