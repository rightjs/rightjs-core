/**
 * The Element class styles related module functionality test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementStylesTest = TestCase.create({
  name: 'ElementStylesTest',
  
  testSetStyles: function() {
    var style = {
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'block'
    }
    
    var el = new Element('div');
    this.assertSame(el, el.setStyles(style));
    this.assertStyle(el, style);
  },
  
  testHasName: function() {
    var el = new Element('div');
    
    this.assert(!el.hasClass('foo'));
    this.assert(!el.hasClass('boo'));
    
    el.className = 'foo';
    
    this.assert( el.hasClass('foo'));
    this.assert(!el.hasClass('boo'));
    
    el.className = 'foo boo';
    
    this.assert(el.hasClass('foo'));
    this.assert(el.hasClass('boo'));
  },
  
  testAddClass: function() {
    var el = new Element('div');
    
    this.assertHasNoClassName(el, 'foo');
    this.assertHasNoClassName(el, 'boo');
    
    el.addClass('foo');
    
    this.assertHasClassName(el, 'foo');
    this.assertHasNoClassName(el, 'boo');
    
    this.assertSame(el, el.addClass('boo'), "check if the method returns the element again");
    
    this.assertHasClassName(el, 'foo');
    this.assertHasClassName(el, 'boo');
    
    el.addClass('boo');
    this.assertEqual('foo boo', el.className, "check if the class was not added twice");
  },
  
  testRemoveClass: function() {
    var el = new Element('div');
    el.className = 'foo boo';
      
    el.removeClass('foo');
    this.assertEqual('boo', el.className);
    
    this.assertSame(el, el.removeClass('boo'), "check if the method returns the element again");
    this.assertEqual('', el.className);
  },
  
  testToggleClass: function() {
    var el = new Element('div');
    
    el.toggleClass('foo');
    this.assertHasClassName(el, 'foo');
    
    this.assertSame(el, el.toggleClass('foo'));
    this.assertHasNoClassName(el, 'foo');
  } 
});
