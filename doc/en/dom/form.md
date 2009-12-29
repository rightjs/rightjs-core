# Intro

RightJS inherits forms from the general Element unit, which means you can do
everything the same that you can do with any other element in the system, plus
there are several additional features that might make the work with forms much 
easier.

## Ajax handling

To submit your form via an {Xhr} request you just need to call the `.send()`
method.

    $('some-form').send();

This will handle everything automatically, grab the request method, url,
options, etc. And, if your the form contains files to upload, it will be
nicely handled by an iframed request in just the same way. You don't need
to worry about anything.

You can also mark the form as a remote one and then, when it gets submitted
the form it will go via a {Xhr} request automatically.

    $('some-form').remotize();

And you can specify any the standard {Xhr} options too.

    $('some-form').send({
      spinner: 'spinner-id',
      onSuccess: function(r) {
        $('notices').update(r.responseText);
      }
    });


### .addMethods

    addMethods(Object methods[, boolean dont_rewrite])

Registers additional methods for the Form elements

    Form.addMethods({
      myMethod: function() {....}
    });
    
    $('my_form').myMethod();


### #initialize

    initialize([Object options])

Basic constructor. Receives all the common Element unit options plus a
boolean one named `remote` which tells if you want the form to be submitted
via an {Xhr} request by default.

    var form = new Form({
      method: 'post',
      action: 'some/action'
    });


### #getElements

    getElements() -> Array of elements

Returns the form elements list in an array

    var form_elements = $('form').getElements();


### #inputs

    inputs() -> Array of elements

Returns a list of all the form input elements without the buttons.

    $('form').inputs();


### Form#focus

    focus() -> Form self

Tries to put the focus on the first input element on the form that
is visible and not disabled.

    $('form').focus();


### Form#blur

    blur() -> Form self

Looses focus on every element on the form

    $('form').blur();


### #disable

    disable() -> Form self

Disables every visible element on the form

    $('form').disable();


### #enable

    enable() -> Form self

Enables all disabled elements on the form

    $('form').enable();


### #values

    values() -> Object

Returns a name->value hash of all the form values

    $('form').values();


### #serialize

    serialize() -> String

Collects all the values on the form and serializes them in a single
url-query string.

    $('form').serialize();


### #send

    send([Object options]) -> Form self

Remotely submits the form via an XHR request. The argument might contain
any standard {Xhr} object options.
  
NOTE: works with files uploading too!


    $('form').send();
    
    $('form').send({
      spinner:    $('spinner'),
      onComplete: call_the_function
    });


### #remotize

    remotize([Object options]) -> Form self

Marks the form to be automatically send via an {Xhr} request when submitted.
Optionally might preset any standard {Xhr} object options.

    $('form').remotize({spinner: $('some-image')});
    
    $('form').submit();  // the form goes remotely


### #unremotize

    unremotize() -> Form self

Undoes the {#remotize} method changes

    $('form').remotize();
    $('form').unremotize();
    
    $('form').submit(); // the form goes via usual HTTP request


