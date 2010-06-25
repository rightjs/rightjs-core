/**
 * The native units access tests
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var LangTest = TestCase.create({
  name: 'LangTest',
  
  testNumber: function() {
    this.assert('times' in RightJS.Number.prototype);
    this.assertFalse('times' in Number.prototype);
    
    var num = new RightJS.Number(10);
    var nums = [];
    
    if (!('times' in num)) return; // due a Safari issue
    
    this.assert('times' in num);
    
    num.times(function(i) { nums.push(i); });
    
    this.assertEqual([0,1,2,3,4,5,6,7,8,9], nums);
  },
  
  testNumberQuickAccess: function() {
    var num = RightJS(10);
    var nums = [];
    
    this.assert(num instanceof RightJS.Number);
    
    num.times(function(i) { nums.push(i); });
    
    this.assertEqual([0,1,2,3,4,5,6,7,8,9], nums);
  },
  
  testString: function() {
    this.assert('endsWith' in RightJS.String.prototype);
    this.assertFalse('endsWith' in String.prototype);
    
    var str = new RightJS.String('boo.hoo');
    
    if (!('endsWith' in str)) return; // due a Safari issue
    
    this.assert('endsWith' in str);
    this.assert(str.endsWith('.hoo'));
    
    this.assertEqual('boo.hoo', ''+ str);
  },
  
  testStringQuickAccess: function() {
    var str = RightJS('boo.hoo');
    
    this.assert(str instanceof RightJS.String);
    this.assert(str.endsWith('.hoo'));
    
    this.assertEqual('boo.hoo', ''+str);
  },
  
  testFunction: function() {
    this.assert('curry' in RightJS.Function.prototype);
    this.assertFalse('curry' in Function.prototype);
    
    var func = new RightJS.Function('a,b', 'return [a,b];');
    
    if (!('curry' in func)) return;  // due a Safari issue
    
    this.assert(func instanceof RightJS.Function);
    
    var result = func.curry('A')('B');
    
    this.assertEqual('A', result[0]);
    this.assertEqual('B', result[1]);
  },
  
  testFunctionQuickAccess: function() {
    var A, B;
    var func1 = function(a, b) { A = a, B = b };
    
    this.assertFalse('curry' in func1);
    
    var func2 = RightJS(func1);
    
    this.assertSame(func1, func2);
    this.assert('curry' in func1);
    
    func2.curry('A')('B');
    
    this.assertEqual('A', A);
    this.assertEqual('B', B);
  },
  
  testArray: function() {
    this.assert('without' in RightJS.Array.prototype);
    this.assertFalse('without' in Array.prototype);
    
    var arr1 = new RightJS.Array('a', 'b', 'c');
    
    if (!('without' in arr1)) return;  // due a Safari issue
    
    this.assert('without' in arr1);
    
    var arr2 = arr1.without('b');
    this.assert(arr2 instanceof RightJS.Array);
    this.assertEqual(['a', 'c'], [].concat(arr2));
  },
  
  testArrayQuickAccess: function() {
    var arr1 = RightJS.$A([1,2,3]);
    
    this.assert(arr1 instanceof RightJS.Array);
    this.assertEqual([1,2,3], [].concat(arr1));
    
    var arr2 = RightJS([1,2,3]);
    this.assert(arr2 instanceof RightJS.Array);
    this.assertEqual([1,2,3], [].concat(arr2));
  }
});