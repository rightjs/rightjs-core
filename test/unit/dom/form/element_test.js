/**
 * The Form.Element unit tests
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var FormElementTest = TestCase.create({
  name: 'FormElementTest',
  
  testGetValue: function() {
    var inputs = [], value = 'the element value';
    $w('text password hidden checkbox radio submit button').each(function(type) {
      inputs.push(new Element('input', { type:  type, value: value }));
    });
    inputs.push(new Element('textarea', {value: value}));
    inputs.push(new Element('select').insert(new Element('option', {selected: true, value: value})));
    
    inputs.each(function(input) {
      this.assertEqual(value, input.getValue(), 'Checking '+input.tagName);
    }, this);
  },
  
  testGetValueFromMultiSelect: function() {
    if (navigator.userAgent.indexOf('MSIE 6') != -1) return;
    
    var select  = new Element('select', {multiple: true});
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
      inputs.push(new Element('input', { type:  type}));
    });
    inputs.push(new Element('textarea'));
    inputs.push(new Element('select').insert(new Element('option', {selected: true, value: 'value'})));
    
    inputs.each(function(input) {
      this.assertSame(input, input.setValue('value'));
      this.assertEqual('value', input.getValue(), 'Checking '+input.tagName);
    }, this);
  },
  
  testSetValueForMultiSelect: function() {
    if (navigator.userAgent.indexOf('MSIE 6') != -1) return;
    
    var select  = new Element('select', {multiple: true});
    var option1 = new Element('option', {value: 1});
    var option2 = new Element('option', {value: 2});
    var option3 = new Element('option', {value: 3});
    select.insert([option1, option2, option3]);
    
    this.assertEqual([], select.getValue());
    
    this.assertSame(select, select.setValue(['1', 2]));
    this.assertEqual(['1','2'], select.getValue());
  },
  
  testDisable: function() {
    var input = new Element('input');
    
    this.assert(input.onDisable);
    
    var on_disable_called = false;
    input.onDisable(function() { on_disable_called = true; });
    
    this.assertSame(input, input.disable());
    
    this.assert(input._.disabled);
    this.assert(on_disable_called);
  },
  
  testEnable: function() {
    var input = new Element('input', {disabled: true});
    
    this.assert(input.onEnable);
    
    var on_enable_called = false;
    input.onEnable(function() { on_enable_called = true; });
    
    this.assertSame(input, input.enable());
    
    this.assertFalse(input._.disabled);
    this.assert(on_enable_called);
  },
  
  testFocus: function() {
    var input = new Element('input').insertTo(document.body);
    
    this.assert(input.onFocus);
    
    var on_focus_called = false;
    input.onFocus(function() { on_focus_called = true; });
    
    this.assertSame(input, input.focus());
    
    this.assert(input.focused);
    this.assert(on_focus_called);
    
    input.remove();
  },
/*  
  testSelect: function() {
    var input = new Element('input').insertTo(document.body);
    
    var on_focus_called = false;
    input.onFocus(function() { on_focus_called = true; });
    
    this.assertSame(input, input.select());
    
    this.assert(input.focused);
    this.assert(on_focus_called);
    
    input.remove();
  },*/
  
  testBlur: function() {
    var input = new Element('input').insertTo(document.body);
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
    var input = new Element('input');
    var f = function() {};
    input.onChange(f);
    
    this.assert(input.observes('change', f));
  }
});