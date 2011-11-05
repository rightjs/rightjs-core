/**
 * DOM Element data attributes methods
 *
 * Credits:
 *   Most of the naming system in the module inspired by
 *     - Jquery (http://jquery.com)   Copyright (C) The jQuery Project
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * common data storage for element
   */
  _data: {},

  /**
   * data-from-attributes loaded flag
   */
  _dataLoaded: false,

  /**
   * sets or gets data value
   *
   * @param String data key
   * @param mixed data value
   * @return data value
   */
  data: function(key, value) {
    if (value == undefined) {
      return this.readData(key);
    } else {
      return this.writeData(key, value);
    }
  },

  /**
   * checks if data exists
   *
   * @param String data key
   * @return true or false
   */
  hasData: function(key) {
    return this.readData(key) !== undefined;
  },

  /**
   * reads data and returns data value
   *
   * @param String data key
   * @return data value or undefined
   */
  readData: function(key) {
    this.loadData();

    if (key == undefined || key.blank()) {
      return this._data;
    } else {
      var segments = key.split('-');
      var data = this._data;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i]
        data = data[segment];
        if (data == undefined) break;
      }

      return data;
    }
  },

  /**
   * writes value to data object
   *
   * @param String data key
   * @param mixed data value
   * @return data value
   */
  writeData: function(key, value) {
    if (value !== undefined) {
      this.loadData();

      var segments = key.split('-');
      var last = segments.pop();
      var data = {};
      var data_ptr = data;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i]
        data_ptr[segment] = {};
        data_ptr = data_ptr[segment];
      }
      data_ptr[last] = value

      this._data = RightJS.Object.merge(this._data, data);
      return value;
    }
  },

  /**
   * removes data from data object by key
   *
   * @param String data key
   * @return removed data value or undefined
   */
  removeData: function(key) {
    this.loadData();

    if (key == undefined || key.blank()) {
      var value = this._data
      this._data = {};
      return value;
    } else {
      var segments = key.split('-');
      var last = segments.pop();
      var data = this._data;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i]
        data = data[segment];
        if (data == undefined) break;
      }

      if (data !== undefined) {
        var value = data[last]
        delete data[last];
        return value;
      }
    }
  },

  /**
   * loads data hash from DOM element attributes
   *
   * @return Element self
   */
  loadData: function() {
    if (!this._dataLoaded) {
      this._dataLoaded = true;

      var rbrace = /^(?:\{.*\}|\[.*\])$/;
      var attr = this._.attributes;

      for (var i = 0, l = attr.length; i < l; i++) {
        var name = attr[i].name;

        if (name.startsWith('data-')) {
          var data = this.get(name);
          var value;

          if (RightJS.isString(data)) {
            try {
              value = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null :
                RightJS.isNumber(data.toFloat()) ? data.toFloat() :
                rbrace.test(data) ? new Function("return " + (data || '{}'))() :
                data;
            } catch( e ) {}
          }

          this.writeData(name.substring(5), value);
        }
      }
    }
    return this;
  }

});