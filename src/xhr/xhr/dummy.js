/**
 * A dummy XmlHTTPRequest interface to be used in other
 * fake requests
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Xhr.Dummy = {
  open:               function() {},
  abort:              function() {},
  setRequestHeader:   function() {},
  onreadystatechange: function() {}
};
