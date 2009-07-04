= Intro

By default RightJS comes with some basic visual effects package and Fx is the
basic unit of the package. You won't need to instance the class manually but
it defines the common visual effects interface.

== Events
Fx objects handles the next events

  * start
  * finish
  * cancel
  
Following the general events handling convention over the framework it means
you can use all the common <tt>observe, stopObserving, etc</tt> methods along
with the <tt>onStart, onFinish, onCancel</tt> shortcuts.

== Options
There are common list of options which all the visual effects share

  * duration   - the effect duration in ms or a string predefined name
  * transition - the transition algorithm used for the effect
  * queue      - boolean marker if the effect should be queued
  * onStart    - on-start callback
  * onFinish   - on-finish callback
  * onCancel   - on-cancel callback

== Durations
There are three named durations which you can use as the fx options.

  * short  - 200 ms
  * normal - 400 ms (default)
  * long   - 800 ms

== Transitions
There are several predefined transitions for the visual effects. You can use
the names in the options or specify your own function if you need.

  * Cos - slow at the beginning and the end, and fast in the middle
  * Sin - fast at the beginning and the end, and slow in the middle
  * Exp - slow at the beginning and rapidly throttles to the end
  * Log - fast at the beginning and rapidly slows down to the end
  * Lin - constant speed transition

By default it's the <tt>Cos</tt> transition which suits most of the cases.


### Fx#initialize

== Semantic
  initialize([Object options])

== Description
  The basic constructor
  

### Fx#start

== Semantic
  start() -> Fx self

== Description
  Starts the effect processing


### Fx#finish

== Semantic
  finish() -> Fx self

== Description
  Stops the effect and mark it as a completely finished

### Fx#cancel

== Semantic
  cancel() -> Fx self

== Description
  Interrupts the effect


### Fx#pause

== Semantic
  pause() -> Fx self

== Description
  Puts the effect on pause with ability to resume it later


### Fx#resume

== Semantic
  resume() -> Fx self

== Description
  Resumes a paused effect processing

### Fx#render

== Semantic
  render(Float position)

== Description
  Abstract protected method where the actual effect rendering supposed to be
  happening. During the effect run it receives float numbers from 0 to 1 which
  represents the position of the effect from the beginning to the end.


