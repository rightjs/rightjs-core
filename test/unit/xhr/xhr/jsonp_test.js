/**
 * The Xhr.JSONP interface test
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var XhrJSONPTest = TestCase.create({
  name: 'XhrJSONPTest',
  
  testInitialize: function() {
    var xhr = new Xhr.JSONP({
      encoding: 'utf-8',
      jsonp:    true,
      async:    true
    });
    
    this.assert(xhr.script);
    this.assertEqual('SCRIPT', xhr.script.tagName);
    this.assertEqual('text/javascript', xhr.script.type);
    this.assertEqual('utf-8', xhr.script.charset);
    this.assert(xhr.script.async);
    
    this.assert(xhr.name.startsWith(xhr.prefix));
    this.assert(xhr.name != xhr.prefix);
    
    this.assertEqual('callback='+xhr.name, xhr.param);
  },
  
  testInitializeWithOptions: function() {
    var xhr = new Xhr.JSONP({
      encoding: 'cp1251',
      jsonp:    'some_name',
      async:    false
    });
    
    this.assertEqual('cp1251', xhr.script.charset);
    this.assertFalse(xhr.script.async);
    this.assertEqual('some_name='+xhr.name, xhr.param);
  },
  
  testSend: function() {
    var options = {
      jsonp: true,
      async: true
    };
    
    var url = document.location.href.replace(/\/[^\/]+$/, '') + "/some.url";
    
    var xhr = new Xhr.JSONP(options);
    xhr.open('get', url, true);
    xhr.send('some=data');
    
    this.assertEqual(
      url + "?" + xhr.param +"&some=data",
      xhr.script.src
    );
    
    // checking the global callback presence
    this.assert(typeof(window[xhr.name]) == 'function');
  },
  
  testFinish: function() {
    var options = {
      jsonp: true,
      async: true
    };
    
    var xhr = new Xhr.JSONP(options);
    xhr.open('get', './some.url', true);
    xhr.send('some=data');
    xhr.onreadystatechange = function() {
      options.called_back = true;
    };
    
    // emulating the callback
    window[xhr.name]({some: 'data'});
    
    // checking the xhr data receiving
    this.assertEqual({some: 'data'}, options.json);
    this.assertSame(options.json, options.responseJSON);
    
    this.assertEqual(200, xhr.status);
    this.assertEqual(4,   xhr.readyState);
    
    this.assert(options.called_back);
  }
  
});