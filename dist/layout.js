/**
 * The basic layout for RightJS builds
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var RightJS = (function(window, document, Object, Array, String, Function, Number, Math) {

%{source_code}

// globalizing the top-level variables
$ext(window, Object.without(RightJS, 'version', 'modules'));

return RightJS;
})(window, document, Object, Array, String, Function, Number, Math);
