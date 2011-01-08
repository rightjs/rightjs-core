/**
 * This module the standard events delegation interface
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
[Element, Document].each('include', {
  /**
   * Attaches a delegative event listener to the element/document
   *
   * USAGE:
   *    $(element).delegate('click', '#css.rule', function() {...});
   *    $(element).delegate('click', '#css.rule', [func1, func2, ...]);
   *    $(element).delegate('click', '#css.rule', 'addClass', 'boo');
   *    $(element).delegate('click', '#css.rule', 'hide');
   *
   *    $(element).delegate('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * @param event name
   * @param css-rule a hash or rules
   * @param callback
   * @return this
   */
  delegate: function(event) {
    var rules = delegation_rules(arguments), css_rule, i, j, list;
    for (css_rule in rules) {
      for (i=0, list = rules[css_rule]; i < list.length; i++) {
        // registering the delegative listener
        this.on(event, build_delegative_listener(css_rule, list[i], this));

        // adding the css-rule and callback references to the store
        $ext(this.$listeners.last(), { dr: css_rule, dc: list[i][0] });
      }
    }

    return this;
  },

  /**
   * Removes a delegative event listener from the element
   *
   * USAGE:
   *    $(element).undelegate('click');
   *    $(element).undelegate('click', '#css.rule');
   *    $(element).undelegate('click', '#css.rule', function() {});
   *    $(element).undelegate('click', '#css.rule', [func1, func2, ...]);
   *    $(element).undelegate('click', '#css.rule', 'addClass', 'boo');
   *    $(element).undelegate('click', '#css.rule', 'hide');
   *
   *    $(element).undelegate('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * @param event name
   * @param css-rule or a hash or rules
   * @param callback
   * @return this
   */
  undelegate: function(event) {
    delegation_listeners(arguments, this).each(function(h) {
      this.stopObserving(h.n, h.f);
    }, this);

    return this;
  },

  /**
   * Checks if there is sucha delegative event listener
   *
   * USAGE:
   *    $(element).delegates('click');
   *    $(element).delegates('click', '#css.rule');
   *    $(element).delegates('click', '#css.rule', function() {});
   *    $(element).delegates('click', '#css.rule', [func1, func2, ...]);
   *    $(element).delegates('click', '#css.rule', 'addClass', 'boo');
   *    $(element).delegates('click', '#css.rule', 'hide');
   *
   *    $(element).delegates('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * NOTE:
   *    if several rules are specified then it will check if
   *    _any_ of them are delegateed
   *
   * @param event name
   * @param css-rule or a hash of rules
   * @param callback
   * @return boolean check result
   */
  delegates: function() {
    return !!delegation_listeners(arguments, this).length;
  }
});

/**
 * Builds the actual event listener that will delegate stuff
 * to other elements as they reach the element where the listener
 * attached
 *
 * @param String css rule
 * @param Arguments the original arguments list
 * @param Object scope
 * @return Function the actual event listener
 */
function build_delegative_listener(css_rule, entry, scope) {
  var args = $A(entry), callback = args.shift();
  return function(event) {
    var target = event.find(css_rule);
    return target === undefined ? target :
      typeof(callback) === 'string' ?
        target[callback].apply(target, args) :
        callback.apply(target, [event].concat(args));
  };
}

/**
 * Converts the events-delegation api arguments
 * into a systematic hash of rules
 *
 * @param Arguments arguments
 * @return Object hash of rules
 */
function delegation_rules(raw_args) {
  var args = $A(raw_args), rules = args[1] || {}, hash = {}, css_rule;

  if (isString(rules)) {
    hash[rules] = args.slice(2);
    if (isArray(hash[rules][0])) {
      hash[rules] = hash[rules][0].map(ensure_array);
    }
  } else {
    hash = rules;
  }

  // converting everything into a hash of lists of callbacks
  for (css_rule in hash) {
    hash[css_rule] = ensure_array(hash[css_rule]);
    hash[css_rule] = isArray(hash[css_rule][0]) ? hash[css_rule] : [hash[css_rule]];
  }

  return hash;
}

/**
 * Returns the list of delegative listeners that match the conditions
 *
 * @param Arguments raw-arguments
 * @param Element the element
 * @return Array list of matching listeners
 */
function delegation_listeners(args, object) {
  var event = args[0], i, list,
     rules = delegation_rules(args),
     rules_are_empty = !Object.keys(rules).length;

  return (object.$listeners || []).filter(function(hash) {
    return hash.dr && hash.n === event && (
      rules_are_empty || (function() {
        for (var css_rule in rules) {
          if (hash.dr === css_rule) {
            for (i=0, list = rules[css_rule]; i < list.length; i++) {
              if (!list[i].length || list[i][0] === hash.dc) {
                return true;
              }
            }
          }
        }

        return false;
      })()
    );
  });
}
