/**
 * XMLHttpRequest wrapper
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Xhr = RightJS.Xhr = new Class(Observer, {
  extend: {
    // supported events list
    EVENTS: $w('success failure complete request cancel create'),
    
    // default options
    Options: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript,text/html,application/xml,text/xml,*/*'
      },
      method:       'post',
      encoding:     'utf-8',
      async:        true,
      evalScripts:  false,
      evalResponse: false,
      evalJS:       true,
      evalJSON:     true,
      secureJSON:   true,
      urlEncoded:   true,
      spinner:      null,
      spinnerFx:    'fade',
      params:       null,
      iframed:      false,
      jsonp:        false
    },
    
    /**
     * Shortcut to initiate and send an XHR in a single call
     *
     * @param String url
     * @param Object options
     * @return Xhr request
     */
    load: function(url, options) {
      return new this(url, Object.merge({method: 'get'}, options)).send();
    }
  },
  
  /**
   * basic constructor
   *
   * @param String url
   * @param Object options
   */
  initialize: function(url, options) {
    this.initCallbacks(); // system level callbacks should be initialized before the user callbacks
    
    this.url = url;

    // copying some options to the instance level attributes
    $ext(this.$super(options), this.options);
    
    // removing the local spinner if it's the same as the global one
    if (Xhr.Options.spinner && $(this.spinner) === $(Xhr.Options.spinner))
      this.spinner = null;
  },
  
  /**
   * sets a header 
   *
   * @param name String header name
   * @param value String header value
   * @return Xhr self
   */
  setHeader: function(name, value) {
    this.headers[name] = value;
    return this;
  },
  
  /**
   * tries to get a response header
   *
   * @return mixed String header value or undefined
   */
  getHeader: function(name) {
    try {
      var value = this.xhr.getResponseHeader(name);
    } catch(e) {}
    
    return value;
  },
  
  /**
   * checks if the request was successful
   *
   * @return boolean check result
   */
  successful: function() {
    return (this.status >= 200) && (this.status < 300);
  },
  
  /**
   * performs the actual request sending
   *
   * @param Object options
   * @return Xhr self
   */
  send: function(params) {
    var add_params = {}, url = this.url, method = this.method.toLowerCase(), headers = this.headers, key, xhr;
    
    if (method == 'put' || method == 'delete') {
      url += (url.includes('?') ? '&' : '?') + '_method='+ method;
      method = 'post';
    }
    
    var data = this.prepareData(this.params, this.prepareParams(params), add_params);
    
    if (this.urlEncoded && method == 'post' && !headers['Content-type']) {
      this.setHeader('Content-type', 'application/x-www-form-urlencoded;charset='+this.encoding);
    }
    
    if (method == 'get') {
      if (data) url += (url.includes('?') ? '&' : '?') + data;
      data = null;
    }
    
    xhr = this.xhr = this.createXhr();
    this.fire('create');
    
    xhr.open(method, url, this.async);
    
    xhr.onreadystatechange = this.stateChanged.bind(this);
    
    for (key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    
    xhr.send(data);
    this.fire('request');
    
    if (!this.async) this.stateChanged();
    
    return this;
  },
  
  /**
   * elements automaticall update method, creates an Xhr request 
   * and updates the element innerHTML value onSuccess.
   * 
   * @param Element element
   * @param Object optional request params
   * @return Xhr self
   */
  update: function(element, params) {
    return this.onSuccess(function(r) { element.update(r.text); }).send(params);
  },
  
  /**
   * stops the request processing
   *
   * @return Xhr self
   */
  cancel: function() {
    var xhr = this.xhr;
    
    if (!xhr || xhr.canceled) return this;
    
    xhr.abort();
    xhr.onreadystatechange = function() {};
    xhr.canceled = true;
    
    return this.fire('cancel');
  },
  
// protected
  // wrapping the original method to send references to the xhr objects
  fire: function(name) {
    return this.$super(name, this, this.xhr);
  },
  
  // creates new request instance
  createXhr: function() {
    if (this.jsonp) {
      return new Xhr.JSONP(this);
    } else if (this.form && this.form.first('input[type=file]')) {
      return new Xhr.IFramed(this.form);
    } else try {
      return new XMLHttpRequest();
    } catch(e) {
      return new ActiveXObject('MSXML2.XMLHTTP');
    }
  },
  
  // prepares user sending params
  prepareParams: function(params) {
    if (params && params.tagName == 'FORM') {
      this.form = params;
      params = params.values();
    }
    return params;
  },
  
  // converts all the params into a url params string
  prepareData: function() {
    return $A(arguments).map(function(param) {
      if (!isString(param)) {
        param = Object.toQueryString(param);
      }
      return param.blank() ? null : param;
    }).compact().join('&');
  },

  // handles the state change
  stateChanged: function() {
    var xhr = this.xhr;
    
    if (xhr.readyState != 4 || xhr.canceled) return;
    
    try { this.status = xhr.status;
    } catch(e) { this.status = 0; }
    
    this.text = this.responseText = xhr.responseText;
    this.xml  = this.responseXML  = xhr.responseXML;
    
    this.fire('complete').fire(this.successful() ? 'success' : 'failure');
  },
  
  // called on success
  tryScripts: function(response) {
    var content_type = this.getHeader('Content-type');
    
    if (this.evalResponse || (this.evalJS && /(ecma|java)script/i.test(content_type))) {
      $eval(this.text);
    } else if (/json/.test(content_type) && this.evalJSON) {
      this.json = this.responseJSON = this.sanitizedJSON();
    } else if (this.evalScripts) {
      this.text.evalScripts();
    }
  },
  
  // sanitizes the json-response texts
  sanitizedJSON: function() {
    try {
      return JSON.parse(this.text);
    } catch(e) {
      // manual json consistancy check
      if (window.JSON || !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(this.text.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
        if (this.secureJSON) {
          throw "JSON parse error: "+this.text;
        } else {
          return null;
        }
      }
    }
    
    // the fallback JSON extraction
    return eval("("+this.text+")");
  },
  
  // initializes the request callbacks
  initCallbacks: function() {
    // connecting basic callbacks
    this.on({
      success:  'tryScripts',
      create:   'showSpinner',
      complete: 'hideSpinner',
      cancel:   'hideSpinner'
    });
    
    // wiring the global xhr callbacks
    Xhr.EVENTS.each(function(name) {
      this.on(name, function() { Xhr.fire(name, this, this.xhr); });
    }, this);
  },
  
  showSpinner: function() { Xhr.showSpinner.call(this, this); },
  hideSpinner: function() { Xhr.hideSpinner.call(this, this); }
});

// attaching the common spinner handling
$ext(Observer.create(Xhr), {
  counter: 0,
  
  // shows the spinner
  showSpinner: function(context) {
    Xhr.trySpinner(context, 'show');
  },
  
  // hides the spinner
  hideSpinner: function(context) {
    Xhr.trySpinner(context, 'hide');
  },
  
  trySpinner: function(context, method) {
    var object = context || Xhr.Options, spinner = $(object.spinner);
    if (spinner) spinner[method](object.spinnerFx, {duration: 100});
  },
  
  // counts a request in
  countIn: function() {
    Xhr.counter ++;
    Xhr.showSpinner();
  },
  
  // counts a request out
  countOut: function() {
    Xhr.counter --;
    if (Xhr.counter < 1) Xhr.hideSpinner();
  }
}).on({
  create:   'countIn',
  complete: 'countOut',
  cancel:   'countOut'
});
