/**
 * Basic visual effects class
 *
 * Credits: Mostly inspired by the MooTools project
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
      transition: 'Cos'
    },

    // named durations
    DURATIONS: {
      short:  200,
      normal: 400,
      long:   800
    },

    // list of basic transitions
    Transitions: {
      Cos: function(i) {
        return -(Math.cos(Math.PI * i) - 1) / 2;
      },
      
      Sin: function(i) {
        return 1 - Math.sin((1 - i) * Math.PI / 2);
      },
      
      Exp: function(i) {
        return Math.pow(2, 8 * (i - 1));
      },
      
      Log: function(i) {
        return Math.log(1 + (Math.E-1) * i);
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
    
    // grabbing callbacks from the options
    Fx.EVENTS.each(function(name) {
      var callback = this.options['on'+name.capitalize()];
      if (callback) {
        this.on(name, callback);
      }
    }, this);
  },
  
  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    this.transition = Fx.Transitions[this.options.transition] || this.options.transition;
    var duration    = Fx.DURATIONS[this.options.duration]     || this.options.duration;
    
    this.steps  = (duration / 1000 * this.options.fps * (Browser.IE ? 0.5 : 1)).ceil();
    this.number = 1;
    
    return this.fire('start', this.element).startTimer();
  },
  
  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().fire('finish', this.element);
  },
  
  /**
   * interrupts the transition
   *
   * @return Fx this
   */
  cancel: function() {
    return this.stopTimer().fire('cancel', this.element);
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
  render: function(value) {},
  
  // the periodically called method
  // NOTE: called outside of the instance scope!
  step: function($this) {
    if ($this.steps >= $this.number) {
      $this.render($this.transition($this.number / $this.steps));
      
      $this.number ++;
    } else {
      $this.finish();
    }
  },
  
  startTimer: function() {
    this.timer = this.step.periodical((1000 / this.options.fps).round(), this);
    return this;
  },
  
  stopTimer: function() {
    if (this.timer) {
      this.timer.stop();
    }
    return this;
  }
  
  
});