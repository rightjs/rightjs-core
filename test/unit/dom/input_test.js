/**
 * The Input unit tests
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var InputTest = TestCase.create({
  name: 'InputTest',

  afterAll: function() {
    window.scrollTo(0,0);
  },

  testInstanceWithTag: function() {
    var input  = new Input('input');
    var button = new Input('button');
    var textar = new Input('textarea');
    var select = new Input('select');

    this.assert(input  instanceof Input);
    this.assert(button instanceof Input);
    this.assert(textar instanceof Input);
    this.assert(select instanceof Input);

    this.assertEqual('INPUT',    input._.tagName);
    this.assertEqual('BUTTON',   button._.tagName);
    this.assertEqual('TEXTAREA', textar._.tagName);
    this.assertEqual('SELECT',   select._.tagName);
  },

  testInstanceWithoutTag: function() {
    var input  = new Input();
    var chck   = new Input({type: 'checkbox'});
    var radio  = new Input({type: 'radio'});
    var hidd   = new Input({type: 'hidden'});
    var butt   = new Input({type: 'button'});
    var texta  = new Input({type: 'textarea'});
    var select = new Input({type: 'select'});

    this.assertEqual('INPUT',    input._.tagName);
    this.assertEqual('TEXTAREA', texta._.tagName);
    this.assertEqual('SELECT',   select._.tagName);

    this.assertEqual('checkbox', chck._.type);
    this.assertEqual('radio',    radio._.type);
    this.assertEqual('hidden',   hidd._.type);
    this.assertEqual('button',   butt._.type);
  },

  testGetValue: function() {
    var inputs = [], value = 'the element value';
    $w('text password hidden checkbox radio submit button').each(function(type) {
      inputs.push(new Input({ type:  type, value: value }));
    });
    inputs.push(new Input('textarea', {value: value}));
    inputs.push(new Input('select').insert(new Element('option', {selected: true, value: value})));

    inputs.each(function(input) {
      this.assertEqual(value, input.getValue(), 'Checking '+input.tagName);
    }, this);
  },

  testGetValueFromMultiSelect: function() {
    if (navigator.userAgent.indexOf('MSIE 6') != -1) return;

    var select  = new Input('select', {multiple: true});
    var option1 = new Element('option', {value: 1});
    var option2 = new Element('option', {value: 2});
    var option3 = new Element('option', {value: 3});
    select.insert([option1, option2, option3]);

    this.assertEqual([], select.getValue());

    option1._.selected = true;
    option3._.selected = true;

    this.assertEqual(['1','3'], select.getValue());
  },

  testSetValue: function() {
    var inputs = [];
    $w('text password hidden checkbox radio submit button').each(function(type) {
      inputs.push(new Input({ type:  type}));
    });
    inputs.push(new Input('textarea'));
    inputs.push(new Input('select').insert(new Input('option', {selected: true, value: 'value'})));

    inputs.each(function(input) {
      this.assertSame(input, input.setValue('value'));
      this.assertEqual('value', input.getValue(), 'Checking '+input.tagName);
    }, this);
  },

  testSetValueForMultiSelect: function() {
    if (navigator.userAgent.indexOf('MSIE 6') != -1) return;

    var select  = new Input('select', {multiple: true});
    var option1 = new Element('option', {value: 1});
    var option2 = new Element('option', {value: 2});
    var option3 = new Element('option', {value: 3});
    select.insert([option1, option2, option3]);

    this.assertEqual([], select.getValue());

    this.assertSame(select, select.setValue(['1', 2]));
    this.assertEqual(['1','2'], select.getValue());
  },

  testSetValueForEmptyValue: function() {
    // testing FF bug #406

    var select = new Element('div').html(
      '<select>'+
        '<option value=""></option>' +
        '<option value="1" selected="true">1</option>' +
      '</select>'
    ).first('select');

    select.setValue('');
    this.assertEqual('', select.value());
  },

  testDisable: function() {
    var input = new Input();

    this.assert(input.onDisable);

    var on_disable_called = false;
    input.onDisable(function() { on_disable_called = true; });

    this.assertSame(input, input.disable());

    this.assert(input._.disabled);
    this.assert(on_disable_called);
  },

  testEnable: function() {
    var input = new Input({disabled: true});

    this.assert(input.onEnable);

    var on_enable_called = false;
    input.onEnable(function() { on_enable_called = true; });

    this.assertSame(input, input.enable());

    this.assertFalse(input._.disabled);
    this.assert(on_enable_called);
  },

  testFocus: function() {
    var input = new Input().insertTo(document.body);

    this.assert(input.onFocus);

    var on_focus_called = false;
    input.onFocus(function() { on_focus_called = true; });

    this.assertSame(input, input.focus());

    this.assert(input.focused);
    this.assert(on_focus_called);

    input.remove();
  },

  testSelect: function() {
    var input = new Input().insertTo(document.body);

    var on_focus_called = false;
    input.onFocus(function() { on_focus_called = true; });

    this.assertSame(input, input.select());

    this.assert(input.focused);
    this.assert(on_focus_called);

    input.remove();
  },

  testBlur: function() {
    var input = new Input().insertTo(document.body);
    input.focus();

    this.assert(input.onBlur);

    var on_blur_called = false;
    input.onBlur(function() { on_blur_called = true; });

    this.assertSame(input, input.blur());

    this.assertFalse(input.focused);
    this.assert(on_blur_called);

    input.remove();
  },

  testOnChangeShortcut: function() {
    var input = new Input();
    var f = function() {};
    input.onChange(f);

    this.assert(input.observes('change', f));
  },

  testFormReference: function() {
    var form  = new Form();
    var input = new Input().insertTo(form);

    this.assertSame(form, input.form());
  },

  testDisabled: function() {
    var input = new Input();

    this.assertFalse(input.disabled());
    this.assertSame(input, input.disabled(true));
    this.assert(input.disabled());
    this.assert(input._.disabled);
    this.assertSame(input, input.disabled(false));
    this.assertFalse(input.disabled());
    this.assertFalse(input._.disabled);
  },

  testChecked: function() {
    var input = new Input({type: 'checkbox'});
    input._.checked = false;

    this.assertFalse(input.checked());
    this.assertSame(input, input.checked(true));
    this.assert(input.checked());
    this.assert(input._.checked);
    this.assertSame(input, input.checked(false));
    this.assertFalse(input.checked());
    this.assertFalse(input._.checked);
  },

  testButton: function() {
    var button = new Element('button', {type: 'submit'});

    this.assert(button instanceof Input);
    this.assertEqual('BUTTON', button._.tagName);
    this.assertEqual('submit', button._.type);
  }
});
