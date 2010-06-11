/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var agent = navigator.userAgent, looks_like_ie = 'attachEvent' in WIN, looks_like_opera = 'opera' in WIN,

Browser = RightJS.Browser = {
  IE:           looks_like_ie && !looks_like_opera,
  Opera:        looks_like_opera,
  WebKit:       agent.include('AppleWebKit/'),
  Gecko:        agent.include('Gecko') && !agent.include('KHTML'),
  MobileSafari: /Apple.*Mobile.*Safari/.test(agent),
  Konqueror:    agent.include('Konqueror'),

  // marker for the browsers which don't give access to the HTMLElement unit
  OLD:          looks_like_ie && !looks_like_opera && !DOC.querySelector
};