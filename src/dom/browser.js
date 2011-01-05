/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
var agent = navigator.userAgent,
    Browser_Opera = 'opera' in window,
    Browser_IE    = 'attachEvent' in window && !Browser_Opera,

Browser = RightJS.Browser = {
  IE:           Browser_IE,
  Opera:        Browser_Opera,
  WebKit:       agent.include('AppleWebKit/'),
  Gecko:        agent.include('Gecko') && !agent.include('KHTML'),
  MobileSafari: /Apple.*Mobile.*Safari/.test(agent),
  Konqueror:    agent.include('Konqueror'),

  // marker for the browsers which require the olds module
  OLD:          !document.querySelector
};
