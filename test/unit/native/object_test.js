/**
 * The Object unit test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ObjectTest = TestCase.create({
  name: 'ObjectTest',
  
  testExtend: function() {
    var obj1 = { a: 1, b: 2 };
    var obj2 = { b: 3, c: 4 };
    
    this.assertSame(obj1, Object.extend(obj1, obj2));
    this.assertEqual({ a:1, b:3, c:4 }, obj1);
  },
  
  testExtendWithoutOverwritting: function() {
    var obj1 = { a: 1, b: 2 };
    var obj2 = { b: 3, c: 4 };
    
    this.assertSame(obj1, Object.extend(obj1, obj2, true));
    this.assertEqual({ a:1, b:2, c:4 }, obj1);
  },
  
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
  }
});