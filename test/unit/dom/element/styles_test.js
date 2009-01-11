/**
 * The Element class styles related module functionality test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
document.write('<st'+'yle>div.test---1234{font-size: 14px; display:none;}</st'+'yle>');
var ElementStylesTest = TestCase.create({
  name: 'ElementStylesTest',
  
  testSetStyleAsHash: function() {
    var style = {
      fontSize: '14px',
      borderSize: '2px',
      display: 'block'
    }
    
    var el = new Element('div');
    this.assertSame(el, el.setStyle(style));
    this.assertStyle(el, style);
  },
  
  testSetStyleAsHashWithDashedKeys: function() {
    var el = new Element('div').setStyle({
      'font-size': '14px',
      'border-size': '2px'
    });
    
    this.assertStyle(el, {
      fontSize: '14px',
      borderSize: '2px'
    })
  },
  
  testSetStyleWithKeyValue: function() {
    var el = new Element('div').setStyle('font-size', '14px');
    
    this.assertStyle(el, {fontSize: '14px'});
  },
  
  testGetStyleWithElementLevelStyles: function() {
    var el = new Element('div', {
      style: {
        'font-size': '12px',
        'border-size': '2px'
      }
    });
    
    this.assertEqual('12px', el.getStyle('font-size'));
    this.assertEqual('2px', el.getStyle('borderSize'));
    
    this.assertEqual('12px', el.getOwnStyle('font-size'));
    this.assertEqual('2px', el.getOwnStyle('borderSize'));
  },
  
  testGetStyleWithCSSLevelStyles: function() {
    var el = new Element('div', {'class': 'test---1234'});
    document.body.appendChild(el);
    
    this.assertEqual('14px', el.getStyle('font-size'));
    this.assertEqual('none', el.getStyle('display'));
    
    this.assertEqual('14px', el.getViewStyle('fontSize'));
    this.assertEqual('none', el.getViewStyle('display'));
    
    this.assertNull(el.getOwnStyle('font-size'));
    this.assertNull(el.getOwnStyle('display'));
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
