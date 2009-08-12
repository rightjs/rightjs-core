= Intro

Xhr is the standard xml http requests handler for RightJS. It's pretty much
standard, with standard methods/options and behavior.

== Options
Xhr object supports the following list of options. Any of them might be set
up as global or an instance option.

* method        'post'  - request method
* encoding      'utf-8' - encoding
* async         true    - asynchronous request
* evalScripts   false   - extract/eval javascripts from the response
* evalResponse  false   - eval response as a javascript code
* evalJSON      true    - eval json responses automatically
* urlEncoded    true    - urlencode the parameters
* spinner       null    - common spinner element
* params        null    - default parameters

== Spinners
Additionally RightJS offers you to take care of the spinner elements
automatically. You can define one common spinner in the global {Xhr.Options}
object, or you can specify custom spinners per-request.

You can specify spinner as an element object instance or as an element-id

<code>
  Xhr.Options.spinner = 'spinner';
  
  // now the spinner element will appear before the request
  // and automatically get hidden on complete or cancel
  new Xhr('/foo/bar').send();
  
  // in this case Xhr will process both the global and custom spinners
  new Xhr('/foo/bar', {
    spinner: $('custom-spinner')
  }).send();
</code>

== Parameters
You can send custom parameters with Xhr requests. You can specify them either
as a url-encoded string or as an object.

Then here are several levels, you can specify global params which will be sent 
with all the xhr request.

<code>
  Xhr.Options.params = 'myapp=true';
  
  // will send 'myapp=true' params with any following requests.
  Xhr.load('/foo/bar');
  
  new Xhr('/foo/bar').send();
</code>

You can specify per-request parameters sending them with options

<code>
  var xhr = new Xhr('/foo/bar', {
    params: {myapp: true}
  });
  
  xhr.send(); // the server will see the 'myapp=true' params
</code>

And you can specify the params with the {Xhr#send} method.

<code>
  var xhr = new Xhr('/foo/bar').send('myapp=true');
</code>

NOTE: when you specify params on several levels, they will be merged with the
      lowest level priority.


== Events
RightJS Xhr class is inherited from the standard Observer class which means
that Xhr objects follow all the standard observer rules. You can add, list
and remove event handlers in the usual way.

Xhr class supports the following events

 * create
 * request
 * complete
 * success
 * cancel
 
Sure you can handle your own custom events if you need so.

<code>
  var xhr = new Xhr('/foo/bar', {
    onSuccess: function() {...}
  });
  xhr.onCreate(function() {});
  xhr.on('custom', function() {});
  // .....
</code>

NOTE: Every callback will receive two arguments. First the request instance,
and the second is the actual original request instance.

== JSON handling
If the options (global or local) has the key 'evalJSON', then Xhr will try
to evaluate responses with json content-type by default and assign it to the
<tt>responseJSON</tt> property

<code>
  Xhr.load('/some.json', {
    onSuccess: function(request) {
      var json = request.responseJSON;
      
      // ....
    }
  });
</code>


### Element.Options

== Semantic
  Options -> Object
  
== Description
  Default Xhr options. See the options chapter above for more details
  
== Example
  Xhr.load('/some/url'); // -> 'post' request
  
  Xhr.Options.method = 'get';
  
  Xhr.load('/some/url'); // -> 'get' request


### Element.load

== Semantic
  Xhr.load(String url[, Object options]) -> Xhr new
  
== Description
  Shortcut for <tt>new Xhr(url, options).send();</tt>. Just creates a new xhr
  request instance and sends it.

== Example
  Xhr.load('/some/url', {
    method: 'get',
    onSuccess: function(request) {
      // do something about it
    }
  });
  
### Element#initialize

== Semantic
  initialize(String url[, Object options]) -> Xhr new

== Description
  Standard constructor. The second parameter is options with all the standard
  keys.

== Example
  var xhr = new Xhr('/some/url');
  var xhr = new Xhr('/some/url', {
    method: 'get',
    onSuccess: some_success_handler
  });

### Element#setHeader

== Semantic
  setHeader(String name, String value) -> Xhr self

== Description
  Setter for additional headers which should be sent with the request

== Example
  var xhr = new Xhr('/some/url');
  xhr.setHeader(''Content-type', 'application/x-www-form-urlencoded');

### Element#getHeader

== Semantic
  getHeader(String name) -> String value

== Description
  Getter to read the response headers

== Example
  var xhr = new Xhr('/foo/bar');
  xhr.send();
  // ...
  xhr.getHeader('Content-type');

### Element#successful

== Semantic
  successful() -> boolean

== Description
  Checks if the request were completed with a successful status.

== Example
  var xhr = new Xhr('/foo/bar', {
    onComplete: function(request) {
      if (request.successful()) {
        // do something
      }
    }
  }).send();


### Element#send

== Semantic
  send([String params]) -> Xhr self
  send([Object params]) -> Xhr self

== Description
  Sends the request to the server

== Example
  var xhr = new Xhr('/foo/bar');
  xhr.send();
  
  // or
  
  xhr.send('foo=bar&moo=boo');
  
  // or
  
  xhr.send({foo: 'bar'});


### Element#update

== Semantic
  update(Element element[, mixed params])   -> Xhr self
  update(String element_id[, mixed params]) -> Xhr self

== Description
  Updates the given element with the result of the request

== Example
  var xhr = new Xhr('/foo/bar');
  
  xhr.update(element);
  xhr.update('element-id');
  xhr.udpate(element, 'foo=bar');
  xhr.udpate(element, {foo: 'bar'});
  

### Element#cancel

== Semantic
  cancel() -> Xhr self

== Description
  Cancels an active request

== Example
  var xhr = new Xhr('/foo/bar');
  xhr.send();
  
  xhr.cancel();
  
