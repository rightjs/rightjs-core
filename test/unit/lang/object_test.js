/**
 * The Object unit test-case
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var ObjectTest = TestCase.create({
  name: 'ObjectTest',

  testKeys: function() {
    this.assertEqual(['a', 'b'], Object.keys({a:1, b:2}));
  },

  testValues: function() {
    this.assertEqual([1,2], Object.values({a:1, b:2}));
  },

  testEach: function() {
    var hash = {k1: 'v1', k2: 'v2'}, args = [], scope = {}, callback_scope;

    this.assertSame(hash, Object.each(hash, function() {
      args.push($A(arguments));
      callback_scope = this;
    }, scope));

    this.assertSame(scope, callback_scope);
    this.assertEqual([
      ['k1', 'v1'],
      ['k2', 'v2']
    ], args);
  },

  testEmpty: function() {
    this.assert(Object.empty({}));
    this.assertFalse(Object.empty({1: 1}));

    this.assertFalse(Object.empty({'': 'boo'}), "should be fine with weird keys");
  },

  testWithout: function() {
    this.assertEqual({b:2, c:3}, Object.without({a:1, b:2, c:3}, 'a'));
    this.assertEqual({c:3}, Object.without({a:1, b:2, c:3}, 'a', 'b'));
  },

  testOnly: function() {
    this.assertEqual({b:2,d:4}, Object.only({a:1, b:2, c:3, d:4}, 'b', 'd'));
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
  },

  testDeepMerge: function() {
    var o1 = {a: {b: {c: 'd'}, e: 'f'}};
    var o2 = {a: {b: {c: 'd', e: 'f'}}};

    var o = Object.merge(o1, o2);

    this.assertEqual(
      {a: {b: {c: 'd', e: 'f'}, e: 'f'}}, o,
      "getting sure it was actually merged"
    );
    this.assert(
      o.a !== o1.a && o.a !== o2.a && o.a.b !== o1.a.b && o.a.b !== o2.a.b,
      "checking that all the keys were delinked"
    );
  },

  testClone: function() {
    var o1 = {1:1};
    var o2 = Object.clone(o1);

    this.assertEqual(o1, o2);
    this.assertNotSame(o1, o2);
  },

  testToQueryString: function() {
    this.assertEqual('a=a&b=b&c=%25%23%3F', Object.toQueryString({a:'a', b:'b', c:'%#?'}));
    this.assertEqual('a%5B%5D=1&a%5B%5D=2&a%5B%5D=3', Object.toQueryString({'a[]': [1,2,3]}));
  }
});
