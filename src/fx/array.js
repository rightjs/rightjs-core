/**
 * Here are the Array class extensions depend on the fx library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, {
  /**
   * converts the array into a string rgb(R,G,B) definition
   *
   * @return String rgb(DDD, DDD, DDD) value
   */
  toRgb: function() {
    return 'rgb('+this.map(Math.round)+')';
  }
});