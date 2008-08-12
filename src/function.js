/**
 * The Function class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Object.extend(Function.prototype, {
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    if (arguments.length < 2 && !defined(arguments[0])) { return this; }
    
    var _method = this, args = $A(arguments), scope = args.shift();
    return function() {
      return _method.apply(scope, args.concat($A(arguments)));
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
    var _method = this, args = $A(arguments), scope = args.shift();
    return function(event) {
      return _method.apply(scope, [event || window.event].concat(args).concat($A(arguments)));
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
    return this.bind.apply(this, [this].concat($A(arguments)));
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
    var args = $A(arguments), timeout = args.shift();
    return window.setTimeout(this.bind.apply(this, [this].concat(args)), timeout);
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
    var args = $A(arguments); timeout = args.shift();
    return window.setInterval(this.bind.apply(this, [this].concat(args)), timeout);
  }
});