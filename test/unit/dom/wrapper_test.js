/**
 * Testing basic dom-wrapper functionality in here
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var WrapperTest = TestCase.create({
  name: 'WrapperTest',

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
    var MyElement = new Class(Element, {
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
    var MyElement = new Class(Element, {
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
    var Textarea = new Class(Input, {
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

  testWithInjections: function() {
    var MyElement = new Class(Element, {
      include: [{boo: 'hoo'}],
      extend: {
        BOO: 'HOO'
      }
    });

    this.assertEqual('hoo', MyElement.prototype.boo);
    this.assertEqual('HOO', MyElement.BOO);
  },

  testWithPrebinds: function() {
    var MyElement = new Class(Element, {
      prebind: ['test1', 'test2'],

      test1: function() {
        this.name = 'test1';
      },

      test2: function() {
        this.name = 'test2';
      }
    });

    var el = new MyElement('div');
    var test1 = el.test1;
    var test2 = el.test2;

    test1();
    this.assertEqual('test1', el.name);

    test2();
    this.assertEqual('test2', el.name);
  },

  testCaching: function() {
    var element = new Element('div', {id: 'my-div'}).insertTo(document.body);

    this.assertSame($(element._), element);
    this.assertSame($('my-div'), element);

    var Div = new Class(Element, {});
    var div = new Div(element._).insertTo(document.body);

    this.assertSame($(div._),    div);
    this.assertSame($('my-div'), div);
  }
});