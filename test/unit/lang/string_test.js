/**
 * The String class unit-test
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var StringTest = TestCase.create({
  name: 'StringTest',

  testEmpty: function() {
    this.assert(''.empty());
    this.assertFalse(' '.empty());
  },

  testBlank: function() {
    this.assert(''.blank());
    this.assert(" \t\n ".blank());
    this.assertFalse(' s'.blank());
  },

  testTrim: function() {
    this.assert('asdf', " \t\nasdf\t\n\r \n".trim());
    this.assert('фыва', " \t\nфыва\t\n\r \n".trim());
  },

  testStripTags: function() {
    this.assertEqual('asdf фыва asdf', 'asdf <b>фыва</b><br/> <i>asdf</i>'.stripTags());
  },

  testStripScripts: function() {
    this.assertEqual('asdf <i>asdf</i>', "asdf<script>\n \t\nalert('фыва');</script> <i>asdf<script>asdf</script></i>".stripScripts());
  },

  testStripScriptsWithScriptsEval: function() {
    self.______called______ = false;
    "asdf <script>self.______called______ = true;</script>".stripScripts(true);
    this.assert(self.______called______);
    self.______called______ = undefined;
  },

  testStripScriptsWithScriptsExtraction: function() {
    var scripts = '';
    "<script>alert('bla');</script> asdf <script>alert('foo');</script>".stripScripts(
      function(source) { scripts = source; }
    );
    this.assertEqual("alert('bla');\nalert('foo');", scripts.trim());
  },

  testExtractScripts: function() {
    this.assertEqual(
      "alert('bla');\nalert('foo');",
      "<script>alert('bla');</script> asdf <script>alert('foo');</script>".extractScripts().trim()
    );
  },

  testEvalScripts: function() {
    self.______called______ = false;
    "asdf <script>self.______called______ = true;</script>".evalScripts();
    this.assert(self.______called______);
    self.______called______ = undefined;
  },

  testCamelize: function() {
    this.assertEqual('asdfAsdfAsdf', 'asdf_asdf_asdf'.camelize());
    this.assertEqual('asdfAsdfAsdf', 'asdf-asdf-asdf'.camelize());
    this.assertEqual('AsdfAsdfASDf', '_asdf_asdf_ASDf'.camelize());
  },

  testUnderscored: function() {
    this.assertEqual('asdf_asdf_asdf', 'asdfAsdfAsdf'.underscored());
    this.assertEqual('asdf_asdf_asdf', 'asdfAsdfASDF'.underscored());
    this.assertEqual('asdf_asdf_asdf', 'asdf-asdf-asdf'.underscored());
  },

  testCapitalize: function() {
    this.assertEqual('Asdf', 'asdf'.capitalize());
    this.assertEqual('Asdf asdf', 'asdf asdf'.capitalize());
    this.assertEqual('Asdf-asdf', 'asdf-asdf'.capitalize());
    this.assertEqual('Мама мыла раму', 'мама мыла раму'.capitalize());
    this.assertEqual('Мама-мыла раму', 'мама-мыла раму'.capitalize());
  },

  testDasherize: function() {
    this.assertEqual('asdf-asdf', 'asdfAsdf'.dasherize());
    this.assertEqual('asdf-asdf', 'asdf_asdf'.dasherize());
  },

  testIncludes: function() {
    this.assert('asdf sdfg dfg'.includes('sdf'));
    this.assertFalse('asdf sdfg df'.includes('qwer'));
  },

  testStartsWith: function() {
    this.assert('asdf sdf'.startsWith('asdf'));
    this.assertFalse('asdf sdf'.startsWith('Asdf'));

    this.assert('asdf sdf'.startsWith('Asdf', true), 'test checking with ignore case');
  },

  testEndsWith: function() {
    this.assert('asdf qwer'.endsWith('qwer'));
    this.assertFalse('asdf qwer'.endsWith('Qwer'));
    this.assertFalse('asdf'.endsWith('qwert'));

    this.assert('asdf qwer'.endsWith('Qwer', true), 'test checking with ignore case');
  },

  testToInt: function() {
    this.assertEqual(1, '1'.toInt());
    this.assertEqual(2, '2.2'.toInt());
    this.assert(isNaN('asdf'.toInt()));
  },

  testToFloat: function() {
    this.assertEqual(1.0, '1'.toFloat());
    this.assertEqual(2.2, '2.2'.toFloat());
    this.assertEqual(3.3, '3,3'.toFloat());
    this.assertEqual(4.4, '4-4'.toFloat());
    this.assertEqual(-4.4, '-4-4'.toFloat());
    this.assertEqual(4.0, '4-4'.toFloat(true));
    this.assert(isNaN('asdf'.toFloat()));
  },

  testToHex: function() {
    this.assertEqual('#FFFFFF', '#FFF'.toHex());
    this.assertEqual('#AABB88', '#AB8'.toHex());
    this.assertEqual('#ffffff', 'rgb(255,255,255)'.toHex());
    this.assertEqual('#000000', 'rgb(0, 0, 0)'.toHex());
  },

  testToRgb: function() {
    this.assertEqual('rgb(255,255,255)', '#FFF'.toRgb());
    this.assertEqual('rgb(0,0,0)', '#000000'.toRgb());

    this.assertEqual([170, 187, 204], '#ABC'.toRgb(true));
  }
});
