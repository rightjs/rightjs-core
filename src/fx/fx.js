/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net) Copyright (C) Valerio Proietti
 *   The cubic bezier emulation is backported from
 *     - Lovely.IO (http://lovely.io) Copytirhgt (C) Nikolay Nemshilov
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
      fps:        IE8_OR_LESS ? 40 : 60,
      duration:   'normal',
      transition: 'default',
      queue:      true,
      engine:     'css'
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

    fx_mark_current(this);

    this.prepare.apply(this, arguments);

    fx_start_timer(this);

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
  prepare: function() {},

  // dummy method, processes the element properties
  render: function() {}
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
  var uid = $uid((fx.element || {})._ || {});
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
 * Cancels all currently running and scheduled effects
 * on the element
 *
 * @param Element element
 * @return void
 */
function fx_cancel_all(element) {
  var uid = $uid(element._);

  (running_fx[uid] || []).each('cancel');
  (scheduled_fx[uid] || []).splice(0);
}

/**
 * Initializes the fx rendering timer
 *
 * @param Fx fx
 * @return void
 */
function fx_start_timer(fx) {
  var options    = fx.options,
      duration   = Fx.Durations[options.duration] || options.duration,
      steps      = Math.ceil(duration / 1000 * options.fps),
      transition = Bezier_sequence(options.transition, steps),
      interval   = Math.round(1000 / options.fps),
      number     = 0;

  fx._timer = setInterval(function() {
    if (number === steps) {
      fx.finish();
    } else {
      fx.render(transition[number]);
      number++;
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


///////////////////////////////////////////////////////////////////////////////
// CSS3 Cubic Bezier sequentions emulator
// Backport from Lovely.IO (http://lovely.io)
// See also:
// http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
///////////////////////////////////////////////////////////////////////////////

// CSS3 cubic-bezier presets
var Bezier_presets = {
  'default':     '(.25,.1,.25,1)',
  'linear':      '(0,0,1,1)',
  'ease-in':     '(.42,0,1,1)',
  'ease-out':    '(0,0,.58,1)',
  'ease-in-out': '(.42,0,.58,1)',
  'ease-out-in': '(0,.42,1,.58)'
},

// Bezier loockup tables cache
Bezier_cache = {};

// builds a loockup table of parametric values with a given size
function Bezier_sequence(params, size) {
  params = Bezier_presets[params] || native_fx_functions[params] || params;
  params = params.match(/([\d\.]+)[\s,]+([\d\.]+)[\s,]+([\d\.]+)[\s,]+([\d\.]+)/);
  params = [0, params[1]-0, params[2]-0, params[3]-0, params[4]-0]; // cleaning up

  var name = params.join(',') + ',' + size, Cx, Bx, Ax, Cy, By, Ay, sequence, step, x;

  function bezier_x(t) { return t * (Cx + t * (Bx + t * Ax)); }
  function bezier_y(t) { return t * (Cy + t * (By + t * Ay)); }

  // a quick search for a more or less close parametric
  // value using several iterations by Newton's method

  function bezier_x_der(t) { // bezier_x derivative
    return Cx + t * (2*Bx + t * 3*Ax) + 1e-3;
  }
  function find_parametric(t) {
    var x=t, i=0, z;

    while (i < 5) {
      z = bezier_x(x) - t;

      if (Math.abs(z) < 1e-3) { break; }

      x = x - z/bezier_x_der(x);
      i++;
    }

    return x;
  }

  if (!(name in Bezier_cache)) {
    // defining bezier functions in a polynomial form (coz it's faster)
    Cx = 3 * params[1];
    Bx = 3 * (params[3] - params[1]) - Cx;
    Ax = 1 - Cx - Bx;

    Cy = 3 * params[2];
    By = 3 * (params[4] - params[2]) - Cy;
    Ay = 1 - Cy - By;


    // building the actual lookup table
    Bezier_cache[name] = sequence = [];
    x=0; step=1/size;

    while (x < 1.0001) { // should include 1.0
      sequence.push(bezier_y(find_parametric(x)));
      x += step;
    }
  }

  return Bezier_cache[name];
}