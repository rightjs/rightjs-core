= Intro

The Element unit contains all the dom-element extensions.

== Methods

All the set-methods, when you assign something to an element, return the 
element instance back, so you can easily create chains like that.

<code>
  $('some-element').on("click", function() {}).setStyle({
    fontSize: '200%'
  }).addClass('marked').update('with text'
  ).toggle().set('title', 'some-title') ...;
</code>

And don't forget that you need to call the $ function on your existing 
elements under Internet Explorer to make all the fancy methods appear.


== Selectors

All the selector methods like, {#parents}, {#siblings}, etc. Takes an optional 
css rule as an argument. If it was specified, then the result will be filtered
against the rule.

<code>
  var element = $('some-element');
  
  element.siblings();      // all the siblings
  element.siblings('div'); // all the siblings with tag 'div'
</code>

All the elements you select with the selection methods, will be automatically 
extended so you can easily process them.

<code>
  $('some-list').select('li').each('addClass', 'marked');
</code>


== Observers

Element has all the same methods as any Observer in the system.

<code>
  var element = $('some-element');
  
  element.on('click', function() {
    this.toggleClass('clicked');
  });
  
  element.fire('click');
</code>

You can use all the advantages of the observers like assigning methods by 
name, and specifying options for the fired events.

<code>
  element.on('click', 'addClass', 'clicked');
  element.on('keypress', 'radioClass', 'typing');
  
  element.fire('click', {
    button: 3
  });
  
  element.on('keypress', {
    keyCode: 12
  });
</code>

You can specify any of your own events too.

<code>
  element.on('something', function() {...});
  
  // ....
  
  element.fire('something');
</code>


== Event shortcuts

Additionally, for the most frequently used events there are shortcuts to connect
listeners and fire the events.

<code>
element.onClick(function() { ... }).click();
element.onKeydown(function() {...}).keydown();
</code>

The list of supported events

 * click
 * contextmenu
 * mousedown
 * mouseup
 * mouseover
 * mouseout
 * mousemove
 * keypress
 * keydown
 * keyup


### Element#initialize

== Semantic
  initialize(String tag_name[, Object options]) -> Element new

== Description
  Standard constructor, takes two arguments, the tag name and options. Options
  are generally the element attributes, and additionally you can send the 
  following keys to preset your element on instance.
  
  * 'html'    - source code to fill up the innerHTML property
  * 'class'   - class name(s) for the element
  * 'style'   - a hash of styles to be preset
  * 'observe' - a hash of events to observe

== Example
  var element = new Element('div');
  var element = new Element('p', {
    id: 'some-paragraph',
    'class': 'come class',
    'style': {
      padding: '10pt'
    },
    observe: {
      mouseover: function() { ... }
    }
  });


### Element#set

== Semantic
  set(String name, mixed value) -> Element self

== Description
  Assigns the given attribute to the element

== Example
  $('element').set('title', 'some title');


### Element#get

== Semantic
  get(String name) -> String value or null if empty

== Description
  Reads the element attribute. Returns null if the attribute is not set or
  empty.

== Example
  // <div id="div" title="some title"></div>
  
  $('div').get('title'); // -> 'some title'


### Element#has

== Semantic
  has(String name) -> boolean

== Description
  Checks if the element has non-empty attribute with that name

== Example
  // <div id="div" title="some title"></div>
  
  $('div').has('title'); // true
  $('div').has('rel');   // false


### Element#erase

== Semantic
  erase(String name) -> Element self

== Description
  Erases and attribute with the given name out of the element

== Example
  // <div id="div" title="some title"></div>
  
  $('div').has('title');   // true
  
  $('div').erase('title');
  
  $('div').has('title');   // false



### Element#hidden

== Semantic
  hidden() -> boolean

== Description
  Checks if the element is hidden.
  
  NOTE: Checks both the element own and computed (css) styles.

== Example
  /**
    <style>
      #second { display: none }
    </style>
    
    <div id="first" style="display: none"></div>
    <div id="second"></div>
    <div id="third"></div>
   */
   
  $('first').hidden();  // true
  $('second').hidden(); // true
  $('third').hidden();  // false


### Element#visible

== Semantic
  visible() -> boolean

== Description
  Checks if the element is not hidden. See {#hidden} for more details.

== Example
  $('some-element').visible();



### Element#hide

== Semantic
  hide([String effect[, Object options]]) -> Element self

== Description
  Hides out the element. If a valid effect name were specified and the Fx
  library is available, the the effect will be used to process the hiding.

== Example
  $('some-element').hide();
  
  $('some-element').hide('slide');
  $('some-element').hide('slide', {speed: 'fast'});


### Element#show

== Semantic
  show([String effect[, Object options]]) -> Element self

== Description
  Shows up the element. If a valid effect name were specified and the Fx
  library is available, then the effect will be used to process the showing

== Example
  $('some-element').show();
  
  $('some-element').show('slide');
  $('some-element').show('slide', {speed: 'fast'});



### Element#toggle

== Semantic
  toggle([String effect[, Object options]]) -> Element self

== Description
  Toggles the element visibility status. If a valid effect name were specified,
  the effect will be used to process the toggle.

== Example
  $('some-element').toggle();
  
  $('some-element').toggle('slide');
  $('some-element').toggle('slide', {speed: 'fast'});



### Element#radio

== Semantic
  radio([String effect[, Object options]]) -> Element self

== Description
  Hides all the sibling elements and shows itself. If a valid effect name was
  specified, the effect will be used to process the showing

== Example
  $('some-element').radio();
  
  $('some-element').radio('slide');
  $('some-element').radio('slide', {speed: 'fast'});



### Element#parent

== Semantic
  parent([mixed css_rule]) -> Element parent or null

== Description
  Selects the parent element. The first one if there is no css-rule, or the
  first one which matches the rule.

== Example
  /*
    <div id="one">
      <div id="two">
        <div id="three"></div>
      </div>
    </div>
   */
  
  $('three').parent();       // -> div#two
  $('three').parent('#one'); // -> div#one



### Element#parents

== Semantic
  parents([mixed css_rule]) -> Array of elements

== Description
  Returns the list of the element parent nodes, from down to up. If a css-rule
  was specified, the list will be filtered out by the rule

== Example
  /*
    <div id="one">
      <div id="two">
        <div id="three"></div>
      </div>
    </div>
   */
  
  $('three').parents();       // -> [div#two, div#one]
  $('three').parents('#one'); // -> [div#one]



### Element#subNodes

== Semantic
  subNodes([mixed css_rule]) -> Array of elements

== Description
  Returns the list of the immediate descendants of the element. Optionally
  filtered out by the given css-rule.

== Example
  /**
    <div id="one">
      <div id="two"></div>
      <div id="three"></div>
    </div>
   */
  
  $('one').subNodes();       // -> [div#two, div#three]
  $('one').subNodes('#two'); // -> [div#two]


### Element#siblings

== Semantic
  siblings([mixed css_rule]) -> Array of eleemnts

== Description
  Returns the list of the siblings. Optionally filtered out by the given 
  css-rule.

== Example
  /**
    <div>
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
    </div>
   */
   
  $('two').siblings();       // -> [div#one, div#three]
  $('two').siblings('#one'); // -> [div#one]


### Element#nextSiblings

== Semantic
  nextSiblings([mixed css_rule]) -> Array of elements

== Description
  Collects the element later siblings. Optionally filtered out by the given
  css-rule.

== Example
  /**
    <div>
      <div id="some"></div>
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
    </div>
   */
   
  $('one').nextSiblings();         // -> [div#two, div#three]
  $('one').nextSiblings('#three'); // -> [div#three]


### Element#prevSiblings

== Semantic
  prevSiblings([mixed css_rule]) -> Array of elements

== Description
  Returns the element previous siblings. Optionally filtered out by the given
  css-rule.

== Example
  /**
    <div>
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
      <div id="some"></div>
    </div>
   */
   
  $('three').nextSiblings();       // -> [div#two, div#one]
  $('three').nextSiblings('#one'); // -> [div#one]



### Element#next

== Semantic
  next([mixed css_rule]) -> Element or null

== Description
  Returns the next sibling of the element, or if the css-rule specified the
  next sibling that matches the css-rule.

== Example
  /**
    <div>
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
    </div>
   */
  
  $('one').next();         // -> div#two
  $('one').next('#three'); // -> div#three


### Element#prev

== Semantic
  prev([mixed css_rule]) -> Element or null

== Description
  Returns the previous sibling of the element, or if the css-rule specified 
  the previous sibling that matches the css-rule.

== Example
  /**
    <div>
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
    </div>
   */
   
  $('three').prev();       // -> div#two
  $('three').prev('#one'); // -> div#one


### Element#first

== Semantic
  first(mixed css_rule) -> Element or null

== Description
  Returns the first node in the internal structure that matches the given
  css-rule.

== Example
  /**
    <div id="one">
      <div id="two">
        <div id="three"></div>
      </div>
    </div>
   */
  
  $('one').first('div');    // -> div#two
  $('one').first('#three'); // -> div#three



### Element#select

== Semantic
  select(mixed css_rule) -> Array of elements

== Description
  Selects all matching elements out of the element internal structure.

== Example
  /**
    <div id="one">
      <div id="two">
        <div id="three"></div>
      </div>
    </div>
   */
  
  $('one').select('div');    // -> [div#two, div#three]
  $('one').select('#three'); // -> [div#three]



### Element#match

== Semantic
  match(mixed css_rule) -> boolean

== Description
  Checks if the element matches the given css rule

== Example
  // <div id="some-element"></div>

  $('some-element').match('div');  // true
  $('some-element').match('span'); // false


### Element#remove

== Semantic
  remove() -> Element self

== Description
  Removes the element out of its parent element

== Example
  $('some-element').remove();



### Element#insert

== Semantic
  insert(mixed content[, String position]) -> Element self

== Description
  Inserts the given content into the element at the given position.
  
  The content might be one of the following
  
  * An element instance
  * A string with HTML code (scripts will be evaluated)
  * A list of elements (array, or NodeList or something iterable)
  * A hash like {position: content}
  
  Position might be the one of the following
    top/bottom/before/after/instead
    
  The <tt>bottom</tt> value is used by default.

== Example
  var element = $('some-element');
  
  element.insert(new Element('div', {html: 'new-div'}));
  
  element.insert(new Element('div'), 'top');
  
  element.insert([element1, element2, element3], 'before');
  
  element.insert({
    before: element1,
    after:  element2,
    top:    element3
  });



### Element#insertTo

== Semantic
  insertTo(Element destination[, String position]) -> Element self

== Description
  Inserts the current element into the given one at the optionally given 
  position.

== Example
  var element1 = $('element1');
  var element2 = $('element2');
  
  element1.insertTo(element2, 'top');

  element2.firstChild === element1;



### Element#replace

== Semantic
  replace(mixed content) -> Element self

== Description
  Replaces the current element with the given content.

== Example
  // <div id="one"><div id="two"></div></div>

  $('two').replace('boo boo boo');
  $('one').innerHTML == 'boo boo boo';


### Element#update

== Semantic
  update(mixed content) -> Element self

== Description
  Replaces the current element internal structure with the given content

== Example
  // <div id="one">foo bar</div>

  $('one').update('something else');
  
  $('one').innerHTML == 'something else';


### Element#wrap

== Semantic
  wrap(Element wrapper) -> Element self

== Description
  Wraps the current element with the given one

== Example
  // <div id="one"><div id="two"></div></div>

  $('two').wrap(new Element('div', {id: 'three'}));
  
  $('one').innerHTML == '<div id="three"><div id="two"></div></div>';



### Element#clean

== Semantic
  clean() -> Element self

== Description
  Removes all the child nodes out of the element

== Example
  $('element').clean();



### Element#empty

== Semantic
  empty() -> boolean

== Description
  Checks if the element has no internal text or elements.

== Example
  $('element').empty();



### Element#setStyle

== Semantic
  setStyle(String key, String value) -> Element self
  setStyle(Object styles)            -> Element self
  setStyle(String styles_def)        -> Element self
  
== Description
  Assigns the element style

== Example
  $('element').setStyle('display', 'block');
  
  $('element').setStyle({
    display: 'block',
    border:  '1px solid gray'
  });
  
  $('element').setStyle('display:block;color:red');



### Element#getStyle

== Semantic
  getStyle(String name) -> String value or null

== Description
  Requests the element style by name.
  
  Supports both camelized and dasherized names.
  
  NOTE: Will process both element own and computed (css) level styles

== Example
  $('element').hide();
  
  $('element').getStyle('dispaly'); // -> 'none'



### Element#hasClass

== Semantic
  hasClass(String class) -> boolean

== Description
  Checks if the element has the class name

== Example
  var element = $('element');
  
  element.className = 'foo bar';
  
  element.hasClass('foo'); // true
  element.hasClass('bar'); // true
  element.hasClass('boo'); // false



### Element#setClass

== Semantic
  setClass(String name) -> Element self

== Description
  Replaces all the element class names with the given one

== Example
  element.className = 'foo bar';
  
  element.setClass('boo');
  
  element.className == 'boo';



### Element#addClass

== Semantic
  addClass(String name) -> Element self

== Description
  Adds the class name to the element class names list

== Example
  element.className = 'foo';
  
  element.addClass('bar');
  
  element.className == 'foo bar';



### Element#removeClass

== Semantic
  removeClass(String name) -> Element self

== Description
  Removes the class name out of the element class names list

== Example
  element.className = 'foo bar';
  
  element.removeClass('bar');
  
  element.className == 'foo';



### Element#toggleClass

== Semantic
  toggleClass(String name) -> Element self

== Description
  Toggles the class name presence on the element class names list

== Example
  element.className = 'foo';
  
  element.toggleClass('bar')
  element.className == 'foo bar';
  
  element.toggleClass('bar')
  element.className == 'foo';



### Element#radioClass

== Semantic
  radioClass(String name) -> Element self

== Description
  Removes the class name out of all the element siblings and adds it to
  the current element

== Example
  $('element').radioClass('boo');



### Element#observe

== Semantic
  observe(String eventName, Function listener)             -> Element self
  observe(String eventName, String method[, argument,...]) -> Element self
  observe(String eventName, Array list_list_of_callbacks)  -> Element self
  observe(Object event_listeners_hash)                     -> Element self

== Description
  Wires an event listener to the element.

== Example
  $('element').observe('click', function() {
    // do something about it
  });
  
  $('element').observe('click', 'addClass', 'clicked');
  
  $('element').observe('click', [function1, function2]);
  
  $('element').observe({
    click: function1,
    dblclick: function2
  });


### Element#on

== Semantic
  on(String eventName, Function listener)             -> Element self
  on(String eventName, String method[, argument,...]) -> Element self
  on(String eventName, Array list_list_of_callbacks)  -> Element self
  on(Object event_listeners_hash)                     -> Element self

== Description
  Short alias for the {#observe} method.

== Example
  $('element').on('click', function() {
    // do something about it
  });
  
  $('element').on('click', 'addClass', 'clicked');

  $('element').on('click', [function1, function2]);
  
  $('element').on({
    click: function1,
    dblclick: function2
  });


### Element#observes

== Semantic
  observes(Function listener)              -> boolean
  observes(String name, Function listener) -> boolean

== Description
  Checks if the given listener observers the element events. You can have a 
  check generally or against some event name.

== Example
  var func = function() {};
  
  element.on('click', func);
  
  element.observes(func);              // true
  element.observes('mouseover', func); // false



### Element#listeners

== Semantic
  listeners()            -> Array of functions
  listeners(String name) -> Array of functions

== Description
  Returns the list the element event listeners. Might be narrowed down by an
  event name scope.

== Example
  var func = function() {};
  
  element.on('click', func);
  
  element.listeners();            // -> [func]
  element.listeners('click');     // -> [func]
  element.listeners('mouseover'); // -> []



### Element#stopObserving

== Semantic
  stopObserving(String name)           -> Element self
  stopObserving(Function listener)     -> Element self
  stopObserving(String name, listener) -> Element self

== Description
  Unsubscribes the event listener. It can be done globally for a particular
  event name, or for some particular listener, or for listener and an event
  name

== Example
  var listener = function() {};
  
  $('element').on('click', listener);
  
  $('element').stopObserving('click');
  
  $('element').stopObserving(listner);
  
  $('element').stopObserving('click', listner);



### Element#sizes

== Semantic
  sizes() -> Object {x: ... , y: ...}

== Description
  Returns the element sizes hash.

== Example
  var width  = $('element').sizes().x;
  var height = $('element').sizes().y;



### Element#position

== Semantic
  position() -> Object {x: ... , y: ...}

== Description
  Returns the element absolute position on the page

== Example
  var top  = $('element').position().y;
  var left = $('element').position().x;



### Element#scrolls

== Semantic
  scrolls() -> Object {x: ... , y: ...}

== Description
  Returns the element scrolls

== Example
  var top  = $('element').scrolls().y;
  var left = $('element').scrolls().x;



### Element#dimensions

== Semantic
  dimensions() -> Object

== Description
  Returns the element dimensions in a single hash. Includes the element
  width, height, top and left positions and scrollLeft and scrollTop values.

== Example
  $('element').dimensions();



### Element#setWidth

== Semantic
  setWidth(number pixels) -> Element self

== Description
  Sets the element width to the given size.
  
  NOTE: the method will automatically adjust the actual style.width to
  existing paddings and borders so the end result was exactly the same as 
  was asked.

== Example
  var element = new Element('div', {
    style: {
      position: absolute,
      border: '10px solid gray',
      padding: '10px'
    }
  });
  
  element.setWidth(100);
  
  element.offsetWidth; // 100
  element.style.width; // 80px



### Element#setHeight

== Semantic
  setHeight(number pixels) -> Element self

== Description
  Sets the element height to the given size.
  
  NOTE: the method will automatically adjust the actual style.height to
  existing paddings and borders so the end result was exactly the same as 
  was asked.

== Example
  var element = new Element('div', {
    style: {
      position: absolute,
      border: '10px solid gray',
      padding: '10px'
    }
  });
  
  element.setWidth(100);
  
  element.offsetWidth; // 100
  element.style.width; // 80px
  
  

### Element#resize

== Semantic
  resize(number width, number height) -> Element self
  resize({x: number, y: number})      -> Element self

== Description
  Sets the element size.
  
  NOTE: the method will automatically adjust the actual style to existing
  paddings and borders so the end result was exactly the same as asked.

== Example
  var element = new Element('div', {
    style: {
      position: absolute,
      border: '10px solid gray',
      padding: '10px'
    }
  });
  
  element.resize(100, 100);
  
  element.offsetHeight; // 100
  element.offsetWidth;  // 100
  element.style.width;  // 80px
  element.style.height; // 80px


### Element#moveTo

== Semantic
  moveTo(number left, number top) -> Element self
  moveTo({x: number, y: number})  -> Element self

== Description
  Move the element to the given position

== Example
  element.moveTo(100, 100);
  element.moveTo({x: 100, y: 100});



### Element#scrollTo

== Semantic
  scrollTo(number left, number top) -> Element self
  scrollTo({x: number, y: number})  -> Element self

== Description
  Sets the element scrolling position

== Example
  element.scrollTo(100, 100);
  element.scrollTo({x: 100, y: 100});



### Element#scrollThere

== Semantic
  scrollThere() -> Element self

== Description
  Scrolls the window to the element

== Example
  element.scrollThere();


### Element#load

== Semantic
  load(String url[, Object options]) -> Element self

== Description
  This method loads the given url and updates the element innerHTML property 
  with the response body.
  
  Takes all the standard {Xhr} class options as the second parameter.
  
  If there is javascript code in the response, by default it will be
  automatically evaluated after the element body was updated.
  
  NOTE: will perform a GET request by default.
  
== Example
  element.load('/something');
  element.load('/something', {
    method: 'post',
    spinner: 'spinner-id'
  });


### Element.addMethods

== Semantic
  Element.addMethods(Object methods[, boolean dont_rewrite])

== Description
  Registers additional methods for the dom-elements on the page

== Example
  Element.addMethods({
    myMethod: function() {....}
  });

  $('my_element').myMethod();
