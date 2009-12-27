= Intro

All the form elements, like inputs, selects and textareas in RightJS have some
additional goods to work with them.

== Events

In additional to the standard elements, form elements handles some additional
events. Those are the names

 * disable
 * enable
 * focus
 * blur
 * change

They are handled simultaneously with all the other events handling, so all the
shortcuts are in place, you can wire and run the event in the usual way.

### Form.Element#getValue

== Semantic
  getValue() -> mixed value

== Description
  Unified access to get a form element value

== Example
  $('input').getValue();
  $('select').getValue();
  $('textarea').getValue();
  $('multi-select').getValue();


### Form.Element#setValue

== Semantic
  setValue(mixed value) -> Element self

== Description
  Unified value setter for the form elements

== Example
  $('input').setValue('text');
  $('select').setValue(1);
  $('textarea').setValue('text');
  $('multi-select').setValue([1,2,3]);



### Form.Element#disable

== Semantic
  disable() -> Element self

== Description
  Disables the element

== Example
  $('element').disable();



### Form.Element#enable

== Semantic
  enable() -> Element self

== Description
  Enables the element

== Example
  $('input').enable();



### Form.Element#focus

== Semantic
  focus() -> Element self

== Description
  Puts the focus on the element

== Example
  $('input').focus();



### Form.Element#select

== Semantic
  select() -> Element self

== Description
  Puts the focus on the element and selects its data

== Example
  $('input').select();



### Form.Element#blur

== Semantic
  blur() -> Element self

== Description
  Looses the focus on the element

== Example
  $('input').blur();


### Form.Element.addMethods

== Semantic
  Form.Element.addMethods(Object methods[, boolean dont_rewrite])

== Description
  Registers additional methods for the form input element units,
  like INPUT, SELECT, TEXTAREA

== Example
  Form.Element.addMethods({
    myMethod: function() {....}
  });

  $('my_input').myMethod();
