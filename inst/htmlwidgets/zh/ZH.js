var ZH = ZH || {};

ZH.ZH = function(el_) {
  el_.classList.add('scrollable');
  
  var _heatmap_display = new Image();
  _heatmap_display.id = 'heatmap-display';
  el_.appendChild(_heatmap_display);
  
  var _plot = function(msg_) {
    _heatmap_display.width = msg_.ncol * msg_.pixel_width;
    _heatmap_display.height = msg_.nrow * msg_.pixel_height;
    _heatmap_display.src = msg_.base64;
  };
  this.plot = _plot;
};