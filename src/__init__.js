/**
 * The source code initialization script
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
include_sources_by_modules({
  core: [
    'right',

    // the core utils should be included before the language extentions
    'core/util',

    'lang/object',
    'lang/math',
    'lang/array',
    'lang/string',
    'lang/function',
    'lang/number',
    'lang/regexp',

    'core/class',
    'core/options',
    'core/observer'
  ],

  dom: [
    'dom/browser',
    'dom/wrapper',

    'dom/document',
    'dom/window',

    'dom/event',

    'dom/element',
    'dom/element/structs',
    'dom/element/styles',
    'dom/element/commons',
    'dom/element/dimensions',
    'dom/element/events',

    'dom/selector',
    'dom/ready'
  ],

  form: [
    'dom/form',
    'dom/input'
  ],

  // NOTE: this one should be after the 'form' module!
  events: [
    'dom/event/focusin',
    'dom/event/delegation'
  ],

  xhr: [
    'xhr/xhr',
    'xhr/form',
    'xhr/element',
    'xhr/xhr/dummy',
    'xhr/xhr/iframed',
    'xhr/xhr/jsonp'
  ],

  fx: [
    'fx/fx',
    'fx/string',
    'fx/element',
    'fx/fx/morph',
    'fx/fx/highlight',
    'fx/fx/twin',
    'fx/fx/slide',
    'fx/fx/fade',
    'fx/fx/attr',
    'fx/fx/scroll'
  ],

  cookie: [
    'dom/cookie'
  ],

  // the old browsers support hacks
  olds: [
    'olds/ie',
    'olds/events',
    'olds/konq',
    'olds/css'
  ]
});
