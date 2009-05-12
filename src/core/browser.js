/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
self.Browser = self.Browser || {};
$ext(Browser, {
  IE:           !!(window.attachEvent && !window.opera),
  Opera:        !!window.opera,
  WebKit:       navigator.userAgent.indexOf('AppleWebKit/') > -1,
  Gecko:        navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
  MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
  Konqueror:    navigator.userAgent.indexOf('Konqueror') != -1,
  
  // marker for the browsers which don't give access to the HTMLElement unit
  OLD:          navigator.userAgent.indexOf('MSIE 6') != -1 || navigator.userAgent.indexOf('MSIE 7') != -1
});