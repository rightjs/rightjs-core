# Xhr

Xhr is the standard xml http requests handler for RightJS.

## Options

Xhr object supports the following list of options.

Name         | Default | Description                                 |
-------------|---------|---------------------------------------------|
method       | 'post'  | request method                              |
encoding     | 'utf-8' | encoding                                    |
async        | true    | asynchronous request                        |
evalScripts  | false   | extract/eval javascripts from the response  |
evalResponse | false   | eval response as a javascript code          |
evalJSON     | true    | eval json responses automatically           |
urlEncoded   | true    | urlencode the parameters                    |
spinner      | null    | common spinner element                      |
params       | null    | default parameters                          |

Any of the options might be changed globally by altering the {Xhr.Options}
object or be passed along with any xhr functionality interface.


## Spinners

The {Xhr} class in RightJS handles the spinners automatically. You can specify
them as an element object instance or as an element-id

    Xhr.Options.spinner = $('spinner');
    
    // now the spinner element will appear before the request
    // and automatically get hidden on complete or cancel
    new Xhr('/foo/bar').send();
    
    // in this case Xhr will process both the global and custom spinners
    new Xhr('/foo/bar', {
      spinner: 'custom-spinner'
    }).send();


## Parameters

You can send custom parameters with Xhr requests. You can specify them either
as an url-encoded string or as an object.

Then here are several levels, you can specify global params which will be sent 
with all the xhr request.

    Xhr.Options.params = 'myapp=true';
    
    // will send 'myapp=true' params with any following requests.
    Xhr.load('/foo/bar');
    
    new Xhr('/foo/bar').send();

You can specify per-request parameters sending them with options

    var xhr = new Xhr('/foo/bar', {
      params: {myapp: true}
    });
  
    xhr.send(); // the server will see the 'myapp=true' params

And you can specify the params with the {Xhr#send} method.

    var xhr = new Xhr('/foo/bar').send('myapp=true');

__NOTE:__ if you specify params on several levels, they will be merged in a
single hash when a request goes live.


## Events

RightJS Xhr class is inherited from the standard {Observer} class, which means
that Xhr instances follow all the standard observer rules. You can add, list
and remove event handlers in the usual way.

Xhr class supports the following events

Name     | Description                                                   |
---------|---------------------------------------------------------------|
create   | after the XmlHTTPRequest object was instanced                 |
request  | after the request was sent                                    |
complete | when the request was completed (either successfully or not)   |
success  | when the request was _successfully_ completed                 |
failure  | when the request was _failed_                                 |
cancel   | when the request was _manually_ canceled                      |

__NOTE:__ Every callback will receive two arguments. The first one is the
request instance, and the second one is the actual original request instance.

## JSON handling

If the option `evalJSON` is true, then Xhr will try to evaluate responses that
come with a json content-type and assign it to the `responseJSON` property

    Xhr.load('/some.json', {
      onSuccess: function(request) {
        var json = request.responseJSON;
      
        // ....
      }
    });
    

### .Options

    Xhr.Options -> Object

Default Xhr options. See the options chapter above for more details

    Xhr.load('/some/url'); // -> 'post' request
  
    Xhr.Options.method = 'get';
    
    Xhr.load('/some/url'); // -> 'get' request


### .load

    Xhr.load(String url[, Object options]) -> Xhr new

Shortcut for `new Xhr(url, options).send();`. Just creates a new xhr
request instance and sends it.
  
__NOTE:__ will perform a `GET` request by default

    Xhr.load('/some/url', {
      onSuccess: function(request) {
        // do something about it
      }
    });
  
### #initialize

    initialize(String url[, Object options]) -> Xhr new

Standard constructor. The second parameter is options with any of the standard
keys.

    var xhr = new Xhr('/some/url');
    var xhr = new Xhr('/some/url', {
      method: 'get',
      onSuccess: some_success_handler
    });

### #setHeader

    setHeader(String name, String value) -> Xhr self

Setter for additional headers which should be sent with the request

    var xhr = new Xhr('/some/url');
    xhr.setHeader('Content-type', 'application/x-www-form-urlencoded');

### #getHeader

    getHeader(String name) -> String value

Reads the response headers

    var xhr = new Xhr('/foo/bar');
    xhr.send();
    // ...
    xhr.getHeader('Content-type');

### #successful

    successful() -> boolean

Checks if the request was completed with a successful status.

    var xhr = new Xhr('/foo/bar', {
      onComplete: function(request) {
        if (request.successful()) {
          // do something
        }
      }
    }).send();


### #send

  send([String params])  -> Xhr self
  send([Object params])  -> Xhr self
  send([Form   element]) -> Xhr self

Sends the request to the server

    var xhr = new Xhr('/foo/bar');
    xhr.send();
    
    // or
    
    xhr.send('foo=bar&moo=boo');
    
    // or
    
    xhr.send({foo: 'bar'});


### #update

  update(Element element[, mixed params])   -> Xhr self
  update(String element_id[, mixed params]) -> Xhr self

Sends the request and updates the given element with the result of the request

    var xhr = new Xhr('/foo/bar');
    
    xhr.update(element);
    xhr.update('element-id');
    xhr.udpate(element, 'foo=bar');
    xhr.udpate(element, {foo: 'bar'});
  

### #cancel

    cancel() -> Xhr self

Cancels an active request

    var xhr = new Xhr('/foo/bar');
    xhr.send();
  
    xhr.cancel();
  
