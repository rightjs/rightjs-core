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
    this.div = document.createElement('div');
  },
  
  testSetStyleWithKeyValue: function() {
    this.assertSame(this.el, this.el.setStyle('font-size', '14px'));
    this.assertStyle(this.el, {fontSize: '14px'});
  },
  
  testSetStyleWithKeyValue_static: function() {
    this.assertSame(this.div, Element.setStyle(this.div, 'font-size', '14px'));
    this.assertStyle(this.div, {fontSize: '14px'});
    this.assertNull(this.div['setStyle'], "should not get extended");
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
  
  testSetStyleAsHash_static: function() {
    var style = {
      fontSize: '14px',
      borderSize: '2px',
      display: 'block'
    }
    
    this.assertSame(this.div, Element.setStyle(this.div, style));
    this.assertStyle(this.div, style);
    this.assertNull(this.div['setStyle'], "should not get extended");
  },
  
  testSetStyleAsHashWithDashedKeys: function() {
    this.el.setStyle({
      'font-size': '14px',
      'border-size': '2px'
    });
    
    this.assertStyle(this.el, {
      fontSize: '14px',
      borderSize: '2px'
    })
  },
  
  testGetStyleWithElementLevelStyles: function() {
    this.el.setStyle({
      'font-size': '12px',
      'border-size': '2px'
    });
    
    this.assertEqual('12px', this.el.getStyle('font-size'));
    this.assertEqual('2px', this.el.getStyle('borderSize'));
    
    this.assertEqual('12px', this.el.getOwnStyle('font-size'));
    this.assertEqual('2px', this.el.getOwnStyle('borderSize'));
  },
  
  testGetStyleWithElementLevelStyles_static: function() {
    this.div.style.fontSize = '12px';
    this.div.style.borderSize = '2px';
    
    this.assertEqual('12px', Element.getStyle(this.div, 'font-size'));
    this.assertEqual('2px', Element.getStyle(this.div, 'borderSize'));
    
    this.assertEqual('12px', Element.getOwnStyle(this.div, 'font-size'));
    this.assertEqual('2px', Element.getOwnStyle(this.div, 'borderSize'));
    
    this.assertNull(this.div['getStyle'], "should not get extended");
    this.assertNull(this.div['getOwnStyle'], "should not get extended");
  },
  
  testGetStyleWithCSSLevelStyles: function() {
    this.el.className = 'test---1234';
    document.body.appendChild(this.el);
    
    this.assertEqual('14px', this.el.getStyle('font-size'));
    this.assertEqual('none', this.el.getStyle('display'));
    
    this.assertEqual('14px', this.el.getViewStyle('fontSize'));
    this.assertEqual('none', this.el.getViewStyle('display'));
    
    this.assertNull(this.el.getOwnStyle('font-size'));
    this.assertNull(this.el.getOwnStyle('display'));
  },
  
  testGetStyleWithCSSLevelStyles_static: function() {
    this.div.className = 'test---1234';
    document.body.appendChild(this.div);
    
    this.assertEqual('14px', Element.getStyle(this.div, 'font-size'));
    this.assertEqual('none', Element.getStyle(this.div, 'display'));
    
    this.assertEqual('14px', Element.getViewStyle(this.div, 'fontSize'));
    this.assertEqual('none', Element.getViewStyle(this.div, 'display'));
    
    this.assertNull(Element.getOwnStyle(this.div, 'font-size'));
    this.assertNull(Element.getOwnStyle(this.div, 'display'));
    
    this.assertNull(this.div['getStyle'], "should not get extended");
    this.assertNull(this.div['getViewStyle'], "should not get extended");
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
  
  testHasClass_static: function() {
    this.assert(!Element.hasClass(this.div, 'foo'));
    this.assert(!Element.hasClass(this.div, 'boo'));
    
    this.div.className = 'foo';
    
    this.assert( Element.hasClass(this.div, 'foo'));
    this.assert(!Element.hasClass(this.div, 'boo'));
    
    this.div.className = 'foo boo';
    
    this.assert(Element.hasClass(this.div, 'foo'));
    this.assert(Element.hasClass(this.div, 'boo'));
    
    this.assertNull(this.div['hasClass'], "should not get extended");
  },
  
  testSetClass: function() {
    this.assertSame(this.el, this.el.setClass('foo bar'));
    this.assertEqual('foo bar', this.el.className);
  },
  
  testSetClass_static: function() {
    this.assertSame(this.div, Element.setClass(this.div, 'foo bar'));
    this.assertEqual('foo bar', this.div.className);
    this.assertNull(this.div['setClass'], "should not get extended");
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
  
  testAddClass_static: function() {
    this.assertHasNoClassName(this.div, 'foo');
    this.assertHasNoClassName(this.div, 'boo');
    
    Element.addClass(this.div, 'foo');
    
    this.assertHasClassName(this.div, 'foo');
    this.assertHasNoClassName(this.div, 'boo');
    
    this.assertSame(this.div, Element.addClass(this.div, 'boo'), "check if the method returns the element again");
    
    this.assertHasClassName(this.div, 'foo');
    this.assertHasClassName(this.div, 'boo');
    
    Element.addClass(this.div, 'boo');
    this.assertEqual('foo boo', this.div.className, "check if the class was not added twice");
    
    this.assertNull(this.div['addClass'], "should not get extended");
  },
  
  testRemoveClass: function() {
    this.el.className = 'foo boo';
      
    this.el.removeClass('foo');
    this.assertEqual('boo', this.el.className);
    
    this.assertSame(this.el, this.el.removeClass('boo'), "check if the method returns the element again");
    this.assertEqual('', this.el.className);
  },
  
  testRemoveClass_static: function() {
    this.div.className = 'foo boo';
      
    Element.removeClass(this.div, 'foo');
    this.assertEqual('boo', this.div.className);
    
    this.assertSame(this.div, Element.removeClass(this.div, 'boo'), "check if the method returns the element again");
    this.assertEqual('', this.div.className);
    
    this.assertNull(this.div['removeClass'], "should not get extended");
  },
  
  testToggleClass: function() {
    this.el.toggleClass('foo');
    this.assertHasClassName(this.el, 'foo');
    
    this.assertSame(this.el, this.el.toggleClass('foo'));
    this.assertHasNoClassName(this.el, 'foo');
  },
  
  testToggleClass_static: function() {
    Element.toggleClass(this.div, 'foo');
    this.assertHasClassName(this.div, 'foo');
    
    this.assertSame(this.div, Element.toggleClass(this.div, 'foo'));
    this.assertHasNoClassName(this.div, 'foo');
    
    this.assertNull(this.div['toggleClass'], "should not get extended");
  }
});
