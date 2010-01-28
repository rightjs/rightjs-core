/**
 * There are the util methods test-case
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var UtilTest = TestCase.create({
  name: "UtilTest",
  
  beforeAll: function() {
    var id = 'datatypes_checks_iframe';
    
    $E('div').insertTo(document.body).update('<iframe name="'+id+'" id="'+id+
      '" width="0" height="0" frameborder="0" src="about:blank"></iframe>');
    
    var array, object, doc;
    
    with (window.frames[id]) {
      array  = Array;
      object = Object;
      doc    = document;
    }
    
    this.scoped = {
      'Array':    array,
      'Object':   object,
      'document': doc
    };
  },
  
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
  
  test_$eval: function() {
    window.____a = null;
    $eval('var ____a = 1;');
    this.assertEqual(1, window.____a, 'getting shure the script was evaled in the window scope');
  },
  
  test_$alias: function() {
    var o = {
      foo: function() {},
      bar: function() {}
    };
    
    this.assertSame(o, $alias(o, {
      foo: '_foo',
      bar: '_bar'
    }));
    
    this.assertSame(o.foo, o._foo);
    this.assertSame(o.bar, o._bar);
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
    this.assertFalse(isHash(new Element('div')));
    this.assertFalse(isHash(document.createElement('div')));
    
    
    // checking scoped elements
    this.assertFalse(isHash(this.scoped.Array));
    this.assertFalse(isHash(this.scoped.Object));
    this.assertFalse(isHash(this.scoped.document));
    
    this.assertFalse(isHash(new this.scoped.Array));
    this.assertFalse(isHash(this.scoped.document.createElement('div')));
    
    this.assertTrue(isHash(new this.scoped.Object));
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
    
    this.assert(new this.scoped.Array);
  },
  
  test_isNumber: function() {
    this.assert(isNumber(1));
    this.assert(isNumber(1.1));
    this.assert(isNumber(-1.1));
    
    this.assertFalse(isNumber({}));
    this.assertFalse(isNumber([]));
    this.assertFalse(isNumber('1'));
    this.assertFalse(isNumber(null));
    this.assertFalse(isNumber(false));
    this.assertFalse(isNumber(function() {}));
  },
  
  test_isElement: function() {
    this.assert(isElement(document.createElement('div')));
    this.assert(isElement(new Element('span')));
    this.assert(isElement(document.body));
    
    this.assertFalse(isElement(1));
    this.assertFalse(isElement({}));
    this.assertFalse(isElement([]));
    this.assertFalse(isElement('1'));
    this.assertFalse(isElement(null));
    this.assertFalse(isElement(false));
    this.assertFalse(isElement(function() {}));
    this.assertFalse(isElement(document.createTextNode('asdfasdfasd')));
  },
  
  testIsNode: function() {
    this.assert(isNode(document.createElement('div')));
    this.assert(isNode(document.createTextNode('asdfasdf')));
    this.assert(isNode(new Element('div')));
    
    this.assertFalse(isElement(1));
    this.assertFalse(isElement({}));
    this.assertFalse(isElement([]));
    this.assertFalse(isElement('1'));
    this.assertFalse(isElement(null));
    this.assertFalse(isElement(false));
    this.assertFalse(isElement(function() {}));
  },
  
  test_$A: function() {
    var args;
    (function() { args = $A(arguments); })(1,2,3,4);
    this.assertEqual([1,2,3,4], args);
  },
  
  test_$E: function() {
    var div = $E('div', {id: 'div-id'});
    this.assert(isElement(div));
    this.assertEqual('DIV', div.tagName);
    this.assertEqual('div-id', div.id);
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
  },
  
  test_$w: function() {
    this.assertEqual(['any', 'beny', 'crubs'], $w("any    beny  \n\n\t crubs "));
  },
  
  test_$uid: function() {
    var obj1 = {};
    var obj2 = {};
    var uid1 = $uid(obj1);
    var uid2 = $uid(obj2);
    var uid3 = $uid(obj1);
    var uid4 = $uid(obj2);
    
    this.assertTypeOf("number", uid1);
    this.assertTypeOf("number", uid2);
    this.assertTypeOf("number", uid3);
    this.assertTypeOf("number", uid4);
    
    this.assertEqual(uid1, uid3);
    this.assertEqual(uid2, uid4);
    
    this.assertNotEqual(uid1, uid2);
  }
});