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

    this.assert(new Element('div') instanceof RightJS.Element);
    this.assert(new Element('div') instanceof RightJS.Wrapper);
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
    this.assert(form instanceof RightJS.Wrapper);

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
    this.assert(input instanceof RightJS.Wrapper);

    this.assert(input.observes('change'));
  },

  testPrivateWrapper: function() {
    var MyElement = new Wrapper(Element, {
      initialize: function(element, options) {
        this.$super(element, options);
        this.boo = 'hoo';
      }
    });

    var my_div = new MyElement('div', {id: 'my-div'});

    // testing the instance
    this.assert(my_div instanceof MyElement);
    this.assert(my_div instanceof Element);

    // testing the attributes
    this.assertEqual('DIV', my_div._.tagName);
    this.assertEqual('my-div', my_div._.id);
    this.assertEqual('hoo', my_div.boo);

    this.assertSame(my_div, $(my_div._), "Checking the caching is working");
  },

  testAnotherPrivateWrapper: function() {
    var MyElement = new Wrapper(Element, {
      initialize: function(element_id) {
        this.$super('div', {
          id: element_id,
          'class': 'boo'
        });

        this.addClass('hoo');
        this.onClick('doo');
      }
    });

    var my_div = new MyElement('my-div');

    this.assert(my_div instanceof MyElement);
    this.assert(my_div instanceof Element);

    this.assertEqual('DIV', my_div._.tagName);
    this.assertEqual('my-div', my_div._.id);
    this.assertEqual('boo hoo', my_div._.className);

    this.assert(my_div.observes('click', 'doo'));
  },

  testPrivateWrapperOverTypeCastedUnits: function() {
    var Textarea = new Wrapper(Input, {
      initialize: function(options) {
        this.$super(Object.merge(options, {
          type: 'textarea'
        }));

        this.addClass('my-area');
      }
    });

    var txt = new Textarea();

    this.assert(txt instanceof Textarea);
    this.assert(txt instanceof Input);
    this.assert(txt instanceof Element);

    this.assertEqual('TEXTAREA', txt._.tagName);
    this.assertEqual('my-area', txt._.className);

    this.assertSame(txt, $(txt._), "Checking the caching is working");

    this.assertFalse(new Element('textarea') instanceof Textarea,
      "private wrappers should not get involved in the typecasting");
  },

  testWrapperWithInjections: function() {
    var MyElement = new Wrapper(Element, {
      include: [{boo: 'hoo'}],
      extend: {
        BOO: 'HOO'
      }
    });

    this.assertEqual('hoo', MyElement.prototype.boo);
    this.assertEqual('HOO', MyElement.BOO);
  },

  testWrapperCaching: function() {
    var element = new Element('div', {id: 'my-div'}).insertTo(document.body);

    this.assertSame($(element._), element);
    this.assertSame($('my-div'), element);

    var Div = new Wrapper(Element, {});
    var div = new Div(element._).insertTo(document.body);

    this.assertSame($(div._),    div);
    this.assertSame($('my-div'), div);
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
      checked: true,
      value: 'on'
    })._;

    this.assertEqual('checkbox', box1.type);
    this.assertEqual('box1',     box1.name);
    this.assertEqual(true,       box1.checked);

    var box2 = new Element('input', {
      type: 'radio',
      name: 'box2',
      checked: true,
      value: 'on'
    })._;

    this.assertEqual('radio', box2.type);
    this.assertEqual('box2',  box2.name);
    this.assertEqual(true,    box2.checked);

    if (Browser.OLD) {
      this.assertEqual(
        '<INPUT type=checkbox CHECKED value=on name=box1>'+
        '<INPUT type=radio CHECKED value=on name=box2>',
        $E('div').insert([box1, box2])._.innerHTML.replace(/\s+_rjs_id="\d+"/mg, '')
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
