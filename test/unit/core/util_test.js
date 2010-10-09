/**
 * There are the util methods test-case
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var UtilTest = TestCase.create({
  name: "UtilTest",

  beforeAll: function() {
    var id = 'datatypes_checks_iframe';

    this.frame_block = $E('div').insertTo(document.body).update('<iframe name="'+id+'" id="'+id+
      '" width="0" height="0" frameborder="0" src="about:blank"></iframe>');

    var array, object, doc, und, nil;

    with (window.frames[id]) {
      array  = Array;
      object = Object;
      doc    = document;
      und    = undefined;
      nil    = null;
    }

    this.scoped = {
      'Array':    array,
      'Object':   object,
      'document': doc,
      'undef':    und,
      'nil':      nil
    };
  },

  afterAll: function() {
    this.frame_block.remove();
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

    this.assertFalse(defined(undefined));

    this.assertFalse(defined(this.scoped.undef), "another frame undefined");

    var smth = new this.scoped.Object();
    this.assertFalse(defined(smth.smth), "another frame's Object undefined key")
  },

  test_isHash: function() {
    this.assert(isHash({}));
    this.assert(isHash(new Object()));

    this.assertFalse(isHash(1));
    this.assertFalse(isHash([]));
    this.assertFalse(isHash('a'));
    this.assertFalse(isHash(null));
    this.assertFalse(isHash(false));
    this.assertFalse(isHash(undefined));
    this.assertFalse(isHash(function() {}));
    this.assertFalse(isHash(new String('a')));
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
    this.assert(isElement(document.createElement('div')) === true);
    this.assert(isElement(document.body) === true);

    this.assert(isElement(1) === false);
    this.assert(isElement({}) === false);
    this.assert(isElement([]) === false);
    this.assert(isElement('1') === false);
    this.assert(isElement(null) === false);
    this.assert(isElement(false) === false);
    this.assert(isElement(function() {}) === false);
    this.assert(isElement(new Element('span')) === false);
    this.assert(isElement(document.createTextNode('asdfasdfasd')) === false);
  },

  testIsNode: function() {
    this.assert(isNode(document.createElement('div')) === true);
    this.assert(isNode(document.createTextNode('asdfasdf')) === true);

    this.assert(isElement(1) === false);
    this.assert(isElement({}) === false);
    this.assert(isElement([]) === false);
    this.assert(isElement('1') === false);
    this.assert(isElement(null) === false);
    this.assert(isElement(false) === false);
    this.assert(isElement(function() {}) === false);
    this.assert(isNode(new Element('div')) === false);
  },

  test_$A: function() {
    var args;
    (function() { args = $A(arguments); })(1,2,3,4);
    this.assertEqual([1,2,3,4], args);
  },

  test_$E: function() {
    var div = $E('div', {id: 'div-id'});
    this.assert(isElement(div._));
    this.assert(div instanceof RightJS.Element);
    this.assertEqual('DIV', div._.tagName);
    this.assertEqual('div-id', div._.id);
  },

  test_$_Extending: function() {
    var el = document.createElement('div');
    var wrap = $(el);

    this.assert(wrap instanceof RightJS.Element);
    this.assertSame(el, wrap._);
  },

  test_$_EventAccess: function() {
    var event = {target: document.createElement('div')};
    var wrap  = $(event);

    this.assert(wrap instanceof RightJS.Event);
    this.assertSame(event, wrap._);
  },

  test_$_DocumentAccess: function() {
    var doc = $(document);

    this.assert(doc instanceof RightJS.Document);
    this.assertSame(document, doc._);
  },

  test_$_WindowAccess: function() {
    var win = $(window);

    this.assert(win instanceof RightJS.Window);
    this.assertSame(window, win._);
  },

  test_$_SingleInstance: function() {
    var el = document.createElement('div');
    var wrap1 = $(el);
    var wrap2 = $(el);

    this.assertSame(wrap1, wrap2);

    var doc1 = $(document);
    var doc2 = $(document);

    this.assertSame(doc1, doc2, "checking the document single access");

    var win1 = $(window);
    var win2 = $(window);

    this.assertSame(win1, win2, "checking the window single access");
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

  test_$_ID_Search: function() {
    var el = this.getFreshNode();
    var wrap = $(el.id);

    this.assert(wrap instanceof RightJS.Element);
    this.assertSame(el, wrap._);
  },

  test_$$_CSS_Search: function() {
    var el = this.getFreshNode();
    el.className = 'some-weird-class';

    var res1 = $$('div.something-non-existing');
    var res2 = $$('div.some-weird-class');

    this.assertEqual([], res1);
    this.assertEqual(1, res2.length);

    this.assert(res2[0] instanceof RightJS.Element);
    this.assertSame(el, res2[0]._);
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
