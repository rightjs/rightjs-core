= Intro

RightJS extends the native String class with some additional powerful methods to make your life easier.

== UTF-8 Support

Basically, pure JavaScript does not support all the fancy non-ascii utf-8 symbols in regular expressions, so when you do some call like

<code>
  'йокарный бабай'.match(/a-z/);
  'йокарный бабай'.match(/\w/);
</code>

It will return null. To fix somehow the situation we have added two constants to the String class {String.UTF8_UPS} and {String.UTF8_DOWNS}, they both contains most of the fancy characters from the european languages, respectively in upper and lower cases. You can use them in your regular expressions if you need so.

We are already use them in some strings processing, like for example

<code>
  'путин может все'.capitalize();
  
  // -> "Путин Может Все"
</code>


### String#empty

== Semantic
  empty() -> boolean

== Description
  Checks if the string is empty

== Example
  ''.empty();  // true
  ' '.empty(); // false
  'a'.empty(); // false



### String#blank

== Semantic
  blank() -> boolean

== Description
  Checks if the string contains only spices and equivalent chars

== Example
  ''.blank();   // true
  ' '.blank();  // true
  "\n".blank(); // true
  ' a'.blank(); // false




### String#trim

== Semantic
  trim() -> String new

== Description
  Removes trailing spaces at the beginning and the end of the string

== Example
  ' asdf '.trim(); // -> 'asdf'




### String#stripTags

== Semantic
  stripTags(); -> String new

== Description
  Removes all the tags out of the string

== Example
  'a <b>c</b> d'.stripTags(); // -> 'a c d'




### String#stripScripts

== Semantic
  stripScripts();                  -> String new
  stripScripts(true);              -> String new
  stripScripts(100);               -> String new
  stripScripts(Function receiver); -> String new

== Description
  Strips all the javascript tags out of the string.
  
  This method takes several possible arguments. If a boolean true is passed the the scripts will be evaluated after extraction. If an integer number was passed the scripts will be evaluated with delay in microseconds equal to the number. If a function is passed every script body will be tossed into the function.

== Example
  var string = 'asdf<script>alert('bla');</script>';
  
  string.stripScripts();     // -> 'asdf'
  string.stripScripts(true); // -> 'asdf' and you'll see the alert
  string.stripScripts(2000); // -> 'asdf' and you'll see the alert in two seconds
  
  string.stripScripts(function(script) {
    // do something with the script in here
  });
  
  // will return 'asdf'




### String#extractScripts

== Semantic
  extractScripts() -> String scripts

== Description
  Extracts bodies of every script tag in the string and returns them as a single string

== Example
  var string = 'asdf <script>alert(1);</script>asdf<script>alert(2);</script>';
  
  string.extractScripts(); // 'alert(1);alert(2);'




### String#evalScripts

== Semantic
  evalScripts() -> String self

== Description
  Evals scripts in the string.
  
  NOTE: this method will not remove the scripts out of the string

== Example
  var string = 'asdf <script>alert(1);</script>';
  
  string.evalScripts(); // 'asdf <script>alert(1);</script>' and you'll see the alert




### String#camelize

== Semantic
  camelize() -> String new

== Description
  Converts a string from underscored/dashed version into a camelized one

== Example
  'foo-bar'.camelize(); // 'fooBar'




### String#underscored

== Semantic
  underscored() -> String new

== Description
  Converts camelcased or dashed string into underscored one

== Example
  'fooBar'.underscored(); // 'foo_bar'




### String#capitalize

== Semantic
  capitalize() -> String new

== Description
  Creates a capitalized version of the string

== Example
  'boo boo boo'.capitalize(); // 'Boo Boo Boo'




### String#includes

== Semantic
  includes(String token) -> boolean

== Description
  Checks if the string contains given substring

== Example
  'foo'.includes('bar'); // false
  'foo'.includes('oo');  // true



### String#startsWith

== Semantic
  startsWith(String token[, boolean ignorecase]) -> boolean

== Description
  Checks if the string starts with the given substring

== Example
  'onSomething'.startsWith('on'); // true
  
  'onSomething'.startsWith('onsome');       // false
  'onSomething'.startsWith('onsome', true); // true



### String#endsWith

== Semantic
  endsWith(String token[, boolean ignorecase]) -> boolean

== Description
  Checks if the string ends up with the given substring

== Example
  'image.gif'.endsWith('.gif'); // true
  
  'image.gif'.endsWith('.GIF');       // false
  'image.gif'.endsWith('.GIF', true); // true




### String#toInt

== Semantic
  toInt([Integer base]) -> Integer

== Description
  Converts the string into an Integer number

== Example
  '123'.toInt(); // -> 123



### String#toFloat

== Semantic
  toFloat() -> Float

== Description
  Converts the string into a float number.
  
  NOTE: processes dashes and comas as decimal pinter unless you pass true as the parameter

== Example
  '123.45'.toFloat(); // -> 123.45
  '123,45'.toFloat(); // -> 123.45
  '123-45'.toFloat(); // -> 123.45



### String#toFragment

== Semantic
  toFragment() -> DocumentFragment

== Description
  Processes the string as an html text and converts it into a DocumentFrament unit so you could work with it like with a single DOM unit. Used to bust up DOM manipulations on complex structures.

== Example
  var fragment = '<b>b</b><i>i</i><u>u</u>'.toFragment();
  
  fragment.childNodes; // [b, i, u]
