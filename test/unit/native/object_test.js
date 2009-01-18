/**
 * The Object unit test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ObjectTest = TestCase.create({
  name: 'ObjectTest',
  
  testKeys: function() {
    this.assertEqual(['a', 'b'], Object.keys({a:1, b:2}));
  },
  
  testValues: function() {
    this.assertEqual([1,2], Object.values({a:1, b:2}));
  },
  
  testWithout: function() {
    this.assertEqual({b:2, c:3}, Object.without({a:1, b:2, c:3}, 'a'));
    this.assertEqual({c:3}, Object.without({a:1, b:2, c:3}, 'a', 'b'));
    this.assertEqual({c:3}, Object.without({a:1, b:2, c:3}, ['a', 'b']));
  },
  
  testOnly: function() {
    this.assertEqual({b:2,d:4}, Object.only({a:1, b:2, c:3, d:4}, 'b', 'd'));
    this.assertEqual({a:1,c:3}, Object.only({a:1, b:2, c:3, d:4}, ['a', 'c']));
  },
  
  testWalk: function() {
    var o = {'1': '1', '2': '2'};
    this.assertSame(o, Object.walk(o, function(key, value) {
      return [key+'k', value+'v'];
    }));
    
    this.assertEqual({'1k': '1v', '2k': '2v'}, o);
  },
  
  testEachKey: function() {
    var o = {'1': '1', '2': '2'};
    this.assertSame(o, Object.eachKey(o, function(key){
      return key + 'x';
    }));
    this.assertEqual({'1x':'1', '2x':'2'}, o);
  },
  
  testMerge: function() {
    var o1 = {1:1};
    var o2 = {2:2};
    var o3 = {3:3};
    var o4 = Object.merge(o1,o2,o3,null,false,1);
    
    this.assertEqual({1:1,2:2,3:3}, o4);
    this.assertEqual({1:1}, o1);
    this.assertEqual({2:2}, o2);
    this.assertEqual({3:3}, o3);
  }
});