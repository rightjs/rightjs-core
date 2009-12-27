= Intro

RightJS is an object-oriented framework, and it provides the <tt>Class</tt> unit.
The <tt>Class</tt> unit in RightJS is a mix of the later Prototype <tt>Class</tt>
implementation and the Ruby language features like <tt>include</tt> and 
<tt>extend</tt> methods.

== Definition

The classes definition is pretty simple and standard

<code>
  var Animal = new Class({
    initialize: function(size) {
      // constructor code is here
    },
    
    eat:   function() {},
    mate:  function() {},
    sleep: function() {}
  });
</code>

== Inheritance

The classes inheritance is organized in the standard way. If there are two arguments
passed to the <tt>Class</tt> constructor, the first object is considered to be the
parent class.

It is also available to call the super-class methods by calling the <tt>this.$super</tt> method.

<code>
  var Boy = new Class({
    sayIt: function() {
      return "Hello Mister!";
    }
  });
  
  var AngryBoy = new Class(Boy, {
    sayIt: function() {
      return "Angry Boy Says: "+this.$super();
    }
  });
  
  new Boy().sayIt();      // -> "Hello Mister!"
  new AngryBoy().sayIt(); // -> "Angry Boy Says: Hello Mister!"
</code>


== Extending And Mixing

There are two methods that let you extend your classes with shared modules:
<tt>.extend()</tt> method extends the class level and <tt>.include()</tt>
extends the class prototype level.

<code>
  var mixin = {
    foo: 'bar'
  };
  
  var Klass1 = new Class({
    extend: mixin
  });
  
  var Klass2 = new Class({
    include: mixin
  });
  
  Klass1.foo === Klass2.prototype.foo;
</code>

You can feed your classes with multiple mixins

<code>
  var Klass = new Class({
    extend:  [mixin1, mixin2, mixin3],
    include: [mixin1, mixin2, mixin3]
  });
</code>

And you can extend your classes after definition.

<code>
  var Klass = new Class();
  Klass.extend(mixin1, mixin2, mixin3);
  Klass.include(mixin1, mixin2, mixin3);
</code>

But keep in mind, if you put extensions inline with the class definition,
then the rest of your class methods will have a priority over the mixed in
methods, but if you extend the class after definition, then the mixed in
methods will have priority over the defined in the class.

<code>
  var mixin = {
    foo: 'bar'
  };
  
  var Klass = new Class({
    extend: mixin,
    
    foo: 'another'
  });
  
  Klass.foo == 'another';
  
  Klass.extend(mixin);
  
  Klass.foo == 'bar';
</code>

And eventually, you can use the <tt>extend</tt> attribute to create inline 
class level definitions right in your class. Similar to that:

<code>
  var Klass = new Class({
    extend: {
      CONST1: 1
      CONST2: 2
      
      classLevelFunction: function() {
        
      }
    },
    
    initialize: function() {
      
    },
    
    // ... the rest of the instance level functions
  })
</code>

Since the version 1.5.0 you also can specify Ruby style modules callbacks
named 'selfIncluded' or 'selfExtended' (camelized versions also supported)

<code>
  var Module = {
    boo: 'boo',
    
    selfIncluded: function(klass) {
      klass.prototype.boo = this.boo;
    },
    
    selfExtened: function(klass) {
      klass.boo = this.boo;
    }
  }
  var Klass = new Class({
    include: Module,
    extend:  Module
  });
  
  Klass.boo;           // -> 'boo'
  Klass.prototype.boo; // -> 'boo'
</code>