/**
 * The Xhr.IFramed unit tests
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var XhrIFramedTest = TestCase.create({
  name: 'XhrIFramedTest',
  
  setUp: function() {
    this.form = new Form().insertTo(document.body);
  },
  
  tearDown: function() {
    this.form.remove();
  },
  
  testInstance: function() {
    var form = this.form;
    var ixhr = new Xhr.IFramed(form);
    var iframe = $(ixhr.id);
    
    this.assertSame(form, ixhr.form);
    this.assertEqual('IFRAME', iframe._.tagName);
    
    this.assertEqual('about:blank',  iframe.get('src'));
    this.assertEqual('0', iframe.get('width'));
    this.assertEqual('0', iframe.get('height'));
    // FIXME IE6 doesn't get it
    //this.assertEqual('0', ixhr.iframe.get('frameborder'));
    
    //this.assert(ixhr.iframe.onload);
    
    this.assertTypeOf('function', ixhr.send);
    this.assertTypeOf('function', ixhr.open);
    this.assertTypeOf('function', ixhr.abort);
    this.assertTypeOf('function', ixhr.setRequestHeader);
  },
  
  testOnLoad: function() {
    var form = this.form;
    var ixhr = new Xhr.IFramed(form);
    
    var onready_called = false;
    ixhr.onreadystatechange = function() { onready_called = true; };
    
    ixhr.onLoad();
    
    this.assert(onready_called);
    this.assertEqual(4,   ixhr.readyState);
    this.assertEqual(200, ixhr.status);
  },
  
  testXhrFormHookForSimpleForm: function() {
    var xhr = new Xhr('/boo');
    
    xhr.form = this.form;
    
    this.assert(xhr.createXhr().constructor !== Xhr.IFramed);
  },
  
  testXhrFormHookForFormWithFiles: function() {
    var xhr = new Xhr('/boo');
    
    xhr.form = this.form.insert('<input type="file" name="boo" />');
    
    this.assert(xhr.createXhr().constructor === Xhr.IFramed);
  }
});