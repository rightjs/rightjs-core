/**
 * iterators in-callbacks break exception
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Break = new Class(Error, {
  message: "Manual iterator break"
});