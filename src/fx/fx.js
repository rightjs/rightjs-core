/**
 * Basic visual effects class
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Fx = new Class(Observer, {
  include: Options,
  
  extend: {
    EVENTS: $w('start finish cancel'),
    
    // default options
    OPTIONS: {
      fps:        60,
      duration:   'normal',
      transition: 'cos'
    },

    // named durations
    DURATIONS: {
      short:  200,
      normal: 400,
      long:   800
    },

    // list of transitions
    TRANSITIONS: {
      cos: function(i) {
        return -(Math.cos(Math.PI * i) - 1) / 2;
      }
    }
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.$super();
    this.setOptions(options);
    this.subject = this.subject || this;
  },
  
  /**
   * starts transition from the start number to the end number
   *
   * @param number from
   * @param number to
   * @return Fx this
   */
  start: function(from, to) {
    if (from <= to) return this.finish();
    
    this.from   = from;
    this.to     = to;
    
    this.steps  = (this.options.duration / 1000 / this.options.fps).ceil();
    this.number = 1;
    
    return this.startTimer().fire('start', this.subject);
  },
  
  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().fire('finish', this.subject);
  },
  
  /**
   * interrupts the transition
   *
   * @return Fx this
   */
  cancel: function() {
    return this.stopTimer().fire('cancel', this.subject);
  },
  
  /**
   * pauses the transition
   *
   * @return Fx this
   */
  pause: function() {
    return this.stopTimer();
  },
  
  /**
   * resumes a paused transition
   *
   * @return Fx this
   */
  resume: function() {
    return this.startTimer();
  },
  
// protected

  // dummy method, should implement the actual things happenning
  set: function(value) {},
  
  // the periodically called method
  // NOTE: called outside of the instance scope!
  step: function($this) {
    if ($this.steps > $this.number) {
      var delta = $this.transition($this.number / $this.steps);
      
      $this.set(($this.to - $this.from) * delta + $this.from);
      
      $this.number ++;
    } else {
      $this.finish();
    }
  },
  
  startTimer: function() {
    this.timer = this.step.periodical((1000 / this.options.fps).round());
    return this;
  },
  
  stopTimer: function() {
    if (this.timer) {
      this.timer.stop();
    }
    return this;
  }
  
  
});