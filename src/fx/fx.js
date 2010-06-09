/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Fx = RightJS.Fx = new Class(Observer, {
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
      fps:        Browser.IE ? 40 : 60,
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
    },
    
    ch: [], // scheduled effects registries
    cr: []  // currently running effects registries
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);
    
    if ((this.element = element = $(element))) {
      var uid = $uid(element);
      this.ch = (Fx.ch[uid] = Fx.ch[uid] || []);
      this.cr = (Fx.cr[uid] = Fx.cr[uid] || []);
    }
  },
  
  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (this.queue(arguments)) return this;
    this.prepare.apply(this, arguments);
    
    var options = this.options,
        duration  = Fx.Durations[options.duration] || options.duration;
    this.transition = Fx.Transitions[options.transition] || options.transition;
    
    this.steps  = (duration / 1000 * this.options.fps).ceil();
    this.number = 1;
    
    if (this.cr) this.cr.push(this); // adding this effect to the list of currently active
    
    return this.fire('start', this).startTimer();
  },
  
  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().unreg().fire('finish').next();
  },
  
  /**
   * interrupts the transition
   *
   * NOTE:
   *   this method cancels all the scheduled effects
   *   in the element chain
   *
   * @return Fx this
   */
  cancel: function() {
    this.ch.clean();
    return this.stopTimer().unreg().fire('cancel');
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
  prepare: function(values) {},

  // dummy method, processes the element properties
  render: function(delta) {},
  
  // the periodically called method
  // NOTE: called outside of the instance scope!
  step: function(that) {
    if (that.number > that.steps) that.finish();
    else {
      if (!that.w) {
        that.w = true;
        that.render(that.transition(that.number / that.steps));
        that.w = false;
      }
      that.number ++;
    }
  },
  
  // starts the effect timer
  startTimer: function() {
    this.timer = this.step.periodical((1000 / this.options.fps).round(), this);
    return this;
  },
  
  // stops the effect timer
  stopTimer: function() {
    if (this.timer) {
      this.timer.stop();
    }
    return this;
  },

  // handles effects queing
  // should return false if there's no queue and true if there is a queue
  queue: function(args) {
    var chain = this.ch, queue = this.options.queue;
    
    if (!chain || this.$ch)
      return this.$ch = false;

    if (queue)
      chain.push([args, this]);
    
    return queue && chain[0][1] !== this;
  },
  
  // calls for the next effect in the queue
  next: function() {
    var chain = this.ch, next = chain.shift(), next = chain[0];
    if (next) {
      next[1].$ch = true;
      next[1].start.apply(next[1], next[0]);
    }
    return this;
  },
  
  // unregisters this effect out of the currently running list
  unreg: function() {
    var currents = this.cr;
    if (currents) currents.splice(currents.indexOf(this), 1);
    return this;
  }
  
});