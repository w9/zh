var ZH = ZH || {};

ZH.PIXEL_WIDTH_WITH_TEXT = 20;
ZH.PIXEL_HEIGHT_WITH_TEXT = 20;
ZH.LABEL_MARGIN = 10;
ZH.MARGIN = 20;

ZH.ZH = function(el_) {
  el_.classList.add('scrollable');

  var _zoom_level = 3;
  var _zoom_factor;
  var _bbox;

  var _container = document.createElement('div');
  _container.id = 'zh-container';
  el_.appendChild(_container);

  var _col_outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  _col_outline.classList.add('zh-outline');
  _col_outline.setAttribute('visibility', 'visible');

  var _row_outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  _row_outline.classList.add('zh-outline');
  _row_outline.setAttribute('visibility', 'visible');

  var _svg;
  var _heatmap;
  
  var _plot = function(msg_) {
    _container.innerHTML = msg_.svg;

    _svg = document.getElementById('zh-svg');
    _svg.appendChild(_row_outline);
    _svg.appendChild(_col_outline);
    window.addEventListener('dblclick', function(e){
      _row_outline.setAttribute('visibility', 'hidden');
      _col_outline.setAttribute('visibility', 'hidden');
    });

    _heatmap = document.getElementById('zh-heatmap');
    _heatmap.addEventListener('dblclick', function(e){
      let ii = Math.floor(e.offsetX / msg_.pixel_width);
      let jj = Math.floor(e.offsetY / msg_.pixel_height);

      _row_outline.setAttribute('x', -0.5);
      _row_outline.setAttribute('y', -0.5 + jj * msg_.pixel_height);
      _row_outline.setAttribute('width', 1 + msg_.pixel_width * msg_.ncol);
      _row_outline.setAttribute('height', 1 + msg_.pixel_height);
      _row_outline.setAttribute('visibility', 'visible');

      _col_outline.setAttribute('x', -0.5 + ii * msg_.pixel_width);
      _col_outline.setAttribute('y', -0.5);
      _col_outline.setAttribute('width', 1 + msg_.pixel_width);
      _col_outline.setAttribute('height', 1 + msg_.pixel_height * msg_.nrow);
      _col_outline.setAttribute('visibility', 'visible');

      e.stopPropagation();
    });
    
    // aways crop the svg to the bounding box plus a margin
    let svg = document.getElementById('zh-svg');
    _bbox = svg.getBBox();
    _bbox.x -= ZH.MARGIN;
    _bbox.y -= ZH.MARGIN;
    _bbox.width += 2 * ZH.MARGIN;
    _bbox.height += 2 * ZH.MARGIN;

    _svg.setAttribute('viewBox', [_bbox.x, _bbox.y, _bbox.width, _bbox.height].join(' '));
    _resize();

    window.addEventListener('keydown', function(e){
      switch (e.key) {
        case '1': _zoom_level = 1; _resize(); break;
        case '2': _zoom_level = 2; _resize(); break;
        case '3': _zoom_level = 3; _resize(); break;
        case '4': _zoom_level = 4; _resize(); break;
      }
    });

    window.addEventListener('mousewheel', function(e){
      if (e.ctrlKey) {
        _zoom_level = 0;
        if (e.deltaY < 0) {
          _zoom_factor *= Math.cbrt(2);
        } else {
          _zoom_factor /= Math.cbrt(2);
        }
        _resize();
        e.preventDefault();
      }
    });
  };

  var _resize = function() {
    switch (_zoom_level) {
      case 0:
        _svg.setAttribute('width', _bbox.width * _zoom_factor);
        _svg.setAttribute('height', _bbox.height * _zoom_factor);
        break;

      case 1:
        _svg.setAttribute('width', _bbox.width);
        _svg.setAttribute('height', _bbox.height);
        _zoom_factor = 1;
        break;

      case 2:
        _svg.setAttribute('width', '100%');
        _svg.setAttribute('height', _bbox.height * _svg.clientWidth / _bbox.width);
        _svg.setAttribute('height', _bbox.height * _svg.clientWidth / _bbox.width);
        _zoom_factor = _svg.clientHeight / _bbox.height;
        break;

      case 3:
        _svg.setAttribute('width', '50%');
        _svg.setAttribute('height', _bbox.height * _svg.clientWidth / _bbox.width);
        _svg.setAttribute('height', _bbox.height * _svg.clientWidth / _bbox.width);
        _zoom_factor = _svg.clientHeight / _bbox.height;
        break;

      case 4:
        _svg.setAttribute('height', '100%');
        _svg.setAttribute('width', _bbox.width * _svg.clientWidth / _bbox.height);
        _zoom_factor = _svg.clientHeight / _bbox.height;
        break;

      default:
        break;
    }
  };

  this.plot = _plot;
  this.resize = _resize;
};
