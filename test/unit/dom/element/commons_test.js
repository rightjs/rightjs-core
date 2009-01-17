/**
 * The Element unit common methods module test-case
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementCommonsTest = TestCase.create({
  name: 'ElementCommonsTest',
  
  setUp: function() {
    this.el = new Element('div');
  },
  
  testSetSimple: function() {
    this.assertSame(this.el, this.el.set('id', 'some-id'));
    this.assertEqual('some-id', this.el.id);
  },
  
  testSetHash: function() {
    this.assertSame(this.el, this.el.set({
      id: 'another-id',
      className: 'foo bar'
    }));
    
    this.assertEqual('another-id', this.el.id);
    this.assertEqual('foo bar', this.el.className);
  },
  
  testGet: function() {
    this.el.id = 'something';
    this.assertEqual(this.el.id, this.el.get('id'));
    this.assertNull(this.el.get('title'));
  },
  
  testHas: function() {
    this.el.id = 'something';
    this.assert(this.el.has('id'));
    this.assertFalse(this.el.has('title'));
  },
  
  testHidden: function() {
    this.assertFalse(this.el.hidden());
    this.el.style.display = 'none';
    this.assert(this.el.hidden());
  },
  
  testVisible: function() {
    this.assert(this.el.visible());
    this.el.style.display = 'none';
    this.assertFalse(this.el.visible());
  },
  
  testHide: function() {
    this.assertVisible(this.el);
    this.assertSame(this.el, this.el.hide());
    this.assertHidden(this.el);
  },
  
  testShow: function() {
    this.el.style.display = 'none';
    this.assertHidden(this.el)
    this.assertSame(this.el, this.el.show());
    this.assertVisible(this.el);
  },
  
  testHideShowPrevDisplayRestoration: function() {
    this.el.style.display = 'inline';
    this.el.hide();
    this.el.show();
    this.assertStyle(this.el, {display: 'inline'});
  },
  
  testToggle: function() {
    this.assertVisible(this.el);
    this.assertSame(this.el, this.el.toggle());
    this.assertHidden(this.el);
    this.assertSame(this.el, this.el.toggle());
    this.assertVisible(this.el);
  },
  
  testRemove: function() {
    document.body.appendChild(this.el);
    this.assertSame(document.body, this.el.parentNode);
    this.assertCalled(document.body, 'removeChild', function() {
      this.assertSame(this.el, this.el.remove());
    }, this);
  }
})