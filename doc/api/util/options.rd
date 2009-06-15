= Intro

<tt>Options</tt> is a shared module which can be used with the classes which
needs an options attribute support.

Generally it provides the <tt>setOptions</tt> method where it merges any
default options with given ones and assigns the result to the <tt>options</tt>
property of the instance.

== Example
<code>
  var Steake = new Class({
    include: Options,
    
    Options: {
      cooked: 'well done',
      sauce:  'pepper',
      wedges: 'salad',
      garner: 'cheeps'
    }
    
    initialize: function(options) {
      this.setOptions(options);
    }
  });
  
  // without options it will has all the defaults
  var stake = new Stake();
  stake.options == Stake.Options;
  
  // with some options it will merge the with the defaults
  var stake = new Stake({
    cooked: 'rare',
    sauce:  'chilly'
  });
  
  stake.options == {
    cooked: 'rare',
    sauce:  'chilly',
    wedges: 'salad',
    garner: 'cheeps'
  };
</code>

== Default options

The default options might be an instance attribute, or a class level attribute
or one of the ancestor classes attribute. The module will look through all of
them form the instance to the top class.

<code>
  var Klass = new Class({
    include: Options,
    
    Options: {....}
  });
  
  // or 
  var Klass = new Class({
    include: Options,
    extend: {
      Options: {....}
    }
  });
  
  // or 
  var Klass1 = new Class({
    include: Options,
    
    extend: {
      Options: {....}
    }
  });
  
  var Klass2 = new Class(Klass1, {
    initialize: function(options) {
      this.setOptions(options);
    }
  });
</code>

The default options object might be named as one of the following

 * OPTIONS
 * Options
 * options
 
<code>
  var Klass = new Class({
    include: Options,
    
    OPTIONS: {.....},
    
    // or
    Options: {.....},
    
    // or 
    options: {.....}
  });
</code>

<b>NOTE:</b> in the last case the <tt>options</tt> attribute will be 
overwritten.

### Options#setOptions

== Semantic
  setOptions(Object options) -> Object self instance

== Description
  Assigns the options to the instance.
  
== Example
  var object = new ClassWithOptions();
  
  object.setOptions({....});
  
  object.options == {....};
