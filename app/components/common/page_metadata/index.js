'use strict';

var _defaultPageDescription;

angular.module('odca.page_metadata', [])
    .run(['$location', '$rootElement', '$rootScope', '$window', 'pageMetadata',
        function($location, $rootElement, $rootScope, $window, pageMetadata) {
            // Save the initial description
            var descriptionElement = findDescriptionElement($rootElement);
            _defaultPageDescription = descriptionElement.attr('content');

            // Listen to route changes to update title from route config
            $rootScope.$on('$stateChangeSuccess', function(event, toState) {
                var data = toState && toState.data || {};
                pageMetadata({
                    title: data.pageTitle,
                    description: data.pageDescription
                });

                // If in prod
                if ($location.host().indexOf('localhost') === -1) {
                    // Track virtual page views in Google Analytics
                    $window.ga('set', 'page', $location.path());
                    $window.ga('send', 'pageview');
                }
            });
        }
    ])
    .factory('pageMetadata', ['$rootElement', '$rootScope', function($rootElement, $rootScope) {
        return function(metadata) {
            metadata = metadata || {};
            $rootScope.pageTitle = metadata.title ? metadata.title + ' | ' : '';

            var descriptionElement = findDescriptionElement($rootElement);
            descriptionElement.attr('content', metadata.description || _defaultPageDescription);
        };
    }]);

function findDescriptionElement($rootElement) {
    return angular.element($rootElement[0].querySelector('meta[name="description"]'));
}


module.exports = 'odca.page_metadata';