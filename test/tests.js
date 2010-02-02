/**
 * this script builds and runs all the tests
 */
var tests = {
  UtilTest:              'core/util_test',
                          
  BrowserTest:           'core/browser_test',
  ClassTest:             'core/class_test',
                          
  ObjectTest:            'lang/object_test',
  MathTest:              'lang/math_test',
  ArrayTest:             'lang/array_test',
  StringTest:            'lang/string_test',
  FunctionTest:          'lang/function_test',
  NumberTest:            'lang/number_test',
  RegexpTest:            'lang/regexp_test',
                          
  EventTest:             'dom/event_test',
                          
  ElementTest:           'dom/element_test',
  ElementStylesTest:     'dom/element/styles_test',
  ElementCommonsTest:    'dom/element/commons_test',
  ElementStructsTest:    'dom/element/structs_test',
  ElementDimensionsTest: 'dom/element/dimensions_test',
  ElementEventsTest:     'dom/element/events_test',
                          
  SelectorTest:          'dom/selector_test',
                          
  FormTest:              'dom/form_test',
  FormElementTest:       'dom/form/element_test',
                          
  DomReadyTest:          'dom/ready_test',
  WindowTest:            'dom/window_test',
                          
  OptionsTest:           'util/options_test',
  ObserverTest:          'util/observer_test',
                          
  CookieTest:            'util/cookie_test',
                          
  XhrTest:               'xhr/xhr_test',
  XhrIFramedTest:        'xhr/xhr_iframed_test',
                          
  FxTest:                'fx/fx_test',
  FxMorphTest:           'fx/fx/morph_test'
};

var test_names = [];
for (var key in tests) {
  test_names.push(key);
  document.writeln('<scr'+'ipt type="text/javascript" src="unit/'+tests[key]+'.js"></scr'+'ipt>');
}

window.onload = function() {
  eval('new TestSuite('+test_names.join(',')+').run()');
}