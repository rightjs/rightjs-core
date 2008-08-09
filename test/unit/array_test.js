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
  
  testInclude: function() {
    this.assert([true].include(true));
    this.assert([1,2,3,4,5].include(2,4));
    
    this.assertFalse([true].include(false));
    this.assertFalse([1,2,3,4,5].include(6));
    this.assertFalse([1,2,3,4,5].include(2, 6));
  }
});