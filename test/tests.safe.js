/**
 * The safe-mode tests aggregator
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var tests = [
  'core_test',
  'lang_test'
];

for (var i=0, names=[]; i < tests.length; i++) {
  document.write('<script src="./safe/'+tests[i]+'.js"></script>');
  
  names.push(tests[i].replace(/(^|_)([a-z])/g, function(m,p,c) { return c.toUpperCase();}));
}

window.onload = function() {
  eval('new TestSuite('+names.join(',')+').run()');
}