/**
 * This unit presents a fake drop in replacement for the XmlHTTPRequest unit
 * but works with an iframe targeting in the background
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
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
    
    var id = 'xhr_frame_'+Math.random().toString().split('.').last();
    $E('div').insertTo(HTML).update('<iframe name="'+id+'" id="'+id+'" width="0" height="0" frameborder="0" src="about:blank"></iframe>');
    
    this.iframe = $(id);
    this.iframe.on('load', this.onLoad.bind(this));
  },
  
  send: function() {
    // stubbing the onsubmit method so it allowed us to submit the form
    var form         = this.form,
        old_onsubmit = form.onsubmit,
        old_target   = form.target;
    
    form.onsubmit = dummy();
    form.target   = this.iframe.id;
    
    form.submit();
    
    form.onsubmit = old_onsubmit;
    form.target   = old_target;
  },
  
  onLoad: function() {
    this.status       = 200;
    this.readyState   = 4;
    
    try {
      this.responseText = WIN[this.iframe.id].document.documentElement.innerHTML;
    } catch(e) { }
    
    this.onreadystatechange();
  }
});