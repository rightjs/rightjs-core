/**
 * The Element class styles related module functionality test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
document.write('<st'+'yle>div.test---1234{font-size: 14px; display:none;}</st'+'yle>');
var ElementStylesTest = TestCase.create({
  name: 'ElementStylesTest',
  
  setUp: function() {
    this.el = new Element('div');
  },
  
  testSetStyleWithKeyValue: function() {
    this.assertSame(this.el, this.el.setStyle('fontSize', '14px'));
    this.assertStyle(this.el, {fontSize: '14px'});
  },
  
  testSetStyleAsHash: function() {
    var style = {
      fontSize: '14px',
      borderSize: '2px',
      display: 'block'
    }
    
    this.assertSame(this.el, this.el.setStyle(style));
    this.assertStyle(this.el, style);
  },
  
  testGetStyleWithElementLevelStyles: function() {
    this.el.setStyle({
      'fontSize': '12px',
      'borderSize': '2px'
    });
    
    this.assertEqual('12px', this.el.getStyle('font-size'));
    this.assertEqual('2px', this.el.getStyle('borderSize'));
  },
  
  testGetStyleWithCSSLevelStyles: function() {
    this.el.className = 'test---1234';
    document.body.appendChild(this.el);
    
    this.assertEqual('14px', this.el.getStyle('font-size'));
    this.assertEqual('none', this.el.getStyle('display'));
  },
  
  testSetOpacityStyle: function() {
    this.el.setStyle('opacity', 0.4);
    
    if (Browser.IE) {
      this.assertEqual('alpha(opacity=40)', this.el.style['filter']);
    } else {
      this.assertEqual('0.4', this.el.style['opacity']);
    }
  },
  
  testGetOpacityStyle: function() {
    this.el.setStyle('opacity', 0.4);
    
    this.assertEqual('0.4', this.el.getStyle('opacity'));
  },
  
  testSetFloatStyle: function() {
    this.el.setStyle('float', 'right');
    
    this.assertEqual('right', this.el.style[Browser.IE ? 'styleFloat' : 'cssFloat']);
  },
  
  testGetFloatStyle: function() {
    this.el.setStyle('float', 'right');
    
    this.assertEqual('right', this.el.getStyle('float'));
  },
  
  testHasClass: function() {
    this.assert(!this.el.hasClass('foo'));
    this.assert(!this.el.hasClass('boo'));
    
    this.el.className = 'foo';
    
    this.assert( this.el.hasClass('foo'));
    this.assert(!this.el.hasClass('boo'));
    
    this.el.className = 'foo boo';
    
    this.assert(this.el.hasClass('foo'));
    this.assert(this.el.hasClass('boo'));
  },
  
  testSetClass: function() {
    this.assertSame(this.el, this.el.setClass('foo bar'));
    this.assertEqual('foo bar', this.el.className);
  },
  
  testAddClass: function() {
    this.assertHasNoClassName(this.el, 'foo');
    this.assertHasNoClassName(this.el, 'boo');
    
    this.el.addClass('foo');
    
    this.assertHasClassName(this.el, 'foo');
    this.assertHasNoClassName(this.el, 'boo');
    
    this.assertSame(this.el, this.el.addClass('boo'), "check if the method returns the element again");
    
    this.assertHasClassName(this.el, 'foo');
    this.assertHasClassName(this.el, 'boo');
    
    this.el.addClass('boo');
    this.assertEqual('foo boo', this.el.className, "check if the class was not added twice");
  },
  
  testRemoveClass: function() {
    this.el.className = 'foo boo';
      
    this.el.removeClass('foo');
    this.assertEqual('boo', this.el.className);
    
    this.assertSame(this.el, this.el.removeClass('boo'), "check if the method returns the element again");
    this.assertEqual('', this.el.className);
  },
  
  testToggleClass: function() {
    this.el.toggleClass('foo');
    this.assertHasClassName(this.el, 'foo');
    
    this.assertSame(this.el, this.el.toggleClass('foo'));
    this.assertHasNoClassName(this.el, 'foo');
  },
  
  testRadioClass: function() {
    var block = document.createElement('div');
    var el1 = document.createElement('div');
    var el2 = document.createElement('div');
    var el3 = document.createElement('div');
    
    block.appendChild(el1);
    block.appendChild(el2);
    block.appendChild(el3);
    
    $(el1).radioClass('test');
    this.assertHasClassName(el1, 'test');
    this.assertHasNoClassName(el2, 'test');
    this.assertHasNoClassName(el3, 'test');
    
    $(el2).radioClass('test');
    this.assertHasNoClassName(el1, 'test');
    this.assertHasClassName(el2, 'test');
    this.assertHasNoClassName(el3, 'test');
    
    $(el3).radioClass('test');
    this.assertHasNoClassName(el1, 'test');
    this.assertHasNoClassName(el2, 'test');
    this.assertHasClassName(el3, 'test');
  }
});
