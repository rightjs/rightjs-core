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
  
  testForEach: function() {
    this.assertEqual([2,4,6,8], [1,2,3,4].forEach(function(value, i, list) {
      list[i] = value * 2;
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
  
  testSize: function() {
    this.assertEqual(2, [1,2].size());
    this.assertEqual(4, [1,2,3,4].size());
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