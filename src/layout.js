/**
 * The basic layout for RightJS builds
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var RightJS = (function() {
  
#{source_code}

  // globalizing the top-level variables
  $ext(window, Object.without(RightJS, 'version', 'modules'));
  
  return RigthJS;
});