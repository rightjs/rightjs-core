= Intro

RightJS inherits forms from the general Element unit, which means you can do
everything the same that you can do with any other element in the system, plus
there are several additional goods that might make the work with forms much easier.

== Ajax handling

To submit your form via an {Xhr} request you just need to call the <tt>.send()</tt>
method.

<code>
  $('some-form').send();
</code>

This will handle everything automatically, grab the request method, url,
options, etc. And, if your the form contains files to upload, it will be
nicely handled by an iframed request in just the same way. You don't need
to worry about anything.

You can also mark the form as a remote one and then when it gets submitted
the form it will go via a xhr request automatically.

<code>
  $('some-form').remotize();
</code>

And you can specify any the standard {Xhr} options too.

<code>
  $('some-form').send({
    spinner: 'spinner-id',
    onSuccess: function(r) {
      $('notices').update(r.responseText);
    }
  });
</code>



### Form#initialize

== Semantic
  initialize([Object options])

== Description
  Basic constructor. Receives all the common Element unit options plus a
  boolean one named 'remote' which tells if you want the form to be submitted
  via an Xhr request by default.

== Example
  var form = new Form({
    method: 'post',
    action: 'some/action'
  });


### Form#getElements

== Semantic
  getElements() -> Array of elements

== Description
  Returns the form elements list in an array and checks if all of them were
  properly extended.

== Example
  var form_elements = $('form').getElements();



### Form#inputs

== Semantic
  inputs() -> Array of elements

== Description
  Returns the list of all the form input elements without the buttons.

== Example
  $('form').inputs();



### Form#focus

== Semantic
  focus() -> Form self

== Description
  Tries to put the focus on the first input element on the form that
  is visible and not disabled.

== Example
  $('form').focus();



### Form#blur

== Semantic
  blur() -> Form self

== Description
  Looses focus on every element on the form

== Example
  $('form').blur();




### Form#disable

== Semantic
  disable() -> Form self

== Description
  Disables every visible element on the form

== Example
  $('form').disable();



### Form#enable

== Semantic
  enable() -> Form self

== Description
  Enables all disabled elements on the form

== Example
  $('form').enable();



### Form#values

== Semantic
  values() -> Object

== Description
  Returns a name->value hash of all the form values

== Example
  $('form').values();



### Form#serialize

== Semantic
  serialize() -> String

== Description
  Collects all the values on the form and serializes them in a single
  url-query string.

== Example
  $('form').serialize();



### Form#send

== Semantic
  send([Object options]) -> Form self

== Description
  Remotely submits the form via an XHR request. The argument might contain
  any standard {Xhr} object options.
  
  NOTE: works with files uploading too!

== Example
  $('form').send();
  
  $('form').send({
    spinner:    $('spinner'),
    onComplete: call_the_function
  });



### Form#remotize

== Semantic
  remotize([Object options]) -> Form self

== Description
  Mark the form to be automatically send via an {Xhr} request when submitted.
  Optionally might preset any standard {Xhr} object options.

== Example
  $('form').remotize({spinner: $('some-image')});
  
  $('form').submit();  // the form goes remotely



### Form#unremotize

== Semantic
  unremotize() -> Form self

== Description
  Undoes the {#remotize} marker.

== Example
  $('form').remotize();
  $('form').unremotize();
  
  $('form').submit(); // the form goes via usual HTTP request


### Form.addMethods

== Semantic
  Form.addMethods(Object methods[, boolean dont_rewrite])
  
== Description
  Registers additional methods for the Form units

== Example
  Form.addMethods({
    myMethod: function() {....}
  });
  
  $('my_form').myMethod();
