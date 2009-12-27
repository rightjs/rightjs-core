= Intro

The <tt>window</tt> object in RightJS has it's own portion of extensions that
might help you to deal with sizes and scrolls in a cross browsing way.


### sizes

== Semantic
  sizes() -> Object {x: ..., y: ...}

== Description
  Returns the window internal space sizes

== Example
  window.sizes();

### scrolls

== Semantic
  scrolls() -> Object {x: ..., y: ...}

== Description
  Returns the scroll offsets for the window

== Example
  window.scrolls();


### scrollTo

== Semantic
  scrollTo(number left, number top) -> window self
  scrollTo(Object {x: ..., y:...})  -> window self
  scrollTo(Element element)         -> window self
  scrollTo(String element_id)       -> window self

== Description
  Handles the window main scrollbars. Can scroll the window to any position
  or an element.

== Example
  window.scrollTo(123, 123);
  window.scrollTo({x: 123, y: 123});
  window.scrollTo($('element'));
  window.scrollTo('element-id');

