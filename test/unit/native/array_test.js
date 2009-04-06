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
  
  testSelect: function() {
    this.assertEqual([2,4], [1,2,3,4].select(function(i) { return i%2==0; }));
  },
  
  testSelectWithBreak: function() {
    this.assertEqual([2], [1,2,3,4].select(function(i) {
      if (i > 2) $break();
      return i%2==0;
    }));
  },
  
  testCollect: function() {
    var a = [1,2,3,4];
    this.assertEqual([2,4,6,8], a.collect(function(item) { return item * 2; }));
    this.assertEqual([1,2,3,4], a);
  },
  
  testCollectWithBreak: function() {
    var a = [1,2,3,4];
    this.assertEqual([2,4], a.collect(function(item) {
      if (item > 2) $break();
      return item * 2;
    }));
    this.assertEqual([1,2,3,4], a);
  },
  
  testConcat: function() {
    this.assertEqual([1,2,3,4], [1,2].concat([3],[4]));
  },
  
  testMerge: function() {
    this.assertEqual([1,2,3,4], [1,2].merge([2,3],[3,4]));
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
  }
});