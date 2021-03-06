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
        .module('platformThemeModule')
        .config(platformThemeModuleConfig);

    platformThemeModuleConfig.$inject = [
        '$stateProvider'
    ];

    function platformThemeModuleConfig($stateProvider) {

        $stateProvider
            .state('application.themes', {
                url: '/themes',
                templateUrl: '/admin/modules/theme/html/index.html'
            })
            .state('application.themes.add', {
                url: '/add',
                templateUrl: '/admin/modules/theme/html/add/theme.html',
                controller: 'ThemeAddController',
                controllerAs: 'themeAdd'
            })
            .state('application.themes.list', {
                url: '/list',
                templateUrl: '/admin/modules/theme/html/list.html',
                controller: 'ThemeListController',
                controllerAs: 'themeList'
            });
    }
})();