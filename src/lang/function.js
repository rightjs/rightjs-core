/**
 * The Function class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Function.prototype, (function() {
  // creating a local reference to the method for a faster access
  var _A = Array.prototype.slice;
  
return {
  /**
  * binds the function to be executed in the given scope
  *
  * @param Object scope
  * @param mixed optional curry (left) argument
  * ....
  * @return Function binded function
  */
  bind: function() {
    if (arguments.length < 2 && !arguments[0]) return this;

    var slice = _A, args = slice.call(arguments), scope = args.shift(), func = this;
    return function() {
      return func.apply(scope, (args.length !== 0 || arguments.length !== 0) ? args.concat(slice.call(arguments)) : args);
    };
  },

  /**
  * binds the function as an event listener to the given scope object
  *
  * @param Object scope
  * @param mixed optional curry (left) argument
  * .......
  * @return Function binded function
  */
  bindAsEventListener: function() {
    var slice = _A, args = slice.call(arguments), scope = args.shift(), func = this;
    return function(event) {
      return func.apply(scope, [event || window.event].concat(args).concat(slice.call(arguments)));
    };
  },

  /**
  * allows you to put some curry in your cookery
  *
  * @param mixed value to curry
  * ....
  * @return Function carried function
  */
  curry: function() {
    return this.bind.apply(this, [this].concat(_A.call(arguments)));
  },

  /**
  * delays the function execution
  *
  * @param Integer delay ms
  * @param mixed value to curry
  * .....
  * @return Integer timeout marker
  */
  delay: function() {
    var args  = _A.call(arguments), timeout = args.shift();
    var timer = new Number(window.setTimeout(this.bind.apply(this, [this].concat(args)), timeout));

    timer['cancel'] = function() { window.clearTimeout(this); };

    return timer;
  },

  /**
  * creates a periodical execution of the function with the given timeout
  *
  * @param Integer delay ms
  * @param mixed value to curry
  * ...
  * @return Ineger interval marker
  */
  periodical: function() {
    var args  = _A.call(arguments), timeout = args.shift();
    var timer = new Number(window.setInterval(this.bind.apply(this, [this].concat(args)), timeout));

    timer['stop'] = function() { window.clearInterval(this); };

    return timer;
  }
}})());