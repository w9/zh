var ZH = ZH || {};

ZH.PIXEL_WIDTH_WITH_TEXT = 20;
ZH.PIXEL_HEIGHT_WITH_TEXT = 20;
ZH.LABEL_MARGIN = 10;
ZH.MARGIN = 20;

ZH.ZH = function(el_) {
  el_.classList.add('scrollable');

  var _container = document.createElement('div');
  _container.id = 'zh-container';
  el_.appendChild(_container);
  
  var _svg = SVG(_container);
  _svg.node.id = 'zh-svg';
  
  var _heatmap;
  var _rowlabels;
  var _collabels;
  
  var _plot = function(msg_) {
    let pixel_height = msg_.pixel_height;;
    let pixel_width = msg_.pixel_width;;
    
    if (msg_.display_colnames && typeof msg_.colnames !== 'undefined') {
      _collabels = _svg.group().addClass('zh-rotate');
      for (let i in msg_.colnames) {
        let n = msg_.colnames[i];
        let collabel = _collabels.plain(n)
                                 .attr('x', - ZH.LABEL_MARGIN)
                                 .attr('y', - (parseInt(i) + 0.5) * ZH.PIXEL_WIDTH_WITH_TEXT)
                                 .attr('font-family', null)
                                 .addClass('zh-label');
      }
      pixel_width = ZH.PIXEL_WIDTH_WITH_TEXT;
    }
    
    if (msg_.display_rownames && typeof msg_.rownames !== 'undefined') {
      _rowlabels = _svg.group();
      for (let i in msg_.rownames) {
        let n = msg_.rownames[i];
        let rowlabel = _rowlabels.plain(n)
                                 .attr('x', -ZH.LABEL_MARGIN)
                                 .attr('y', (parseInt(i) + 0.5) * ZH.PIXEL_HEIGHT_WITH_TEXT)
                                 .attr('font-family', null)
                                 .addClass('zh-label');
      }
      pixel_height = ZH.PIXEL_HEIGHT_WITH_TEXT;
    }
    
    _heatmap = _svg.image()
                   .attr('x', 0)
                   .attr('y', 0)
                   .attr('width', msg_.ncol * pixel_width)
                   .attr('height', msg_.nrow * pixel_height)
                   .attr('href', msg_.base64)
                   .attr('preserveAspectRatio', 'none')
                   .attr('image-rendering', 'pixelated');

    _svg.rect();
    
    // aways crop the svg to the bounding box plus a margin
    let bbox = _svg.node.getBBox();
    bbox.x -= ZH.MARGIN;
    bbox.y -= ZH.MARGIN;
    bbox.width += 2 * ZH.MARGIN;
    bbox.height += 2 * ZH.MARGIN;
    _svg.viewbox(bbox);
    _svg.size(bbox.width, bbox.height);
  };
  this.plot = _plot;
};
