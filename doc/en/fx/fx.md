# Fx Basics

By default RightJS comes with some basic visual effects package and Fx is the
basic unit of the package. You won't need to instance this class manually, but
it defines the common visual effects interface.

## Events

Fx objects handle the next events

* start
* finish
* cancel
  
Following the general events handling convention over the framework it means
you can use all the common `on`, `stopObserving`, etc. methods along
with the `onStart`, `onFinish`, `onCancel` shortcuts.

## Options

There are common list of options which all the visual effects share

Name       | Default  | Description                                           |
-----------|----------|-------------------------------------------------------|
duration   | 'normal' | the effect duration in ms or a string predefined name |
transition | 'Sin'    | the transition algorithm used for the effect          |
queue      | true     | boolean marker if the effect should be queued         |

## Durations

There are three named durations, which you can use with the fx options.

Name   | Value             |
-------|-------------------|
short  | 200 ms            |
normal | 400 ms (default)  |
long   | 800 ms            |

## Transitions

There are several predefined transitions for the visual effects. You can use
the names in the options or specify your own function if you need.

Name | Description                                               |
-----|-----------------------------------------------------------|
Sin  | slow at the beginning and the end, but fast in the middle |
Cos  | fast at the beginning and the end, but slow in the middle |
Exp  | slow at the beginning and rapidly throttles to the end    |
Log  | fast at the beginning and rapidly slows down to the end   |
Lin  | a constant speed transition                               |

By default it's the `Sin` transition that suits most of the cases.


### #initialize

    initialize([Element element[, Object options]])

The basic constructor
  

### #start

    start() -> Fx self

Starts the effect processing

__NOTE__: _DO NOT_ overload this method, if you need to make some preparations
in your effect use the {#prepare} method. This method just receives your
attributes and holds them inside the visual effects queue.


### #finish

    finish() -> Fx self

Forces the effect to stop and mark it as a completely finished


### #cancel

    cancel() -> Fx self

Cancels the effect


### #pause

    pause() -> Fx self

Puts the effect on pause with an ability to resume it later


### #resume

    resume() -> Fx self

Resumes a paused effect processing


### #prepare

    prepare([....]) -> void
    
An abstract method, which is getting called with all the same arguments as the
{#start} method when the visual effects queue comes to this effect.


### #render

    render(Float position) -> void

Abstract protected method where the actual effect rendering supposed to be
happening. During the effect run it receives float numbers from 0 to 1 that
represent the position of the effect from the beginning to the end.

