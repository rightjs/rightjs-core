/**
 * The Xhr.IFramed unit tests
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var XhrIFramedTest = TestCase.create({
  name: 'XhrIFramedTest',
  
  testInstance: function() {
    var form = new Form();
    var ixhr = new Xhr.IFramed(form);
    
    this.assertSame(form, ixhr.form);
    this.assertEqual('IFRAME', ixhr.iframe.tagName);
    
    this.assertEqual('',  ixhr.iframe.getAttribute('src'));
    this.assertEqual('0', ixhr.iframe.get('width'));
    this.assertEqual('0', ixhr.iframe.get('height'));
    // FIXME IE6 doesn't get it
    //this.assertEqual('0', ixhr.iframe.get('frameborder'));
    
    this.assert(ixhr.iframe.onload);
    
    this.assertTypeOf('function', ixhr.send);
    this.assertTypeOf('function', ixhr.open);
    this.assertTypeOf('function', ixhr.abort);
    this.assertTypeOf('function', ixhr.setRequestHeader);
  },
  
  testOnLoad: function() {
    var form = new Form();
    var ixhr = new Xhr.IFramed(form);
    
    var onready_called = false;
    ixhr.onreadystatechange = function() { onready_called = true; };
    
    ixhr.onLoad();
    
    this.assert(onready_called);
    this.assertEqual(4,   ixhr.readyState);
    this.assertEqual(200, ixhr.status);
  }
});