/**
 * iterators in-callbacks break exception
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
var Break = RightJS.Break = new Class(Error, {
  message: "Manual iterator break"
});