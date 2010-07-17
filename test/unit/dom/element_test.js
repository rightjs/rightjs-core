/**
 * The Element class unit-test
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var ElementTest = TestCase.create({
  name: 'ElementTest',
  
  testInstance: function() {
    this.assertEqual('DIV',   new Element('div')._.tagName);
    this.assertEqual('TABLE', new Element('table')._.tagName);
  },
  
  testInstanceCaching: function() {
    var div = document.createElement('div');
    var el1 = new Element(div);
    var el2 = new Element(div);
    
    this.assertNotSame(el1, el2);
    this.assertSame(el1._, el2._);
    this.assertInstanceOf(RightJS.Element, el1);
    this.assertInstanceOf(RightJS.Element, el2);
  },
  
  testInstanceFormTypeCasting: function() {
    var form = new Element('form', {
      on: {
        submit: function() {}
      }
    });
    
    this.assert(form instanceof RightJS.Form);
    this.assert(form instanceof RightJS.Element);
    this.assert(form.observes('submit'));
  },
  
  testInstanceFormElementTypeCasting: function() {
    var input = new Element('input', {
      on: {
        change: function() {}
      }
    });
    
    this.assert(input instanceof RightJS.Input);
    this.assert(input instanceof RightJS.Element);
    
    this.assert(input.observes('change'));
  },
  
  testInstanceWithClass: function() {
    this.assertEqual('foo bla', new Element('div', {
      'class': 'foo bla'
    })._.className);
    
    this.assertEqual('foo bla', new Element('div', {
      'class': 'foo bla'
    })._.className);
  },
  
  testInstanceWithStyle: function() {
    var style = {
      fontSize:   '12px',
      borderSize: '12px',
      display:    'none'
    }
    this.assertStyle(new Element('div', {
      style: style
    })._, style);
  },
  
  testInstanceWithAttributes: function() {
    var el = new Element('div', {
      id: 'el-id',
      title: 'el-title'
    })._;
    
    this.assertEqual('el-id', el.id);
    this.assertEqual('el-title', el.title);
  },
  
  testInstanceWithEvents: function() {
    var el = new Element('div', {
      on: {
        click: function() {}
      }
    });
    
    this.assert(el.observes('click'));
  },
  
  testInstanceWithHtml: function() {
    var el = new Element('div', {
      html: "inner html"
    })._;
    
    this.assertEqual('inner html', el.innerHTML);
  },
  
  testCheckboxConstruction: function() {
    var box1 = new Element('input', {
      type: 'checkbox',
      name: 'box1',
      checked: true
    })._;
    
    this.assertEqual('checkbox', box1.type);
    this.assertEqual('box1',     box1.name);
    this.assertEqual(true,       box1.checked);
    
    var box2 = new Element('input', {
      type: 'radio',
      name: 'box2',
      checked: true
    })._;
    
    this.assertEqual('radio', box2.type);
    this.assertEqual('box2',  box2.name);
    this.assertEqual(true,    box2.checked);
    
    if (Browser.OLD) {
      this.assertEqual(
        '<INPUT type=checkbox CHECKED value=on name=box1>'+
        '<INPUT type=radio CHECKED value=on name=box2>',
        $E('div').insert([box1, box2])._.innerHTML.replace(/\s+_rid[^=]+="\d+"/mg, '')
      );
    }
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
    
    this.assertSame(Element.prototype.___foo, foo);
    this.assertSame(Element.prototype.___bar, bar);
    
    // checking that the extensions a re working
    var div = new Element('div');
    
    this.assertSame(div, div.___foo('some-title'));
    
    this.assertEqual('some-title', div.title);
    this.assertEqual('some-title-id', div.id);
    
    // checking the subclasses extensions
    var input = new Input();
    
    this.assert(input.___foo instanceof Function);
    this.assert(input.___bar instanceof Function);
    
    this.assertSame(input, input.___foo('some-title'));
    this.assertEqual('some-title', input.title);
    this.assertEqual('some-title-id', input.id);
  }
});