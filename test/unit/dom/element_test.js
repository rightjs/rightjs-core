/**
 * The Element class unit-test
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var ElementTest = TestCase.create({
  name: 'ElementTest',
  
  testInstance: function() {
    this.assertEqual('DIV',   new Element('div').tagName);
    this.assertEqual('TABLE', new Element('table').tagName);
  },
  
  testInstanceWithClass: function() {
    this.assertEqual('foo bla', new Element('div', {
      'class': 'foo bla'
    }).className);
    
    this.assertEqual('foo bla', new Element('div', {
      'class': 'foo bla'
    }).className);
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
      title: 'el-title'
    });
    
    this.assertEqual('el-id', el.id);
    this.assertEqual('el-title', el.title);
  },
  
  testInstanceWithEvents: function() {
    var el = new Element('div', {
      observe: {
        click: function() {}
      }
    });
    
    this.assert(el.observes('click'));
  },
  
  testInstanceWithHtml: function() {
    var el = new Element('div', {
      html: "inner html"
    });
    
    this.assertEqual('inner html', el.innerHTML);
  },
  
  testInclude: function() {
    var foo = function(title) {
      this.title = title;
      this.id    = this.___bar();
      return this;
    };
    var bar = function() { return this.title + '-id' };
    
    this.assertSame(Element, Element.include({
      ___foo: foo,
      ___bar: bar
    }));
    
    this.assertSame(Element.Methods.___foo, foo);
    this.assertSame(Element.Methods.___bar, bar);
    
    var div = new Element('div');
    
    this.assertSame(div, div.___foo('some-title'));
    
    this.assertEqual('some-title', div.title);
    this.assertEqual('some-title-id', div.id);
  }
});