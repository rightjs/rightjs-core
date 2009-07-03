/**
 * this script builds and runs all the tests
 */
var tests = {
  UtilTest:              'unit/core/util_test.js',
  
  BrowserTest:           'unit/core/browser_test.js',
  ClassTest:             'unit/core/class_test.js',
  
  ObjectTest:            'unit/lang/object_test.js',
  MathTest:              'unit/lang/math_test.js',
  ArrayTest:             'unit/lang/array_test.js',
  StringTest:            'unit/lang/string_test.js',
  FunctionTest:          'unit/lang/function_test.js',
  NumberTest:            'unit/lang/number_test.js',
  RegexpTest:            'unit/lang/regexp_test.js',
  
  EventTest:             'unit/dom/event_test.js',
  EventBaseTest:         'unit/dom/event/base_test.js',
  EventMouseTest:        'unit/dom/event/mouse_test.js',
  EventKeyboardTest:     'unit/dom/event/keyboard_test.js',
  
  ElementTest:           'unit/dom/element_test.js',
  ElementStylesTest:     'unit/dom/element/styles_test.js',
  ElementCommonsTest:    'unit/dom/element/commons_test.js',
  ElementStructsTest:    'unit/dom/element/structs_test.js',
  ElementDimensionsTest: 'unit/dom/element/dimensions_test.js',
  ElementEventsTest:     'unit/dom/element/events_test.js',
  
  SelectorTest:          'unit/dom/selector_test.js',
  SelectorAtomTest:      'unit/dom/selector/atom_test.js',
  SelectorManualTest:    'unit/dom/selector/manual_test.js',
  SelectorMultipleTest:  'unit/dom/selector/multiple_test.js',
  
  FormTest:              'unit/dom/form_test.js',
  FormElementTest:       'unit/dom/form/element_test.js',
  
  DomReadyTest:          'unit/dom/ready_test.js',
  
  OptionsTest:           'unit/util/options_test.js',
  ObserverTest:          'unit/util/observer_test.js',
  
  XhrTest:               'unit/xhr/xhr_test.js',
  XhrIFramedTest:        'unit/xhr/xhr_iframed_test.js',
  
  FxTest:                'unit/fx/fx_test.js',
  FxMorphTest:           'unit/fx/fx/morph_test.js'
};

var test_names = [];
for (var key in tests) {
  document.writeln('<scr'+'ipt type="text/javascript" src="'+tests[key]+'"></scr'+'ipt>');
  test_names.push(key);
}

window.onload = function() {
  eval('new TestSuite('+test_names.join(',')+').run()');
}
