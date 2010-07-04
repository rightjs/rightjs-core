/**
 * The JSONP Xhr request tonnel
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Xhr.JSONP = new Class({
  include: Xhr.Dummy,
  
  prefix: 'jsonp',
  
  /**
   * Constructor
   *
   * @param Xhr the actual xhr request object
   * @return void
   */
  initialize: function(xhr) {
    this.xhr   = xhr;
    this.name  = this.prefix + new Date().getTime();
    this.param = (isString(xhr.jsonp) ?
      xhr.jsonp : 'callback') + "=" + this.name;
      
    this.script = $E('script', {
      type:    'text/javascript',
      charset: xhr.encoding,
      async:   xhr.async
    });
  },
  
  /**
   * saving the url and method for the further use
   *
   * @param method String request method
   * @param address String request url address
   * @param Boolean async request marker
   * @return void
   */ 
  open: function(method, url, async) {
    this.url    = url;
    this.method = method;
  },
  
  /**
   * Sends the actual request by inserting the script into the document body
   *
   * @param String data
   * @return void
   */
  send: function(data) {
    window[this.name] = this.finish.bind(this);
    
    this.script.set('src', this.url + (this.url.include('?') ? '&' : '?') + this.param + "&" + data)
      .insertTo($('script').last(), 'after');
  },
  
  /**
   * Receives the actual JSON data from the server
   *
   * @param Object JSON data
   * @return void
   */
  finish: function(data) {
    this.status       = 200;
    this.readyState   = 4;
    
    this.xhr.json = this.xhr.responseJSON = data;
    
    this.onreadystatechange();
  }
});