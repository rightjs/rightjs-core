# String

RightJS extends the native String class with some additional powerful methods 
to make your life easier.


### #empty

    empty() -> boolean

Checks if the string is empty

    ''.empty();  // -> true
    ' '.empty(); // -> false
    'a'.empty(); // -> false


### #blank

    blank() -> boolean

Checks if the string is empty or contains only spaces

    ''.blank();   // -> true
    ' '.blank();  // -> true
    "\n".blank(); // -> true
    ' a'.blank(); // -> false


### #trim

    trim() -> String new

Removes trailing spaces at the beginning and the end of the string

    ' asdf '.trim(); // -> 'asdf'


### #stripTags

    stripTags(); -> String new

Removes all the tags out of the string

    'a <b>c</b> d'.stripTags(); // -> 'a c d'


### #stripScripts

    stripScripts();                  -> String new
    stripScripts(true);              -> String new
    stripScripts(Function receiver); -> String new

Strips all the javascript tags out of the string.

This method takes several possible arguments. If a boolean `true` is passed 
then the scripts will be evaluated after extraction. If a function is passed
every script body will be tossed into the function.

    var string = 'asdf<script>alert('bla');</script>';
    
    string.stripScripts();     // -> 'asdf'
    string.stripScripts(true); // -> 'asdf' and you'll see the alert
    string.stripScripts(2000); // -> 'asdf' and you'll see the alert in two seconds
    
    string.stripScripts(function(script) {
      // do something with the script in here
    });
    
    // will return 'asdf'


### #extractScripts

    extractScripts() -> String scripts

Extracts bodies of every script tag in the string and returns them as a 
single string

    var string = 'asdf <script>alert(1);</script>asdf<script>alert(2);</script>';
    
    string.extractScripts(); // -> 'alert(1);alert(2);'


### #evalScripts

    evalScripts() -> String self

Evals scripts in the string.

__NOTE:__ this method will not remove the scripts out of the string

    var string = 'asdf <script>alert(1);</script>';
    
    string.evalScripts(); // 'asdf <script>alert(1);</script>' and you'll see the alert


### #camelize

    camelize() -> String new

Converts a string from an underscored/dashed version into a camel cased one

    'foo_bar'.camelize(); // -> 'fooBar'
    'foo-bar'.camelize(); // -> 'fooBar'




### #underscored

    underscored() -> String new

Converts a camel cased or dashed string into an underscored one

    'fooBar'.underscored();  // -> 'foo_bar'
    'foo-bar'.underscored(); // -> 'foo_bar'


### #capitalize

    capitalize() -> String new

Creates a capitalized version of the string

__NOTE__: this method supports most of the UTF-8 symbols

    'boo boo boo'.capitalize();    // -> 'Boo Boo Boo'
    'йокарный бабай'.capitalize(); // -> 'Йокарный Бабай'



### #includes

    includes(String token) -> boolean

Checks if the string contains the given substring

    'foo'.includes('bar'); // -> false
    'foo'.includes('oo');  // -> true



### #startsWith

    startsWith(String token[, boolean ignorecase]) -> boolean

Checks if the string starts with the given substring

    'onSomething'.startsWith('on');           // -> true
    
    'onSomething'.startsWith('onsome');       // -> false
    'onSomething'.startsWith('onsome', true); // -> true



### #endsWith

    endsWith(String token[, boolean ignorecase]) -> boolean

Checks if the string ends up with the given substring

    'image.gif'.endsWith('.gif');       // -> true
    
    'image.gif'.endsWith('.GIF');       // -> false
    'image.gif'.endsWith('.GIF', true); // -> true



### #toInt

    toInt([Integer base]) -> Integer

Converts the string to an Integer number

    '123'.toInt(); // -> 123



### #toFloat

    toFloat() -> Float

Converts the string to a float number.

__NOTE:__ processes dashes and comas as decimal pinter unless you pass true as 
the parameter

    '123.45'.toFloat(); // -> 123.45
    '123,45'.toFloat(); // -> 123.45
    '123-45'.toFloat(); // -> 123.45

