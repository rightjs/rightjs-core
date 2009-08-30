/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
self.Browser = (function(agent) {
  return   {
    IE:           !!(window.attachEvent && !window.opera),
    Opera:        !!window.opera,
    WebKit:       agent.indexOf('AppleWebKit/') > -1,
    Gecko:        agent.indexOf('Gecko') > -1 && agent.indexOf('KHTML') < 0,
    MobileSafari: !!agent.match(/Apple.*Mobile.*Safari/),
    Konqueror:    agent.indexOf('Konqueror') > -1,

    // marker for the browsers which don't give access to the HTMLElement unit
    OLD:          agent.indexOf('MSIE 6') > -1 || agent.indexOf('MSIE 7') > -1,
    IE8:          agent.indexOf('MSIE 8') > -1
  }
})(navigator.userAgent);