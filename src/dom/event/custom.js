/**
 * custom events unit, used as a mediator for the artificial events handling in the generic observer
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Event.Custom = function(name, options) {
  this.type = name;
  this.stop = function() {};
  $ext(this, options || {});
};