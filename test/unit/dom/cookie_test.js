/**
 * The Cookie class test
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var CookieTest = TestCase.create({
  name: 'CookieTest'
});

// local cookies sometimes don't work on IE, and probably might be switched off in any browser
if (TestCaseUtil.Cookie.enabled()) {
  CookieTest.extend({
    setUp: function() {
      this.tearDown();
    },

    tearDown: function() {
      var date = new Date();
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000);

      document.cookie = 'rjs_test=; expires='+date.toGMTString();
    },

    testInstance: function() {
      var cook = new Cookie('boo', {duration: 5});

      this.assertEqual('boo', cook.name);
      this.assertEqual(false, cook.options.secure);
      this.assertSame(document, cook.options.document);
      this.assertEqual(5, cook.options.duration);
    },

    testInstanceSet: function() {
      var cook = new Cookie('rjs_test');

      this.assertSame(cook, cook.set('value'));
      this.assert(document.cookie.indexOf('rjs_test=value') != -1)
    },

    testInstanceSetEscape: function() {
      new Cookie('rjs_test').set('asdf?%# ведмед');

      this.assert(document.cookie.indexOf('rjs_test=asdf%3F%25%23%20%D0%B2%D0%B5%D0%B4%D0%BC%D0%B5%D0%B4') != -1);
    },

    testInstanceGet: function() {
      var cook = new Cookie('rjs_test');

      this.assertNull(cook.get());

      document.cookie = 'rjs_test=test_value';

      this.assertEqual('test_value', cook.get());
    },

    testInstanceGetUnescape: function() {
      document.cookie = 'rjs_test=asdf%3F%25%23%20%D0%B2%D0%B5%D0%B4%D0%BC%D0%B5%D0%B4';

      this.assertEqual('asdf?%# ведмед', new Cookie('rjs_test').get());
    },

    testInstanceRemove: function() {
      document.cookie = 'rjs_test=test_value';

      var cook = new Cookie('rjs_test');

      this.assertSame(cook, cook.remove());
      this.assert(document.cookie.indexOf('rjs_test=test_value') == -1);
    },

    testClassSet: function() {
      var cook = Cookie.set('rjs_test', 'test_value', {duration: 5});

      this.assertInstanceOf(Cookie, cook);
      this.assertEqual('rjs_test', cook.name);
      this.assertEqual(5, cook.options.duration);

      this.assert(document.cookie.indexOf('rjs_test=test_value') != -1);
    },

    testClassGet: function() {
      this.assertNull(Cookie.get('rjs_test'));

      document.cookie = 'rjs_test=test_value';

      this.assertEqual('test_value', Cookie.get('rjs_test'));
    },

    testClassRemove: function() {
      document.cookie = 'rjs_test=test_value';

      var cook = Cookie.remove('rjs_test');

      this.assertInstanceOf(Cookie, cook);
      this.assertEqual('rjs_test', cook.name);

      this.assert(document.cookie.indexOf('rjs_test=test_value') == -1);
    },

    testEnabled: function() {
      this.assert(Cookie.enabled());
    }
  });
}
