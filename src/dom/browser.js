/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Browser = (function(agent, win, attEv, opera) {
  
  return   {
    IE:           attEv in win && !(opera in win),
    Opera:        opera in win,
    WebKit:       agent.indexOf('AppleWebKit/') > -1,
    Gecko:        agent.indexOf('Gecko') > -1 && agent.indexOf('KHTML') < 0,
    MobileSafari: /Apple.*Mobile.*Safari/.test(agent),
    Konqueror:    agent.indexOf('Konqueror') > -1,

    // marker for the browsers which don't give access to the HTMLElement unit
    OLD:          attEv in win && !(opera in win) && !document.querySelector
  }
})(navigator.userAgent, window, 'attachEvent', 'opera');