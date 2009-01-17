/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
self.Browser = self.Browser || {};
Object.extend(Browser, {
  IE:           !!(window.attachEvent && !window.opera),
  Opera:        !!window.opera,
  WebKit:       navigator.userAgent.indexOf('AppleWebKit/') > -1,
  Gecko:        navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
  MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
  Konqueror:    navigator.userAgent.indexOf('Konqueror') != -1
});