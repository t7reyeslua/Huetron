// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.huejay = require('huejay');
window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');
window._ = require('underscore')._;
window.jsonstorage = require('electron-json-storage');

require("./bower_components/bootstrap/dist/js/bootstrap.min.js");
require('./bower_components/bootstrap-material-design/dist/js/material.js');
require('./bower_components/bootstrap-material-design/dist/js/ripples.js');
require("./bower_components/angular-1.4.8/angular.js");
require("./bower_components/angular-1.4.8/angular-route.js");
require("./bower_components/angular-1.4.8/angular-cookies.js");
require('./bower_components/snackbarjs/snackbar.min.js');
require("./bower_components/ui-bootstrap/ui-bootstrap-0.14.3.js");
require("./bower_components/nouislider/jquery.nouislider.js");
require("./bower_components/nouislider/Link.js");
require("./bower_components/angular-nouislider/src/nouislider.js");
require("./bower_components/angular-xeditable-0.1.8/js/xeditable.js");
require('./src/js/huetron.js');
require("./src/js/utils/utils.module.js");
require("./src/js/utils/services/snackbar.service.js");
require("./src/js/utils/filters/boolean.filter.js");