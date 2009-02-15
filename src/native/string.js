/**
 * The String class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(String, {
  // this is for unicode regexps 
  UTF8_DOWNS: 'a-zàèìòùáéíóúýâêîôûãñõäëïöü¡¿çßøåæþðёйцукенгшщзхъфывапролджэячсмитьбю',
  UTF8_UPS: 'A-ZÀÈÌÒÙÁÉÍÓÚÝÂÊÎÔÛÃÑÕÄËÏÖÜ¡¿ÇØÅÆÞÐЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ'
});
$ext(String.prototype, {
  /**
   * checks if the string is an empty string
   *
   * @return boolean check result
   */
  empty: function() {
    return this == '';
  },
  
  /**
   * checks if the string contains only white-spaces
   *
   * @return boolean check result
   */
  blank: function() {
    return /^\s*$/.test(this);
  },
  
  /**
   * removes trailing whitespaces
   *
   * @return String trimmed version
   */
  trim: function() {
    return this.replace(/^\s+|\s+$/g, '');
  },
  
  /**
   * returns a copy of the string with all the tags removed
   * @return String without tags
   */
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/ig, '');
  },
  
  /**
   * removes all the scripts declarations out of the string
   * @param mixed option. If it equals true the scrips will be executed, 
   *                      if a function the scripts will be passed in it
   * @return String without scripts
   */
  stripScripts: function(option) {
    var scripts = '';
    var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/img, function(match, source) {
      scripts += source.trim() + "\n";
      return '';
    });
    
    if (option === true)
      eval(scripts);
    else if (isFunction(option))
      option(scripts, text);
    else if (isNumber(option))
      eval.bind(scripts).delay(options);
    
    return text;
  },
  
  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s,t) { scripts = s; });
    return scripts;
  },
  
  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    eval(this.extractScripts());
    return this;
  },
  
  /**
   * converts underscored or dasherized string to a camelized one
   * @returns String camelized version
   */
  camelize: function() {
    var prefix = this.match(/^(\-|_)+?/g) || ''; // <- keeps start dashes alive
    return prefix + this.substr(prefix.length, this.length).replace(
       new RegExp('(\\-|_)+?(\\D)', 'g'), function(match) {
         return match.replace(/\-|_/, '').toUpperCase();
      });
  },
  
  /**
   * converts a camelized or dasherized string into an underscored one
   * @return String underscored version
   */
  underscored: function() {
    return this.replace(/([a-z0-9])([A-Z]+)/g, function(match, first, second) {
      return first+"_"+(second.length > 1 ? second : second.toLowerCase());
    }).replace(/\-/g, '_');
  },

  /**
   * returns a capitalised version of the string
   *
   * @return String captialised version
   */
  capitalize: function() {
    return this.replace(new RegExp('(^|\\s|\\-|_)['+String.UTF8_DOWNS+']', 'g'), function(match) {
      return match.toUpperCase();
    });
  },
  
  /**
   * checks if the string contains the given substring
   *
   * @param String string
   * @return boolean check result
   */
  includes: function(string) {
    return this.indexOf(string) != -1;
  },
  
  /**
   * checks if the string starts with the given substring
   *
   * @param String string
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  startsWith: function(string, ignorecase) {
    var start_str = this.substr(0, string.length);
    return ignorecase ? start_str.toLowerCase() == string.toLowerCase() : 
      start_str == string;
  },
  
  /**
   * checks if the string ends with the given substring
   *
   * @param String substring
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  endsWith: function(string, ignorecase) {
    var end_str = this.substr(this.length - string.length, this.length);
    return ignorecase ? end_str.toLowerCase() == string.toLowerCase() :
      end_str == string;
  },
  
  /**
   * converts the string to an integer value
   * @param Integer base
   * @return Integer or NaN
   */
  toInt: function(base) {
    return parseInt(this, base || 10);
  },
  
  /**
   * converts the string to a float value
   * @param boolean flat if the method should not use a flexible matching
   * @return Float or NaN
   */
  toFloat: function(strict) {
    return parseFloat(strict ? this : this.replace(',', '.').replace(/(\d)-(\d)/g, '$1.$2'));
  },
  
  /**
   * converts the string into an insertable DocumentFramgent unit
   *
   * @return DocumentFragment node
   */
  toFragment: function() {
    var tmp = document.createElement('div');
    tmp.innerHTML = this;
    return Element.createFragment(tmp.childNodes);
  }
});
