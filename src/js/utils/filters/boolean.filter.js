(function () {
    'use-strict';

    angular
        .module('utils.filters', [])
        .filter('checkmark', function() {
            return function(input) {
                return input ? '\u2713' : '\u2718';
            };
        })
        
        .filter('check_online_fa', function() {
            return function(input) {
                return input ? "fa fa-check-circle check-online" : "fa fa-times-circle check-offline";
            };
        })

        .filter('activeLang', function() {
            return function(input) {
                var out = [];
                for (var i=0; i < input.length; i++) {
                    if (input[i].active) {
                        out = out.concat(input[i]);
                    }
                };
                return out;
            };
        })

        .filter('forEachLang', function() {
            return function(input) {
                var out = [];
                angular.forEach(input, function(values, key) {
                    if (input[key].active) {
                        this.push(input[key]);
                    };
                }, out);
                return out;
            };
        })
        .filter('genreReplace', function() {
            return function(input) {
                return(input)
            }
        })
})();