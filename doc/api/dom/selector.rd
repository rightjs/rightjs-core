= Intro

Selectors are abstract, object oriented interface to deal with the css-based 
elements selections on you page. In most of the cases you don't need to have a 
deal with them, but sometimes it might be useful to instance and keep 
selectors directly.

== Performance

If your browsers has support of the native css-selectors then the things are 
really quick. Currently thats the WebKit based browsers, Firefox should roll 
it out with the 3.1 release, IE8 have it in their own way too. If your browser 
does not support it, then we have our own pure JavaScript css-selection 
engine, which has lots of optimizations and does pretty good too.

== Internet Explorer Support

To switch on the native css-selectors in IE8, you need to specify the 
following option in your page header.

<meta http-equiv="X-UA-Compatible" content="IE=8">

### Selector#initialize

== Semantic
  initialize(String css_rule)

== Description
  Justa  constructor

== Example
  var selector = new Selector('div > p > label');


### Selector#first

== Semantic
  first(Element element) -> Element or null

== Description
  Matches the first element in the given element scope which matches the 
  selector

== Example
  var selector = new Selector('div');
  var element  = $('some-element');
  
  var div      = selector.first(element);


### Selector#select

== Semantic
  select(element) -> Array of elements

== Description
  Selects all the matching elements in the scope of the given element

== Example
  var selector = new Selector('div');
  var element  = $('some-element');
  
  var divs     = selector.select(element);



### Selector#match

== Semantic
  match(Element element) -> boolean

== Description
  Checks if the given element matches the selector

== Example
  var selector = new Selector('div');
  
  selector.match(document.createElement('div'));  // true
  selector.match(document.createElement('span')); // false


