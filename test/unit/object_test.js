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
  }
});