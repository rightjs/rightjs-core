/**
 * The Element unit common methods module test-case
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
document.write('<st'+'yle>div.test-show-1234{display:none}</st'+'yle>');
var ElementCommonsTest = TestCase.create({
  name: 'ElementCommonsTest',

  setUp: function() {
    this.el = new Element('div');
  },

  testSetSimple: function() {
    this.assertSame(this.el, this.el.set('id', 'some-id'));
    this.assertEqual('some-id', this.el._.id);
  },

  testSetHash: function() {
    this.assertSame(this.el, this.el.set({
      id: 'another-id',
      'title': 'foo bar'
    }));

    this.assertEqual('another-id', this.el._.id);
    this.assertEqual('foo bar', this.el._.title);
  },

  testSetCustom: function() {
    this.el.set('data-boo', 'boo');
    this.assertNull(this.el._['data-boo']);
    this.assertEqual('boo', this.el._.getAttribute('data-boo'));
  },

  testSetLabelFor: function() {
    var label = $E('label', {'for': 'boo'});
    this.assertEqual('boo', label._.getAttribute('for'));
  },

  testSetStyle: function() {
    this.el.set('style', 'height:100px');
    this.assertEqual('100px', this.el._.style.height);

    this.el.set('style', {height: '200px'});
    this.assertEqual('200px', this.el._.style.height);
  },

  testGet: function() {
    this.el._.id = 'something';
    this.assertEqual(this.el._.id, this.el.get('id'));
    this.assertNull(this.el.get('title'));
  },

  testHas: function() {
    this.el._.id = 'something';
    this.assert(this.el.has('id'));
    this.assertFalse(this.el.has('title'));
  },

  testErase: function() {
    this.el._.id = 'somethig';
    this.assertSame(this.el, this.el.erase('id'));
    this.assertFalse(this.el.has('id'));
  },

  testEraseCustom: function() {
    this.el.set('data-boo', 'boo');
    this.el.erase('data-boo');

    this.assertEqual(null, this.el.get('data-boo'));
    this.assertEqual(undefined, this.el._['data-boo']);
  },

  testHidden: function() {
    this.assertFalse(this.el.hidden());
    this.el._.style.display = 'none';
    this.assert(this.el.hidden());
  },

  testVisible: function() {
    this.assert(this.el.visible());
    this.el._.style.display = 'none';
    this.assertFalse(this.el.visible());
  },

  testHide: function() {
    this.assertVisible(this.el._);
    this.assertSame(this.el, this.el.hide());
    this.assertHidden(this.el._);
  },

  testShow: function() {
    this.el._.style.display = 'none';
    this.assertHidden(this.el._)
    this.assertSame(this.el, this.el.show());
    this.assertVisible(this.el._);
  },

  testShowWithCSS: function() {
    this.el.setClass('test-show-1234').insertTo(document.body);
    this.assertEqual('none', this.el.getStyle('display'));
    this.assertSame(this.el, this.el.show());
    this.assertEqual('block', this.el.getStyle('display'));
    this.el.remove();
  },

  testHideShowPrevDisplayRestoration: function() {
    this.el._.style.display = 'inline';
    this.el.hide();
    this.el.show();
    this.assertStyle(this.el._, {display: 'inline'});
  },

  testToggle: function() {
    this.assertVisible(this.el._);
    this.assertSame(this.el, this.el.toggle());
    this.assertHidden(this.el._);
    this.assertSame(this.el, this.el.toggle());
    this.assertVisible(this.el._);
  },

  testRadio: function() {
    var block = document.createElement('div');
    var div1  = new Element('div');
    var div2  = new Element('div');
    var div3  = new Element('div');

    block.appendChild(div1._);
    block.appendChild(div2._);
    block.appendChild(div3._);

    this.assertSame(div1, div1.radio());
    this.assertVisible(div1._, 'div1');
    this.assertHidden(div2._);
    this.assertHidden(div3._);

    this.assertSame(div2, div2.radio());
    this.assertVisible(div2._, 'div2');
    this.assertHidden(div1._);
    this.assertHidden(div3._);

    this.assertSame(div3, div3.radio());
    this.assertVisible(div3._, 'div3');
    this.assertHidden(div2._);
    this.assertHidden(div1._);
  },

  testDataGet: function() {
    var element = new Element('div', {
      'data-false':  'false',
      'data-true':   'true',
      'data-number': '1.23',
      'data-string': '"string"',
      'data-array':  '[1,2,3]',
      'data-object': '{"boo":"hoo"}',
      'data-plain':  'plain text'
    });

    this.assertEqual(false,        element.data('false'));
    this.assertEqual(true,         element.data('true'));
    this.assertEqual(1.23,         element.data('number'));
    this.assertEqual('string',     element.data('string'));
    this.assertEqual([1,2,3],      element.data('array'));
    this.assertEqual({boo: "hoo"}, element.data('object'));

    this.assertEqual('plain text', element.data('plain'));

    this.assertNull(element.data('non-existing'));
  },

  testDataGetNested: function() {
    var element = new Element('div', {
      'data-thing-one': '1',
      'data-thing-two': '2',
      'data-thing-three-one': '3.1'
    });

    this.assertEqual({
      one: 1, two: 2, threeOne: 3.1
    }, element.data('thing'));
  },

  testDataSet: function() {
    var element = new Element('div');

    this.assertSame(element, element.data('string', 'string'));
    this.assertEqual('string', element._.getAttribute('data-string'));
    this.assertNull(element['data-string']);

    this.assertEqual('false',         element.data('false', false)._.getAttribute('data-false'));
    this.assertEqual('true',          element.data('true', true)._.getAttribute('data-true'));
    this.assertEqual('1.23',          element.data('number', 1.23)._.getAttribute('data-number'));
    this.assertEqual('[1,2,3]',       element.data('array', [1,2,3])._.getAttribute('data-array'));
  },

  testDataSetObject: function() {
    var element = new Element('div');

    this.assertSame(element, element.data('test', {
      'one': 1, two: 2, 'three-one': 3.1, 'threeTwo': 3.2
    }));

    this.assertEqual('1',   element._.getAttribute('data-test-one'));
    this.assertEqual('2',   element._.getAttribute('data-test-two'));
    this.assertEqual('3.1', element._.getAttribute('data-test-three-one'));
    this.assertEqual('3.2', element._.getAttribute('data-test-three-two'));
  },

  testDataSetHash: function() {
    var element = new Element('div');

    this.assertSame(element, element.data({
      one: 1, two: 2, three: 3
    }));

    this.assertEqual('1', element._.getAttribute('data-one'));
    this.assertEqual('2', element._.getAttribute('data-two'));
    this.assertEqual('3', element._.getAttribute('data-three'));
  },

  testDataRemove: function() {
    var element = new Element('div', {'data-something': 'something'});

    this.assertEqual(element, element.data('something', null));
    this.assertFalse(element.has('data-something'));
  }
});
