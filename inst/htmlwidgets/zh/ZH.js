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

  var _row_outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  _row_outline.classList.add('zh-outline');
  _row_outline.hidden = true;

  var _svg;
  var _heatmap;
  
  var _plot = function(msg_) {
    _container.innerHTML = msg_.svg;

    _svg = document.getElementById('zh-svg');
    _svg.appendChild(_row_outline);

    _heatmap = document.getElementById('zh-heatmap');
    _heatmap.addEventListener('click', function(e){
      let ii = Math.floor(e.offsetX / msg_.pixel_width);
      let jj = Math.floor(e.offsetY / msg_.pixel_height);
      _row_outline.setAttribute('x', -0.5);
      _row_outline.setAttribute('y', -0.5 + jj * msg_.pixel_height);
      _row_outline.setAttribute('width', 1 + msg_.pixel_width * msg_.ncol);
      _row_outline.setAttribute('height', 1 + msg_.pixel_height);
      _row_outline.hidden = false;
    });
    
    // aways crop the svg to the bounding box plus a margin
    let svg = document.getElementById('zh-svg');
    let bbox = svg.getBBox();
    bbox.x -= ZH.MARGIN;
    bbox.y -= ZH.MARGIN;
    bbox.width += 2 * ZH.MARGIN;
    bbox.height += 2 * ZH.MARGIN;
    svg.setAttribute('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height].join(' '));
    svg.setAttribute('width', el_.clientWidth);
    svg.setAttribute('height', el_.clientHeight);
    svgPanZoom(_svg);
  };
  this.plot = _plot;
};
