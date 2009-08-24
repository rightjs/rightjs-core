/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Fx = new Class(Observer, {
  extend: {
    EVENTS: $w('start finish cancel'),
    
    // named durations
    Durations: {
      'short':  200,
      'normal': 400,
      'long':   800
    },
    
    // default options
    Options: {
      fps:        60,
      duration:   'normal',
      transition: 'Sin',
      queue:      true
    },

    // list of basic transitions
    Transitions: {
      Sin: function(i)  {
        return -(Math.cos(Math.PI * i) - 1) / 2;
      },
      
      Cos: function(i) {
        return Math.asin((i-0.5) * 2)/Math.PI + 0.5;
      },
      
      Exp: function(i) {
        return Math.pow(2, 8 * (i - 1));
      },
      
      Log: function(i) {
        return 1 - Math.pow(2, - 8 * i);
      },
      
      Lin: function(i) {
        return i;
      }
    }
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);
    this.element = $(element);
  },
  
  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (this.queue(arguments)) return this;
    this.prepare.apply(this, arguments);
    
    this.transition = Fx.Transitions[this.options.transition] || this.options.transition;
    var duration    = Fx.Durations[this.options.duration]     || this.options.duration;
    
    this.steps  = (duration / 1000 * this.options.fps * (Browser.OLD ? 0.5 : 1)).ceil();
    this.number = 1;
    
    return this.fire('start', this).startTimer();
  },
  
  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().fire('finish').next();
  },
  
  /**
   * interrupts the transition
   *
   * @return Fx this
   */
  cancel: function() {
    return this.stopTimer().fire('cancel').next();
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
  // dummy method, should be implemented in a subclass
  prepare: function() {},

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
  
  // calculates the current value
  calc: function(start, end, delata) {
    return start + (end - start) * delta;
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
  },

  // handles effects queing
  // should return false if there's no queue and true if there is a queue
  queue: function(args) {
    if (!this.element) return false;
    if (this.$chained) {
      delete(this['$chained']);
      return false;
    }

    var uid = $uid(this.element), chain;
    if (!Fx.$chains)      Fx.$chains = {};
    if (!Fx.$chains[uid]) Fx.$chains[uid] = [];
    chain = Fx.$chains[uid];

    if (this.options.queue)
      chain.push([args, this]);
    
    this.next = function() {
      var next = chain.shift(); next = chain[0];
      if (next) {
        next[1].$chained = true;
        next[1].start.apply(next[1], next[0]);
      }
      return this;
    };

    return chain[0][1] !== this && this.options.queue;
  },
  
  next: function() {
    return this;
  }
  
  
});