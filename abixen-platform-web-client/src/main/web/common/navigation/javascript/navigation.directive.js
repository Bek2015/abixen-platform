/**
 * Copyright (c) 2010-present Abixen Systems. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

(function () {

    'use strict';

    angular
        .module('platformNavigationModule')
        .directive('platformNavigation', platformNavigationDirective);

    platformNavigationDirective.$inject = [
        '$log',
        '$state',
        'applicationNavigationItems',
        'User',
        '$translate',
        '$filter'
    ];

    function platformNavigationDirective($log, $state, applicationNavigationItems, User, $translate, $filter) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/common/navigation/html/platform-navigation.html',
            scope: {
                addNewModule: '&addNewModule',
                addNewPage: '&addNewPage',
                logout: '&logout',
                platformUser: '=platformUser',
                selectedItem: '=selectedItem',
                showDropdown: '=showDropdown',
                editUser: '&editUser'
            },
            link: link
        };

        function link(scope, element, attrs) {

            scope.applicationNavigationItems = applicationNavigationItems;
            scope.sidebarItems = applicationNavigationItems.sidebarItems;
            scope.topbarItems = applicationNavigationItems.topbarItems;
            scope.topbarDropdownItems = applicationNavigationItems.topbarDropdownItems;
            scope.redirectAction = applicationNavigationItems.getRedirectAction();
            scope.dropdownStyleClass = applicationNavigationItems.getDropdownStyleClass();
            scope.toggle = true;
            scope.baseUserUrl = '/api/application/users/';
            scope.avatarUrl = '';

            scope.locales = [
                {title: 'English', img: '/common/navigation/image/united-states_flat.png', name: 'ENGLISH'},
                {title: 'Polish', img: '/common/navigation/image/poland_flat.png', name: 'POLISH'},
                {title: 'Russian', img: '/common/navigation/image/russia_flat.png', name: 'RUSSIAN'},
                {title: 'Spanish', img: '/common/navigation/image/spain_flat.png', name: 'SPAIN'},
                {title: 'Ukrainian', img: '/common/navigation/image/ukraine_flat.png', name: 'UKRAINIAN'}
            ];

            //  default locale is ENGLISH
            scope.selectedLocale = scope.locales[0];

            var mobileView = 992;

            scope.getWidth = function () {
                return window.innerWidth;
            };

            scope.$watch(scope.getWidth, function (newValue, oldValue) {
                $log.log('scope.toggle: ' + scope.toggle);
                if (newValue >= mobileView) {
                    scope.toggle = true;
                } else {
                    scope.toggle = false;
                }

            });

            if (!scope.selectedItem && !$state.params.id) {
                scope.selectedItem = 0;
            }

            scope.changeState = function (sidebarItem) {
                scope.selectedItem = sidebarItem.id;
                if (sidebarItem.isPage) {
                    $state.go(sidebarItem.state, {id: sidebarItem.id});
                } else {
                    $state.go(sidebarItem.state);
                }

            };

            scope.toggleSidebar = function () {
                scope.toggle = !scope.toggle;
            };

            scope.switchLocale = function (locale) {
                scope.selectedLocale = locale;
                $translate.use(scope.selectedLocale.name);
            };

            window.onresize = function () {
                scope.$apply();
            };

            scope.$on(platformParameters.events.SIDEBAR_ELEMENT_SELECTED, function (event, id) {
                scope.selectedItem = id;
            });

            var getUser = function (id) {
                $log.log('selected user id:', id);
                if (id) {
                    User.get({id: id}, function (data) {
                        scope.user = data;
                        scope.avatarUrl = scope.baseUserUrl + scope.user.id + '/avatar/' + scope.user.avatarFileName;
                        $log.log('User has been got: ', scope.user);
                        scope.selectedLocale = $filter("filter")(scope.locales, {name: scope.user.selectedLanguage})[0];
                    });
                } else {
                    scope.user = {};
                }
            };
            if (scope.platformUser != null) {
                getUser(scope.platformUser.id);
            } else {
                scope.$watch('platformUser', function () {
                    $log.log('scope platform user watch', scope.platformUser);
                    if (scope.platformUser != null) {
                        getUser(scope.platformUser.id);
                    }
                });
            }

        }
    }
})();