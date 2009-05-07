/**
 * the Regexp unit tests
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var RegexpTest = TestCase.create({
  name: 'RegexpTest',
  
  testEscape: function() {
    this.assertEqual('\\.\\*\\+\\?\\^\\=\\!\\:\\$\\{\\}\\(\\)\\|\\[\\]\\/\\\\', RegExp.escape(".*+?^=!:${}()|[]/\\"));
  }
})