/**
 * The String class unit-test
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
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
    "<script>\nalert('bla');\n\n\n</script> asdf <script>\talert('foo');</script>".stripScripts(
      function(source) { scripts = source;
    });
    this.assertEqual("alert('bla');\nalert('foo');\n", scripts);
  },
  
  testExtractScripts: function() {
    this.assertEqual(
      "alert('bla');\nalert('foo');",
      "<script>\nalert('bla');\n\n\n</script> asdf <script>\talert('foo');</script>".extractScripts().trim()
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
    this.assertEqual('_asdfAsdfASDf', '_asdf_asdf_ASDf'.camelize());
    
    this.assertEqual('фываФываФыва', 'фыва_фыва_фыва'.camelize());
    this.assertEqual('фываФываФыва', 'фыва-фыва-фыва'.camelize());
    this.assertEqual('_фываФываФЫВА', '_фыва_фыва_ФЫВА'.camelize());
  },
  
  testUnderscored: function() {
    this.assertEqual('asdf_asdf_asdf', 'asdfAsdfAsdf'.underscored());
    this.assertEqual('asdf_asdf_ASDF', 'asdfAsdfASDF'.underscored());
    this.assertEqual('asdf_asdf_asdf', 'asdf-asdf-asdf'.underscored());
  },

  testCapitalize: function() {
    this.assertEqual('Asdf', 'asdf'.capitalize());
    this.assertEqual('Asdf Asdf', 'asdf asdf'.capitalize());
    this.assertEqual('Asdf-Asdf', 'asdf-asdf'.capitalize());
    this.assertEqual('Мама Мыла Раму', 'мама мыла раму'.capitalize());
    this.assertEqual('Мама-Мыла Раму', 'мама-мыла раму'.capitalize());
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
  
  testToFragment: function() {
    var string = '<div><b></b></div>asdfasdf<div>bla</div>';
    var fragment = string.toFragment();
    var div = document.createElement('div');
    div.appendChild(fragment);
    
    this.assertEqual(string.toLowerCase(), div.innerHTML.toLowerCase().replace(/\s+/mg, "")); // IE tries to wrap the elements
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
