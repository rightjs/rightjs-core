/**
 * The JSON export/import functionality test
 *
 * @copyright (C) 2009-2011 Nikolay Nemshilov
 */
var JsonTest = TestCase.create({
  name: "JsonTest",

  testNullToJSON: function() {
    this.assertEqual('null', JSON.stringify(null));
  },

  testStringToJSON: function() {
    this.assertEqual('"boo"',  JSON.stringify("boo"));

    this.assertEqual('"\\\\b"',  JSON.stringify("\\b"));
    this.assertEqual('"\\\\t"',  JSON.stringify("\\t"));
    this.assertEqual('"\\\\n"',  JSON.stringify('\\n'));
    this.assertEqual('"\\\\r"',  JSON.stringify('\\r'));
    this.assertEqual('"\\\\f"',  JSON.stringify('\\f'));
    this.assertEqual('"\\\\"', JSON.stringify('\\'));
    this.assertEqual('"\\""',  JSON.stringify('"'));

    this.assertEqual('"\\\\ufff0"', JSON.stringify("\\ufff0"));
    this.assertEqual('"\\\\uffff"', JSON.stringify("\\uffff"));
  },

  testDateToJSON: function() {
    var date = new Date();
    date.setMilliseconds(888);
    date.setSeconds(8);
    date.setMinutes(8);
    date.setHours(8);
    date.setDate(8);
    date.setMonth(8);
    date.setYear(2008);

    this.assertEqual('"2008-09-08T04:08:08.888Z"', JSON.stringify(date));
  },

  testNumberToJSON: function() {
    this.assertEqual('8', JSON.stringify(8));
    this.assertEqual('8.8', JSON.stringify(8.8));
    this.assertEqual('-8.8', JSON.stringify(-8.8));
  },

  testBooleanToJSON: function() {
    this.assertEqual('true',  JSON.stringify(true));
    this.assertEqual('false', JSON.stringify(false));
  },

  testArrayToJSON: function() {
    this.assertEqual('[1,2,3]', JSON.stringify([1,2,3]));
    this.assertEqual('["a","b","c"]', JSON.stringify(RightJS.$w('a b c')));

    this.assertEqual('["a",["b",["c"]]]', JSON.stringify(['a',['b',['c']]]));
  },

  testObjectToJson: function() {
    this.assertEqual('{"a":"a1","b":"b1"}', JSON.stringify({a:'a1',b:'b1'}));

    this.assertEqual(
      '{"a":[1,{"b":1}],"b":1,"c":false,"d":null,"e":{"f":"g"}}',
      JSON.stringify({a:[1,{b:1}],b:1,c:false,d:null,e:{f:'g'}})
    );
  },

  testJsonParse: function() {
    this.assertEqual(
      {a:[1,{b:1}],b:1,c:false,d:null,e:{f:'g'}},
      JSON.parse('{"a":[1,{"b":1}],"b":1,"c":false,"d":null,"e":{"f":"g"}}')
    );
  },

  testJsonParseError: function() {
    this.assertThrows(function() {
      JSON.parse('{123');
    })
  }
});