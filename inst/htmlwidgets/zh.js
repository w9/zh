HTMLWidgets.widget({

  name: 'zh',

  type: 'output',

  factory: function(el, width, height) {

    var zh = new ZH.ZH(el);

    return {

      renderValue: function(x) {

        zh.plot(x);

      },

      resize: function(width, height) { }

    };
  }
});
