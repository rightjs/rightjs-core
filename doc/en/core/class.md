# Class
[Prototype]: http://prototypejs.org
[Mootools]:  http://mootools.net
[Ruby]:      http://www.ruby-lang.org

RightJS is an object-oriented framework and therefore provides extensive
object-oriented programming features, which are basically a mix of the ideas
from the [Prototype][] JavaScript framework and [Ruby][] programming language.


## Basic Definition

A basic class definition is the same you might see in [Prototype][] or
[Mootools][]

    var Klass = new Class({
      initialize: function() {
        // constructor
      },
      
      method1: function() {},
      method2: function() {}
    });


## Inheritance

Inheritance looks the same way it is in [Prototype][], except in RightJS you
refer to a super method by calling the `this.$super` variable

    var Girl = new Class({
      sayHello: function() {
        return "Hello there";
      }
    });
    
    var SexyGirl = new Class(Girl, {
      sayHello: function() {
        return "Well "+ this.$super() + "!";
      }
    });


## Ruby-style Mixins

[Ruby][] takes advantages of multiple-inheritance by allowing the users to
define shared modules and then inject them in classes when needed. RightJS
monkeys this feature in its `Class` unit.

    var Module = {
      method: function() {}
    };
    
    var Klass = new Class({
      include: Module, // <- adds it on the instance level
      extend:  Module, // <- adds it on the class level
      
      // the rest of the class
    });

You can specify several modules by using arrays

    var Klass = new Class({
      include: [Module1, Module2, ...],
      
      // or on the class level
      extend:  [Module1, Module2, ...]
    });

You also can define class-level methods inline with all the rest of the class

    var Klass = new Class({
      extend: {
        CLASS_LEVEL_CONST_1: 1,
        CLASS_LEVEL_CONST_2: 2,
        
        classLevelMethod: function() {}
      },
      
      // instance level methods
    });

And you can call `include()` and `extend()` methods after a class was defined

    var Klass = new Class({
      // ....
    });
    
    Klass.include(Module, Module, ...);
    Klass.extend(Module, Module, ...);
    
__NOTE:__ the mixins follows the same priority principles as it is in the
[Ruby][] language. If you inject your modules _with_ a class definition,
then the class own methods will overwrite methods from the modules. But if you
inject your modules _after_ class was defined by using the `include()` and
`extend()` methods, then methods from the modules will overwrite methods in
the class.


## Mixins Callbacks
  
As RightJS monkeys the modules system from [Ruby][] it also supports the post
injection callbacks, the same way it is done in [Ruby][]. The names of the
callback methods are similar to the ones in [Ruby][]: `selfIncluded` and
`selfExtended`. Or in underscored version `self_included` and `self_extened`

    var Module = {
      selfIncluded: function(klass) {
        klass.prototype.foo = 'bar';
      },
      
      selfExtended: function(klass) {
        klass.FOO = 'BAR';
      }
    };
    
    var Klass = new Class({
      include: Module,
      extend:  Module
    });
    
    Klass.prototype.foo; // -> 'bar'
    Klass.FOO;           // -> 'BAR'


You might also check the
[OOP tutorial page](/tutorials/object-oriented-programming) for more detailed
information on the topic.
