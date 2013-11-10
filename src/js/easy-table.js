angular.module('easyTable', [])

.constant('EasyTableConfig', {
  limit: 10,
  limits: [5, 10, 25, 100],
  sortField: null,
  sortAscending: false
})

.directive('ezTable', ['$filter', 'EasyTableConfig', function($filter, EasyTableConfig) {
  return {
		restrict: 'A',
    scope: true,
    compile: function (element) {
      // create header template
      var headerTpl = '<thead><tr>',
          filterTpl = '<tr ng-show="showFilters"><th></th>',
          cols = angular.element(element[0].children[0]).find('td'),
          ColName,
          colName,
          fieldName;

      headerTpl += '<th><input type="checkbox" ng-model="isToggled" ng-change="toggleAll()"/></th>';

      for(var i=1; i<cols.length -1; i++) {
        ColName = angular.element(cols[i]).data('title');

        if (!ColName) {
          throw new Error('data-title attribute must be specified for column "' + i + '"');
        }

        colName = ColName.charAt(0).toLowerCase() + ColName.slice(1);
        fieldName = angular.element(cols[i]).data('field') || colName;

        headerTpl += '<th><a ng-click="sort(\'' + fieldName + '\')">' + ColName + '<span ng-show="sortField == \'' + colName + '\'" ng-class="{\'caret-up\': !sortAscending}" class="caret"></span></a></th>';
        filterTpl += '<th><input class="form-control" ng-model="filters.' + fieldName + '" type="text" ng-change="filter(\'' + fieldName + '\')"/></th>';
      }

      headerTpl += '<th></th></tr>';
      filterTpl += '<th></th></tr>';

      headerTpl += filterTpl + '</thead>';

      element.prepend(headerTpl);

      // create footer template
      var footerTpl = '<tfoot><tr>' +
        '<td>' +
          '<input type="checkbox" ng-model="isToggled" ng-change="toggleAll()"/>' +
        '</td>' +
        '<td colspan="100%">' +
          '<span class="pagination-container">' +
            '<ul ng-show="pageCount > 1" class="pagination pagination-sm">' +
              '<li ng-class="{disabled: currentPage == 0}"><a ng-click="prev()">&laquo;</a></li>' +
              '<li ng-class="{active: currentPage == $index}" ng-repeat="page in pages"><a ng-click="setPage($index)">{{ $index + 1 }}</a></li>' +
              '<li ng-class="{disabled: currentPage == (pageCount - 1)}"><a ng-click="next()">&raquo;</a></li>' +
            '</ul>' +
          '</span>' +
          '<span class="batch-actions" ng-show="showBatchActions">' +
            '<a class="btn btn-sm btn-default" ng-click="batchEdit()" title="Batch Edit"><i class="icon-pencil"></i><span>Edit</span></a>' +
            '<a class="btn btn-sm btn-danger" ng-click="batchDelete()" title="Batch Delete"><i class="icon-remove"></i><span>Delete</span></a>' +
          '</span>' +
          '<span class="sort-container">' +
            '<a class="filter-toggle btn btn-sm btn-default" ng-click="showFilters = !showFilters" title="Toggle Filters"><i class="icon-search"></i><span>Search</span></a>' +
            '<select class="form-control input-sm table-limit-select" ng-model="limit" ng-options="v for v in limits" title="Set Limit"></select>' +
          '</span>' +
        '</td>' +
      '</tfoot>';

      element.append(footerTpl);

      // attach table classes
      element.addClass('table easy-table table-bordered');

      // link function
      return function(scope, element, attrs) {
        scope.limit = parseInt(attrs.limit, 10) || EasyTableConfig.limit;
        scope.limits = scope.$eval(attrs.limits) || EasyTableConfig.limits;
        scope.sortField = scope.$eval(attrs.sortField) || EasyTableConfig.sortField;
        scope.sortAscending = scope.$eval(attrs.sortAscending) || EasyTableConfig.sortAscending;


        scope.currentPage = 0;
        scope.batchAction = '';
        scope.filters = {};

        scope.setPage = function(page)  {
          scope.currentPage = page;
          scope.items = scope.pages[page];
        };

        scope.calcPages = function(page) {
          var items = [];

          for (var hasFilters in scope.filters) {
            break;
          }

          if (hasFilters) {
            items = $filter('filter')(scope.$eval(attrs.ezTable), scope.filters);
          } else {
            items = scope.$eval(attrs.ezTable);
          }

          if (scope.sortField) {
            items = $filter('orderBy')(items, scope.sortField, !scope.sortAscending);
          }

          scope.pageCount = items.length / scope.limit;
          scope.pages = [];
          for(var i=0; i<scope.pageCount; i++) {
            scope.pages[i] = items.slice(i * scope.limit, ((i * scope.limit) + scope.limit));
          }

          scope.setPage(page);
        };

        scope.toggleAll = function() {
          scope.showBatchActions = !scope.showBatchActions;
          angular.forEach(scope.items, function(item, i) {
            scope.items[i].selected = scope.isToggled;
          });
        };

        scope.prev = function() {
          if (scope.currentPage > 0) {
            scope.items = scope.pages[scope.currentPage - 1];
            scope.currentPage--;
            scope.isToggled = false;
          }
        };

        scope.next = function() {
          if (scope.currentPage !== scope.pages.length -1) {
            scope.items = scope.pages[scope.currentPage + 1];
            scope.currentPage++;
            scope.isToggled = false;
          }
        };

        scope.sort = function(name) {
          scope.sortAscending = !scope.sortAscending;
          scope.sortField = name;
          scope.calcPages(scope.currentPage);
        };

        scope.filter = function() {
          scope.calcPages(0);
        };

        scope.$watch('limit', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            scope.calcPages(scope.currentPage);
          }
        });

        scope.$watch(attrs.ezTable, function(items) {
          scope.showBatchActions = false;

          angular.forEach(items, function(item) {
            if (item.selected) {
              scope.showBatchActions = true;

              return;
            }
          });

          scope.calcPages(scope.currentPage);
        }, true);
      };
    }
  };
}]);

