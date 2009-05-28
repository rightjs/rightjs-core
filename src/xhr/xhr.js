/**
 * XMLHttpRequest wrapper
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Xhr = new Class(Observer, {
  extend: {
    // supported events list
    EVENTS: $w('success failure complete request cancel create'),
    
    // default options
    OPTIONS: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      },
      method:       'post',
      encoding:     'utf-8',
      async:        true,
      evalScripts:  false,
      evalResponse: false,
      evalJSON:     true,
      urlEncoded:   true,
      spinner:      null,
      params:       null
    },
    
    /**
     * Shortcut to initiate and send an XHR in a single call
     *
     * @param String url
     * @param Object options
     * @return Xhr request
     */
    load: function(url, options) {
      return new this(url, options).send();
    }
  },
  
  /**
   * basic constructor
   *
   * @param String url
   * @param Object options
   */
  initialize: function(url, options) {
    // initializing observers
    this.$super({
      wrap:   (function(name, callback) {
        return (function() {
          return callback(this, this.xhr);
        }).bind(this);
      }).bind(this)
    });
    
    var options = Object.merge(Xhr.OPTIONS, options);
    
    this.url = url;
    this.initCallbacks(options);
    
    for (var key in Xhr.OPTIONS)
      this[key] = options[key];
  },
  
  /**
   * sets a header 
   *
   * @param String header name
   * @param String header value
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
      return this.xhr.getResponseHeader(name);
    } catch(e) {}
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
    var add_params = {}, url = this.url.split('?'), url_params = url.length > 1 ? url[1] : '',
      url = url[0], params = this.prepareParams(params);
    
    var method = this.method.toUpperCase();
    if (['PUT', 'DELETE'].includes(method)) {
      add_params['_method'] = method.toLowerCase();
      method = 'POST';
    }
    
    if (this.urlEncoded && method == 'POST') {
      this.setHeader('Content-type', 'application/x-www-form-urlencoded; charset='+this.encoding);
    }
    
    this.xhr = this.createXhr(params);
    this.fire('create');
    
    this.xhr.open(method, url, this.async);
    
    this.xhr.onreadystatechange = this.stateChanged.bind(this);
    
    for (var key in this.headers) {
      this.xhr.setRequestHeader(key, this.headers[key]);
    }
    
    this.xhr.send(this.prepareData(this.params, url_params, params, add_params));
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
    if (!this.xhr || this.xhr.canceled) return this;
    
    this.xhr.abort();
    this.xhr.onreadystatechange = function() {};
    this.xhr.canceled = true;
    
    return this.fire('cancel');
  },
  
// protected
  // creates new request instance
  createXhr: function(params) {
    if (this.form && this.form.getElements().map('type').includes('file')) {
      return Xhr.IFramed(this.form);
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
    params = [];
    $A(arguments).each(function(param) {
      if (!isString(param)) {
        param = Object.toQueryString(param);
      }
      if (!param.blank()) {
        params.push(param);
      }
    });
    return params.join('&');
  },

  // handles the state change
  stateChanged: function() {
    if (this.xhr.readyState != 4 || this.xhr.canceled) return;
    
    try { this.status = this.xhr.status;
    } catch(e) { this.status = 0; }
    
    this.text = this.responseText = this.xhr.responseText;
    this.xml  = this.responseXML  = this.xhr.responseXML;
    
    this.fire('complete');
    this.fire(this.successful() ? 'success' : 'failure');
  },
  
  // called on success
  tryScripts: function(response) {
    if (this.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) {
      $eval(this.text);
    } else if ((/json/).test(this.getHeader('Content-type')) && this.evalJSON) {
      eval("this.json = this.responseJSON = "+this.text);
    } else if (this.evalScripts) {
      this.text.evalScripts();
    }
  },
  
  // initializes the request callbacks
  initCallbacks: function(options) {
    // connecting optional callbacks
    Xhr.EVENTS.each(function(name) {
      name = 'on'+name.capitalize();
      if (options[name])
        this[name](options[name]);
    }, this);
    
    // wiring the global xhr callbacks
    Xhr.EVENTS.each(function(name) {
      this['on'+name.capitalize()]((function() {
        Xhr[name]([this, this.xhr]);
      }).bind(this));
    }, this);
    
    // creating an automatical spinner handling
    this.onCreate((function() { if (this.spinner) $(this.spinner).show(); }).bind(this));
    this.onComplete((function() { if (this.spinner) $(this.spinner).hide(); }).bind(this));
    
    this.onSuccess(this.tryScripts.bind(this));
  }
});

// creating the class level observer
Observer.create(Xhr, {
  shorts: Xhr.EVENTS,
  wrap: function(name, callback) {
    return (function(event) {
      return callback(event.options[0], event.options[1]); // Xhr and XMLHttpRequest
    });
  }
});
