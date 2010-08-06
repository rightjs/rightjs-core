/**
 * The server-side CommonJS builds layout
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
%{source_code}
  
if (exports) {
  RightJS.$ext(exports,
    Object.without(RightJS, 'version', 'modules')
  );
}