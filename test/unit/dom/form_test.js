/**
 * The Form unit tests
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var FormTest = TestCase.create({
  name: 'FormTest',
  
  testInstance: function() {
    var form = new Form({
      id: 'my-form'
    });
    
    this.assertEqual('FORM', form.tagName);
    this.assertEqual('my-form', form.id);
  },
  
  setForm: function() {
    return new Form({
      'html': ""+
        "<fieldset>"+
          "<p>"+
            "<label>Name</label>"+
            "<input type='text' name='name' value='Bob'/>"+
          "</p>"+
          "<p>"+
            "<label>Password</label>"+
            "<input type='password' name='password' value='secret'/>"+
          "</p>"+
          "<p>"+
            "<label>Keep me</label>"+
            "<input type='checkbox' name='keep_me' value='1'/>"+
          "</p>"+
          "<p>"+
            "<label>Text:</label>"+
            "<textarea name='text'>Boo boo boo</textarea>"+
          "</p>"+
          "<p>"+
            "<label>Kinda:</label>"+
            "<select name='kinda'>"+
              "<option value='0'>Zero</option>"+
              "<option value='1' selected='true'>Alpha</option>"+
              "<option value='2'>Bravo</option>"+
            "</select>"+
          "</p>"+
          "<p>"+
            "<label>Items:</label>"+
            "<select name='items' multiple='true'>"+
              "<option value='1'>First</option>"+
              "<option value='2' selected='true'>Second</option>"+
              "<option value='3' selected='true'>Third</option>"+
            "</select>"+
          "</p>"+
          "<p>"+
            "<label>Who:</label>"+
            "<input type='radio' name='who' value='bob' id='who-bob'/>"+
            "<input type='radio' name='who' value='nik' id='who-nik'/>"+
          "</p>"+
          "<p>"+
            "<input type='submit' value='Sumbit'/>"+
            "<input type='reset' value='Reset'/>"+
            "<input type='button' value='Cancel'/>"+
          "</p>"+
        "</fieldset>"+
      ""
    });
  },
  
  testGetElements: function() {
    var form = this.setForm();
    
    this.assertEqual(11, form.getElements().length);
    
    form.getElements().each(function(element) {
      this.assert(element['getValue']);
    }, this);
  },
  
  testInputs: function() {
    var form = this.setForm();
    
    this.assertEqual(8, form.inputs().length);
  },
  
  testFocus: function() {
    var form = this.setForm();
    
    this.assertSame(form, form.focus());
    
    if (Browser.Konqueror) return;
    this.assert(form.name.focused);
  },
  
  testBlur: function() {
    var form = this.setForm();
    form.focus();
    
    this.assertSame(form, form.blur());
    
    form.getElements().each(function(element) {
      this.assertFalse(element.focused);
    }, this);
  },
  
  testDisable: function() {
    var form = this.setForm();
    
    this.assertSame(form, form.disable());
    
    form.inputs().each(function(element) {
      this.assert(element.disabled);
    }, this);
  },
  
  testEnable: function() {
    var form = this.setForm().disable();
    
    this.assertSame(form, form.enable());
    
    form.getElements().each(function(element) {
      this.assertFalse(element.disabled);
    }, this);
  },
  
  testValues: function() {
    if (Browser.Konqueror) return;
    var form = this.setForm();
    var result = document.querySelector ? {
      name: 'Bob',
      password: 'secret',
      text:     'Boo boo boo',
      kinda:    '1',
      items:    ['2', '3']
    } : {
      name: 'Bob',
      password: 'secret',
      kinda:    '1',
      items:    ['2', '3'],
      text:     'Boo boo boo'
    };
    
    this.assertEqual(result, form.values());
    
    form.keep_me.checked = true;
    form.first('#who-bob').checked = true;
    
    var result = document.querySelector ? {
      name:     'Bob',
      password: 'secret',
      keep_me:  '1',
      text:     'Boo boo boo',
      kinda:    '1',
      items:    ['2', '3'],
      who:      'bob'
    } :{
      name:     'Bob',
      password: 'secret',
      keep_me:  '1',
      who:      'bob',
      kinda:    '1',
      items:    ['2', '3'],
      text:     'Boo boo boo'
    };
    
    this.assertEqual(result, form.values());
  },
  
  testSerialize: function() {
    if (Browser.Konqueror) return;
    var form = this.setForm();
    var result = document.querySelector ? 
      'name=Bob&password=secret&text=Boo%20boo%20boo&kinda=1&items=2&items=3' :
      'name=Bob&password=secret&kinda=1&items=2&items=3&text=Boo%20boo%20boo';
      
    this.assertEqual(result, form.serialize());
  },
  
  testSerializeWithArrays: function() {
    var form = new Form({
      'html': '' +
        '<input type="hidden" name="test[]" value="1" />'+
        '<input type="hidden" name="test[]" value="2" />'+
        '<input type="hidden" name="test[]" value="3" />'
    });
    
    this.assertEqual({'test[]': ['1', '2', '3']}, form.values());
  }
});

