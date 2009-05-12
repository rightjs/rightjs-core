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
  
  testErase: function() {
    this.el.id = 'somethig';
    this.assertSame(this.el, this.el.erase('id'));
    this.assertFalse(this.el.has('id'));
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
  
  testRadio: function() {
    var block = document.createElement('div');
    var div1  = new Element('div');
    var div2  = new Element('div');
    var div3  = new Element('div');
    
    block.appendChild(div1);
    block.appendChild(div2);
    block.appendChild(div3);
    
    this.assertSame(div1, div1.radio());
    this.assertVisible(div1, 'div1');
    this.assertHidden(div2);
    this.assertHidden(div3);
    
    this.assertSame(div2, div2.radio());
    this.assertVisible(div2, 'div2');
    this.assertHidden(div1);
    this.assertHidden(div3);
    
    this.assertSame(div3, div3.radio());
    this.assertVisible(div3, 'div3');
    this.assertHidden(div2);
    this.assertHidden(div1);
  }
})