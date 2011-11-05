/**
 * The Element data attributes related methods test-case
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var ElementDataTest = TestCase.create({
  name: 'ElementDataTest',

  setUp: function() {
    this.el = $E('div')
  },

  tearDown: function() {
    this.el.remove();
  },

  testLoadData: function() {
    this.el.set({
      'data-string': 'hello',
      'data-false': 'false',
      'data-true': 'true',
      'data-null': 'null',
      'data-number': '1.23',
      'data-array': '[1, 2, 3]',
      'data-object': '{foo: \'bar\'}'
    });

    this.el.loadData();

    this.assertEqual({
      'string': 'hello',
      'false': false,
      'true': true,
      'null': null,
      'number': 1.23,
      'array': [1, 2, 3],
      'object': {'foo': 'bar'}
    }, this.el._data);
  },

  testWriteData: function() {
    this.el.writeData('hello', 'foo');
    this.assertEqual({'hello': 'foo'}, this.el._data);
    this.el.writeData('hello-world', 'foo');
    this.assertEqual({'hello': {'world': 'foo'}}, this.el._data);
    this.el.writeData('hello-planet', 'bar');
    this.assertEqual({'hello': {'world': 'foo', 'planet': 'bar'}}, this.el._data);
  },

  testReadData: function() {
    this.el.writeData('hello-foo-bar', 'baz');

    this.assertEqual({'hello': {'foo': {'bar': 'baz'}}}, this.el.readData());
    this.assertEqual({'foo': {'bar': 'baz'}}, this.el.readData('hello'));
    this.assertEqual({'bar': 'baz'}, this.el.readData('hello-foo'));
    this.assertEqual('baz', this.el.readData('hello-foo-bar'));
    this.assertEqual(undefined, this.el.readData('hello-foo-bar-baz'));
    this.assertEqual(undefined, this.el.readData('world'));
  },

  testData: function() {
    this.assertEqual('foo', this.el.data('hello', 'foo'));
    this.assertEqual('foo', this.el.data('hello'));
  },

  testHasData: function() {
    this.el.data('hello', 'foo');

    this.assertEqual(true, this.el.hasData('hello'));
    this.assertEqual(false, this.el.hasData('world'));
  },

  testRemoveData: function() {
    this.el.writeData('hello-foo-bar', {'baz': 'world'});

    this.assertEqual(undefined, this.el.removeData('world'));
    this.assertEqual('world', this.el.removeData('hello-foo-bar-baz'));
    this.assertEqual({'hello': {'foo': {'bar': {}}}}, this.el._data);
    this.assertEqual({'bar': {}}, this.el.removeData('hello-foo'));
    this.assertEqual({'hello': {}}, this.el._data);
    this.assertEqual({'hello': {}}, this.el.removeData());
    this.assertEqual({}, this.el._data);
  }
});