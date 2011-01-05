/**
 * The old browsers support patch loading script
 * will be included in the core file when it's built
 * with the no-olds option
 *
 * Basically it just checks all the script tags on the page
 * finds the core inclusion tag and uses it's src attribute
 * to dynamically load the olds patch
 *
 * Copyright (C) 2009-2011 Nikolay V. Nemshilov
 */
if (RightJS.Browser.OLD) {
  document.write('<script src="' +
    RightJS.$A(document.getElementsByTagName('script')).last()
      .src.replace(/(^|\/)(right)([^\/]+)$/, '$1$2-olds$3') +
  '"></script>');
}
