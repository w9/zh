ZH: Really Fast Heatmap
=======================

ZH is **really fast** both in terms of the speed in which heatmap is generated
and of the performance when displayed by a modern browser.  This is because it
draws the map using a bitmap format with each pixel representing a square in
the heatmap. This bitmap is then encoded as base64 and embedded in an `<image>`
tag in an SVG.

You browser won't break a sweat with a 10-million square heatmap.

![](https://github.com/w9/w9.github.io/blob/master/zh-screenshot-2.png)

![](https://github.com/w9/w9.github.io/blob/master/zh-screenshot-1.png)
