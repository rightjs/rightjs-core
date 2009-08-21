= Intro

Fx.Morph is the basic dom-elements morphing visual effect. It can morph
an element from its current state to any end style or a css-class.

You can specify several keys in your end style as much as you can specify
several css-classes, all the values will be processed simultaneously
providing an excellent user experience.

NOTE: There's no need to preset the element styles manually before run the
effect, in most of the cases RightJS is smart enough to figure out the initial
styles.

== Example

<code>
  new Fx.Morph('element-id').start({
    background: 'yellow',
    fontSize:   '20px'
  });
  
  new Fx.Morph(element, {duration: 'long'}).start('end-class');
  
  new Fx.Morph(element).start('class1 class2 class3');
</code>

### Fx.Morph#initialize

== Semantic
  initialize(Element element[, Object options])
  initialize(String element_id[, Object options])
  
== Description
  General constructor


### Fx.Morph#start

== Semantic
  start(Object end_style)   -> Fx.Morph self
  start(String css_classes) -> Fx.Morph self

== Description
  Starts the effect towards the given style or css-class(es)
