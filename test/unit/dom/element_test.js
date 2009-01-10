/**
 * The Element class unit-test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementTest = TestCase.create({
  name: 'ElementTest',
  
  testInstance: function() {
    this.assertEqual('DIV',   new Element('div').tagName);
    this.assertEqual('TABLE', new Element('table').tagName);
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
      borderSize: '12px',
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