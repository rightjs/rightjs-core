/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
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
      fps:        Browser_IE ? 40 : 60,
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
    fx_register(this);
  },

  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (fx_add_to_queue(this, arguments)) { return this; }

    var options    = this.options,
        duration   = Fx.Durations[options.duration] || options.duration,
        transition = Fx.Transitions[options.transition] || options.transition,
        steps      = (duration / 1000 * this.options.fps).ceil(),
        interval   = (1000 / this.options.fps).round();

    fx_mark_current(this);

    this.prepare.apply(this, arguments);

    fx_start_timer(this, transition, interval, steps);

    return this.fire('start', this);
  },

  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    fx_stop_timer(this);
    fx_remove_from_queue(this);
    this.fire('finish');
    fx_run_next(this);
    return this;
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
    fx_stop_timer(this);
    fx_remove_from_queue(this);
    return this.fire('cancel');
  },

// protected
  // dummy method, should be implemented in a subclass
  prepare: dummy(),

  // dummy method, processes the element properties
  render: dummy()
}),

// global effects registry
scheduled_fx = [], running_fx = [];

/**
 * Registers the element in the effects queue
 *
 * @param Fx effect
 * @return void
 */
function fx_register(fx) {
  var uid = $uid(fx.element || {});
  fx.ch = (scheduled_fx[uid] = scheduled_fx[uid] || []);
  fx.cr = (running_fx[uid]   = running_fx[uid]   || []);
}

/**
 * Registers the effect in the effects queue
 *
 * @param Fx fx
 * @param Arguments original arguments list
 * @return boolean true if it queued and false if it's ready to go
 */
function fx_add_to_queue(fx, args) {
  var chain = fx.ch, queue = fx.options.queue;

  if (!chain || fx.$ch) {
    return (fx.$ch = false);
  }

  if (queue) {
    chain.push([args, fx]);
  }

  return queue && chain[0][1] !== fx;
}

/**
 * Puts the fx into the list of currently running effects
 *
 * @param Fx fx
 * @return void
 */
function fx_mark_current(fx) {
  if (fx.cr) {
    fx.cr.push(fx);
  }
}

/**
 * Removes the fx from the queue
 *
 * @param Fx fx
 * @return void
 */
function fx_remove_from_queue(fx) {
  var currents = fx.cr;
  if (currents) {
    currents.splice(currents.indexOf(fx), 1);
  }
}

/**
 * Tries to invoke the next effect in the queue
 *
 * @param Fx fx
 * @return void
 */
function fx_run_next(fx) {
  var chain = fx.ch, next = chain.shift();
  if ((next = chain[0])) {
    next[1].$ch = true;
    next[1].start.apply(next[1], next[0]);
  }
}

/**
 * Initializes the fx rendering timer
 *
 * @param Fx fx
 * @param Function transition stops calculator
 * @param Float interval
 * @param Integer number of steps
 * @return void
 */
function fx_start_timer(fx, transition, interval, steps) {
  var number = 1;
  fx._timer = setInterval(function() {
    if (number > steps) {
      fx.finish();
    } else {
      fx.render(transition(number/steps));
      number ++;
    }
  }, interval);
}

/**
 * Cancels the Fx rendering timer (if any)
 *
 * @param Fx fx
 * @return void
 */
function fx_stop_timer(fx) {
  if (fx._timer) {
    clearInterval(fx._timer);
  }
}
