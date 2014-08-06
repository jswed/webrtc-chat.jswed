require.config({
  baseUrl: 'bower_components',
  packages: [
    {
      name: 'jquery',
      main: 'dist/jquery.js'
    },
    {
      name: 'poly',
      main: 'poly.js'
    },
    {
      name: 'when',
      main: 'when.js'
    },
    {
      name: 'rtc-chat',
      location: '..'
    }
  ],
  paths: {
    "stache": "requirejs-mustache/stache",
    "mustache": "mustache/mustache",
    "text": "requirejs-text/text"
  },
  deps: [
    'require', 'when/monitor/console'
  ],
  callback: function bootstrap(require) {
    require([
      'troopjs-dom/application/widget', 'jquery'
    ], function(App, $) {
      App($('html')).start();
    });
  }
});