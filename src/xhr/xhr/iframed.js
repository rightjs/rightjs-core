/**
 * This unit presents a fake drop in replacement for the XmlHTTPRequest unit
 * but works with an iframe targeting in the background
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
Xhr.IFramed = new Class({
  include: Xhr.Dummy,
  
  /**
   * constructor
   *
   * @param Form form which will be submitted via the frame
   * @return void
   */
  initialize: function(form) {
    this.form = form;
    this.id   = 'xhr_'+ new Date().getTime();
    
    form.insert('<i><iframe name="'+this.id+'" id="'+this.id+
      '" width="0" height="0" frameborder="0" src="about:blank"></iframe></i>',
      'after');
      
    $(this.id).on('load', this.onLoad.bind(this));
  },
  
  send: function() {
    this.form.set('target', this.id).submit();
  },
  
  onLoad: function() {
    this.status       = 200;
    this.readyState   = 4;
    
    try {
      this.responseText = window[this.id].document.documentElement.innerHTML;
    } catch(e) { }
    
    this.onreadystatechange();
  }
});