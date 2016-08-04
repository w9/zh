var ZH = ZH || {};

ZH.PIXEL_WIDTH_WITH_TEXT = 20;
ZH.PIXEL_HEIGHT_WITH_TEXT = 20;
ZH.LABEL_MARGIN = 10;
ZH.MARGIN = 20;

ZH.ZH = function(el_) {
  el_.classList.add('scrollable');

  var _zoom_level = 3;

  var _container = document.createElement('div');
  _container.id = 'zh-container';
  el_.appendChild(_container);

  var _col_outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  _col_outline.classList.add('zh-outline');
  _col_outline.hidden = true;

  var _row_outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  _row_outline.classList.add('zh-outline');
  _row_outline.hidden = true;

  var _svg;
  var _heatmap;
  
  var _plot = function(msg_) {
    _container.innerHTML = msg_.svg;

    _svg = document.getElementById('zh-svg');
    _svg.appendChild(_row_outline);
    _svg.appendChild(_col_outline);
    _svg.addEventListener('click', function(e){
      _row_outline.hidden = true;
      _col_outline.hidden = true;
    });

    _heatmap = document.getElementById('zh-heatmap');
    _heatmap.addEventListener('click', function(e){
      let ii = Math.floor(e.offsetX / msg_.pixel_width);
      let jj = Math.floor(e.offsetY / msg_.pixel_height);

      _row_outline.setAttribute('x', -0.5);
      _row_outline.setAttribute('y', -0.5 + jj * msg_.pixel_height);
      _row_outline.setAttribute('width', 1 + msg_.pixel_width * msg_.ncol);
      _row_outline.setAttribute('height', 1 + msg_.pixel_height);
      _row_outline.hidden = false;

      _col_outline.setAttribute('x', -0.5 + ii * msg_.pixel_width);
      _col_outline.setAttribute('y', -0.5);
      _col_outline.setAttribute('width', 1 + msg_.pixel_width);
      _col_outline.setAttribute('height', 1 + msg_.pixel_height * msg_.nrow);
      _col_outline.hidden = false;

      e.stopPropagation();
    });
    
    // aways crop the svg to the bounding box plus a margin
    let svg = document.getElementById('zh-svg');
    let bbox = svg.getBBox();
    bbox.x -= ZH.MARGIN;
    bbox.y -= ZH.MARGIN;
    bbox.width += 2 * ZH.MARGIN;
    bbox.height += 2 * ZH.MARGIN;

    svg.setAttribute('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height].join(' '));
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    window.addEventListener('keydown', function(e){
      switch (e.key) {
        case '1': _zoom_level = 1; _resize(); break;
        case '2': _zoom_level = 2; _resize(); break;
        case '3': _zoom_level = 3; _resize(); break;
        case '4': _zoom_level = 4; _resize(); break;
      }
    });
  };

  var _resize = function() {
    switch (_zoom_level) {
      case 1:
        svg.setAttribute('width', bbox.width);
        svg.setAttribute('height', bbox.height);
        break;

      case 2:
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', bbox.height * svg.clientWidth / bbox.width);
        break;

      case 3:
        svg.setAttribute('width', '50%');
        svg.setAttribute('height', bbox.height * svg.clientWidth / bbox.width);
        break;

      case 4:
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', bbox.width * svg.clientWidth / bbox.height);
        break;
    }
  };

  this.plot = _plot;
  this.resize = _resize;
};
