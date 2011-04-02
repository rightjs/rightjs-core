/**
 * JSLint additional options
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var options = {};
var okays   = [
  '      current_Document.win()._.execScript(text);',
  '  return value != null && value.nodeType === 1;',
  '  return value != null && value.nodeType != null;',
  '      value != null && value.hasOwnProperty != null;',
  "    event.target != null && 'nodeType' in event.target && event.target.nodeType === 3 ?",
  '  if (object != null) {',
  '    return this == false;',
  'Do not use Number as a constructor.',
  "Expected a 'break' statement before 'case'.",
  "The Function constructor is eval.",
  'var RightJS = (function(window, document, Object, Array, String, Function, Number, Math, undefined) {'
];