/**
 * The Function class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Function.include({
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function() {
      return func.apply(scope, (args.length || arguments.length) ? args.concat($A(arguments)) : args);
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
    var args = $A(arguments), scope = args.shift(), func = this;
    return function(event) {
      return func.apply(scope, [event].concat(args).concat($A(arguments)));
    };
  },

  /**
   * allows you to put some curry in your cookery
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  curry: function() {
    return this.bind.apply(this, [this].concat($A(arguments)));
  },
  
  /**
   * The right side curry feature
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  rcurry: function() {
    var curry = $A(arguments), func = this;
    return function() {
      return func.apply(func, $A(arguments).concat(curry));
    };
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
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setTimeout(this.bind.apply(this, [this].concat(args)), timeout));

    timer.cancel = function() { clearTimeout(this); };

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
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setInterval(this.bind.apply(this, [this].concat(args)), timeout));

    timer.stop = function() { clearInterval(this); };

    return timer;
  },
  
  /**
   * Chains the given function after the current one
   *
   * @param Function the next function
   * @param mixed optional value to curry
   * ......
   * @return Function chained function
   */
  chain: function() {
    var args = $A(arguments), func = args.shift(), current = this;
    return function() {
      var result = current.apply(current, arguments);
      func.apply(func, args);
      return result;
    };
  }
});