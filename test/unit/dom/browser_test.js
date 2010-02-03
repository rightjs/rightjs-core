/**
 * The Browser unit test-case
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var BrowserTest = TestCase.create({
  name: "BrowserTest",
  
  testIE: function() {
    this.assertEqual(this.util.Browser.IE, Browser.IE);
  },
  
  testOpera: function() { 
    this.assertEqual(this.util.Browser.Opera, Browser.Opera);
  },
  
  testWebKit: function() {
    this.assertEqual(this.util.Browser.WebKit, Browser.WebKit);
  },
  
  testGecko: function() {
    this.assertEqual(this.util.Browser.Gecko, Browser.Gecko);
  },
  
  testMobileSafari: function() {
    this.assertEqual(this.util.Browser.MobileSafari, Browser.MobileSafari);
  },
  
  testKonqueror: function() {
    this.assertEqual(this.util.Browser.Konqueror, Browser.Konqueror);
  }
});