/**
 * custom events unit, used as a mediator for the artificial events handling in the generic observer
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Event.Custom = function(name, options) {
  this.type = name;
  this.stop = function() {};
  $ext(this, options || {});
};