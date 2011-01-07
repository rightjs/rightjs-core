/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Class = RightJS.Class = function() {
  var args   = $A(arguments).slice(0,2),
      props  = args.pop() || {},
      parent = args.pop(),
      klass  = arguments[2], // you can send your own klass as the third argument
      SKlass = function() {};

  // if the parent class only was specified
  if (!args.length && !isHash(props)) {
    parent = props; props = {};
  }

// !#server:begin
  if (!klass && parent && (parent === Wrapper || parent.ancestors.include(Wrapper))) {
    klass = Wrapper_makeKlass();
  }
// !#server:end

  // defining the basic klass function
  klass = $ext(klass || function() {
    Class_checkPrebind(this);
    return 'initialize' in this ?
      this.initialize.apply(this, arguments) :
      this;
  }, Class_Methods);

  // handling the inheritance
  parent = parent || Class;

  SKlass.prototype = parent.prototype;
  klass.prototype  = new SKlass();
  klass.parent     = parent;
  klass.prototype.constructor = klass;

  // collecting the list of ancestors
  klass.ancestors = [];
  while (parent) {
    klass.ancestors.push(parent);
    parent = parent.parent;
  }

  // handling the module injections
  ['extend', 'include'].each(function(name) {
    if (name in props) {
      klass[name].apply(klass, ensure_array(props[name]));
    }
  });

  return klass.include(props);
},

/**
 * Class utility methods
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
Class_Methods = {
  /**
   * this method will extend the class-level with the given objects
   *
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   *
   * NOTE: this method _WILL_NOT_OVERWRITE_ the class prototype and
   *       the class 'name' and 'parent' attributes. If one of those
   *       exists in one of the received modeuls, the attribute will be
   *       skipped
   *
   * @param Object module to extend
   * ....
   * @return Class the klass
   */
  extend: function() {
    $A(arguments).filter(isHash).each(function(module) {
      $ext(this, Class_clean_module(module, true));
      Class_handle_module_callbacks(this, module, true);
    }, this);

    return this;
  },

  /**
   * extends the class prototype with the given objects
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   * NOTE: this method _WILL_NOT_OVERWRITE_ the 'klass' attribute of the klass.prototype
   *
   * @param Object module to include
   * ....
   * @return Class the klass
   */
  include: function() {
    var klasses = [this].concat(this.ancestors);

    $A(arguments).filter(isHash).each(function(module) {
      Object.each(Class_clean_module(module, false), function(name, method) {
        // searching for the super-method
        for (var super_method, i=0; i < klasses.length; i++) {
          if (name in klasses[i].prototype) {
            super_method = klasses[i].prototype[name];
            break;
          }
        }

        this.prototype[name] = isFunction(method) && isFunction(super_method) ?
          function() {
            this.$super = super_method;
            return method.apply(this, arguments);
          } : method;
      }, this);

      Class_handle_module_callbacks(this, module, false);
    }, this);

    return this;
  }
},

Class_module_callback_names = $w('selfExtended self_extended selfIncluded self_included extend include');

// hooking up the class-methods to the root class
$ext(Class, Class_Methods);
Class.prototype.$super = undefined;

function Class_clean_module(module, extend) {
  return Object.without.apply(Object, [module].concat(
    Class_module_callback_names.concat( extend ?
      $w('prototype parent ancestors') : ['constructor']
    )
  ));
}

function Class_handle_module_callbacks(klass, module, extend) {
  (module[Class_module_callback_names[extend ? 0 : 2]] ||
   module[Class_module_callback_names[extend ? 1 : 3]] ||
   function() {}
  ).call(module, klass);
}

/**
 * This method gets through a list of the object its class and all the ancestors
 * and finds a hash named after property, used for configuration purposes with
 * the Observer and Options modules
 *
 * NOTE: this method will look for capitalized and uppercased versions of the
 *       property name
 *
 * @param Object a class instance
 * @param String property name
 * @return Object hash or null if nothing found
 */
function Class_findSet(object, property) {
  var upcased   = property.toUpperCase(),
    constructor = object.constructor,
    candidates  = [object, constructor].concat(constructor.ancestors || []),
    i = 0;

  for (; i < candidates.length; i++) {
    if (upcased in candidates[i]) {
      return candidates[i][upcased];
    } else if (property in candidates[i]) {
      return candidates[i][property];
    }
  }

  return null;
}

/**
 * Handles the 'prebind' feature for Class instances
 *
 * @param Class instance
 * @return void
 */
function Class_checkPrebind(object) {
  if ('prebind' in object && isArray(object.prebind)) {
    object.prebind.each(function(method) {
      object[method] = object[method].bind(object);
    });
  }
}