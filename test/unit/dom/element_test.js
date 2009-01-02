/**
 * The Element class unit-test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementTest = TestCase.create({
  name: 'ElementTest',
  
  testInstance: function() {
    this.assertInstanceOf(HTMLDivElement, new Element('div'));
    this.assertInstanceOf(HTMLTableElement, new Element('table'));
  },
  
  testInstanceWithClass: function() {
    this.assertEqual(new Element('div', {
      'class': 'foo bla'
    }).className, 'foo bla');
    
    this.assertEqual(new Element('div', {
      className: 'foo bla'
    }).className, 'foo bla');
  },
  
  testInstanceWithStyle: function() {
    var style = {
      fontSize:   '12px',
      fontWeight: 'bold',
      display:    'none'
    }
    this.assertStyle(new Element('div', {
      style: style
    }), style);
  },
  
  testInstanceWithAttributes: function() {
    var el = new Element('div', {
      id: 'el-id',
      name: 'el-name',
      title: 'el-title'
    });
    
    this.assertEqual('el-id', el.id);
    this.assertEqual('el-name', el.name);
    this.assertEqual('el-title', el.title);
  }
});