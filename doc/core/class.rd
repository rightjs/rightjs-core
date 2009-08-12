= Intro

As RightJS claims to be an object-oriented framework, it surely provides
the Class unit. Our Class unit pretty much starts with the Prototype framework
classes, extends the ideas from the MooTools framework, spices it with ideas
from the Ruby language etc. If you already have experience with those things,
it should be quite natural.

== Definition

Definitions of classes in RightJS is pretty standard and simple

<code>
  var Animal = new Class({
    initialize: function() {
      // constructor code
    },
    
    eat:   function() {},
    mate:  function() {},
    sleep: function() {}
  });
</code>

== Inheritance

Inheritance is a pretty natural thing in RightJS. To make one class be inherited
from another, you just pass the superclass as the first argument to the Class
call. And then inside your sub-class methods, you can refer to the superclass
methods by calling the <tt>this.$super</tt> method.

<code>
  var Animal = new Class({
    initialize: function(size) {
      this.size = size;
    },
    
    eat: function(animal) {
      if (this.size < animal.size)
        throw "You can't eat animals bigger than you";
    },
    
    mate: function(animal) {
      if (animal.constructor != this.constructor)
        throw "You should not mate animals of different kind";
    },
    
    sleep: function(time) {
      
    }
  });
  
  var Cat = new Class(Animal, {
    initialize: function() {
      this.$super(1);
    }
  });
  
  var Dog = new Class(Animal, {
    initialize: function() {
      this.$super(2);
    }
  });
  
  var Wolf = new Class(Dog, {
    eat: function(animal) {
      // wolf can eat up any animal
    }
  });
</code>

== Extending And Mixing

Additionally, we brought the Ruby extending and including principles into our 
classes. That a pretty powerful tool which lets you share modules between 
classes and take advantages of multiple inheritance.

The principles are simple. You use <tt>.extend()</tt> method to extend 
the class level structure and <tt>.include()</tt> to extend the class 
prototype level. For example:

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

Sure you can feed your classes with multiple mixins, easily

<code>
  var Klass = new Class({
    extend:  [mixin1, mixin2, mixin3],
    include: [mixin1, mixin2, mixin3]
  });
</code>

You even can extend your classes after definition.

<code>
  var Klass = new Class();
  Klass.extend(mixin1, mixin2, mixin3);
  Klass.include(mixin1, mixin2, mixin3);
</code>

But note, if you put extensions inline with the class definition, then rest of 
your methods will have a priority over the mixed in methods, and if you extend 
your class later, then the mixed in methods will have priority over the 
defined in the class. For example:

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

And eventually you can use the <tt>extend</tt> attribute to create inline 
class level definitions right in your class. Similar to that.

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
    
    // ... rest of the instance level functions
  })
</code>