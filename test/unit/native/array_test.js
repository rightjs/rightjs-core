/**
 * The Array unit test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ArrayTest = TestCase.create({
  name: 'ArrayTest',
  
  testIndexOf: function() {
    this.assertEqual(0, [1,2].indexOf(1));
    this.assertEqual(1, [1,2].indexOf(2));
    this.assertEqual(-1, [1,2].indexOf(3));
  },
  
  testLastIndexOf: function() {
    this.assertEqual(2, [1,2,1,2].lastIndexOf(1));
    this.assertEqual(3, [1,2,1,2].lastIndexOf(2));
    this.assertEqual(-1, [1,2,1,2].lastIndexOf(3));
  },
  
  testEach: function() {
    this.assertEqual([2,4,6,8], [1,2,3,4].each(function(value, i, list) {
      list[i] = value * 2;
    }));
  },
  
  testEachWithBreak: function() {
    this.assertEqual([2,2,3,4], [1,2,3,4].each(function(value, i, list) {
      list[i] = value * 2;
      $break();
    }));
  },
  
  testFirst: function() {
    this.assertEqual(1, [1,2,3].first());
    this.assert([].first() === undefined);
  },
  
  testLast: function() {
    this.assertEqual(4, [1,2,3,4].last());
    this.assert([].last() === undefined);
  },
  
  testRandom: function() {
    var rands = [null,null];
    for (var i=0; i < 100; i++) {
      var rand = [2,3,4,5].random();
      rands[rand] = rand;
    }
    this.assertEqual([null,null,2,3,4,5], rands);
  },
  
  testSize: function() {
    this.assertEqual(2, [1,2].size());
    this.assertEqual(4, [1,2,3,4].size());
  },
  
  testClean: function() {
    this.assertEqual([], [1,2,3,4].clean());
  },
  
  testEmpty: function() {
    this.assert([].empty());
    this.assertFalse([null].empty());
  },
  
  testClone: function() {
    var a = [1,2,3,4];
    var b = a.clone();
    
    this.assertEqual(a,b);
    this.assertNotSame(a,b);
  },
  
  testWalk: function() {
    var a = [1,2,3,4];
    var b = a.walk(function(i) { return i * 2;});
    
    this.assertSame(a,b);
    this.assertEqual([2,4,6,8], a);
  },
  
  testWalkWithBreak: function() {
    var a = [1,2,3,4];
    var b = a.walk(function(i) {
      if (i > 2) $break();
      return i * 2;
    });
    
    this.assertSame(a,b);
    this.assertEqual([2,4,3,4], a);
  },
  
  testWalkByName: function() {
    var s = 'Mary Linda Anna Sandy';
    
    var a = $w(s);
    var b = a.walk('toLowerCase');
    this.assertSame(b, a);
    this.assertEqual($w(s.toLowerCase()), a);
    
    var a = $w(s);
    var b = a.walk('replace', /a/g, 'u');
    this.assertSame(b, a);
    this.assertEqual($w(s.replace(/a/g, 'u')), a);
    
    var a = $w(s);
    var b = a.walk('length');
    this.assertSame(b,a);
    this.assertEqual([4, 5, 4, 5], a);
  },
  
  testFilter: function() {
    this.assertEqual([2,4], [1,2,3,4].filter(function(i) { return i%2==0; }));
  },
  
  testFilterWithBreak: function() {
    this.assertEqual([2], [1,2,3,4].filter(function(i) {
      if (i > 2) $break();
      return i%2==0;
    }));
  },
  
  testFilterByName: function() {
    var a = ['', ' ', 'a'];
    
    this.assertEqual([''],      a.filter('empty'));
    this.assertEqual(['', ' '], a.filter('blank'));
    this.assertEqual([' ', 'a'], a.filter('length'));
    
    var a = $w('banana orange lime apple');
    this.assertEqual($w('banana orange apple'), a.filter('includes', 'a'));
  },
  
  testMap: function() {
    var a = [1,2,3,4];
    this.assertEqual([2,4,6,8], a.map(function(item) { return item * 2; }));
    this.assertEqual([1,2,3,4], a);
  },
  
  testMapWithBreak: function() {
    var a = [1,2,3,4];
    this.assertEqual([2,4], a.map(function(item) {
      if (item > 2) $break();
      return item * 2;
    }));
    this.assertEqual([1,2,3,4], a);
  },
  
  testMapByName: function() {
    var a = $w('1 12 123 1234');
    this.assertEqual([1,2,3,4], a.map('length'));
    this.assertEqual([false, false, true, true], a.map('includes', '3'));
    this.assertEqual($w('1 12 125 1254'), a.map('replace', /3/, '5'));
  },
  
  testConcat: function() {
    this.assertEqual([1,2,3,4], [1,2].concat([3],[4]));
  },
  
  testMerge: function() {
    this.assertEqual([1,2,3,4], [1,2].merge([2,3],[3,4]));
  },
  
  testFlatten: function() {
    this.assertEqual([1,2,3,4,5,6,7,8], [1,[2,3],[4,[5,6],[7,8]]].flatten());
  },
  
  testCompact: function() {
    this.assertEqual([1,2,3,4], [1,null, null,2,undefined,3,4].compact());
  },
  
  testUnique: function() {
    this.assertEqual([1,2,3,4], [1,2,1,2,3,1,2,3,4,1,2,3,4].uniq());
  },
  
  testIncludes: function() {
    this.assert([true].includes(true));
    this.assert([1,2,3,4,5].includes(2,4));
    
    this.assertFalse([true].includes(false));
    this.assertFalse([1,2,3,4,5].includes(6));
    this.assertFalse([1,2,3,4,5].includes(2, 6));
  },
  
  testWithout: function() {
    this.assertEqual([1,4], [1,2,3,4].without(2,3));
  },
  
  testAny: function() {
    this.assert([0,false,null,1].any());
    this.assertFalse([0,false,null].any());
    
    this.assert($w('1 12 123 1234').any(function(string) { return string.length > 3;}));
    this.assertFalse($w('1 12 123 1234').any(function(string) { return string.length > 4;}));
    
    this.assert($w('anny manny poop').any('match', /oo/));
    this.assertFalse($w('anny manny poop').any('match', /robot/));
  },
  
  testAll: function() {
    this.assert([1, true, ' '].all());
    this.assertFalse([true, ' ', 0].all());
    
    this.assert($w('1 12 123 1234').all(function(string) { return string.length > 0; }));
    this.assertFalse($w('1 12 123 1234').all(function(string) { return string.length > 1; }));
    
    this.assert($w('anny manny banny').all('match', /a/));
    this.assertFalse($w('anny manny banny').all('match', /m/));
  }
});