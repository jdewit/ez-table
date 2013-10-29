angular.module('simpleTable', []).directive('sTable', ['$filter', function($filter) {
  return {
		restrict: 'A',
    scope: {
      _items: '=sTable',
      count: '@'
    },
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
        colName = ColName.charAt(0).toLowerCase() + ColName.slice(1);
        fieldName = angular.element(cols[i]).data('field') || colName;

        headerTpl += '<th><a ng-click="sort(\'' + fieldName + '\')">' + ColName + '<span ng-show="sortBy == \'' + colName + '\'" ng-class="{\'caret-up\': asc}" class="caret"></span></a></th>';
        filterTpl += '<th><input class="form-control" ng-model="filters.' + fieldName + '" type="text" ng-change="filter(\'' + fieldName + '\')"/></th>';
      }

      headerTpl += '<th></th></tr>';
      filterTpl += '<th></th></tr>';


      headerTpl += filterTpl + '</thead>';

      element.prepend(headerTpl);

      // create footer template
      var footerTpl = '<tfoot><tr>' +
        '<td colspan="100%">' +
          '<input type="checkbox" ng-model="isToggled" ng-change="toggleAll()"/>' +
          '<ul ng-show="pageCount > 1" class="pagination pagination-sm">' +
            '<li ng-class="{disabled: currentPage == 0}"><a ng-click="prev()">&laquo;</a></li>' +
            '<li ng-class="{active: currentPage == $index}" ng-repeat="page in pages"><a ng-click="setPage($index)">{{ $index + 1 }}</a></li>' +
            '<li ng-class="{disabled: currentPage == (pageCount - 1)}"><a ng-click="next()">&raquo;</a></li>' +
          '</ul>' +
          '<button class="filter-toggle btn btn-sm btn-default pull-right" ng-click="showFilters = !showFilters"><i class="icon-search"></i>Search</button>' +
        '</td>' +
      '</tfoot>';

      element.append(footerTpl);

      element.after(
        '<div ng-show="showBatchActions" class="well">' +
          '<button class="btn btn-sm btn-danger" ng-click="batchDelete()"><i class="icon-remove"></i>Delete</button>' +
        '</div>'
      );

      // attach table classes
      element.addClass('table table-simple table-bordered');

      // link function
      return function(scope) {
        var itemCount = scope.count || 10;

        scope.currentPage = 0;
        scope.batchAction = '';
        scope.asc = true;
        scope.filters = {};

        scope.setPage = function(page)  {
          scope.currentPage = page;
          scope.items  = scope.pages[page];

          if (scope.isToggled) {
            scope.isToggled = false;
          }
        };

        scope.calcPages = function(page) {
          var items = [];

          if (scope.filteredItems && scope.filteredItems.length) {
            items = scope.filteredItems;
          } else {
            //only load all items if there are no filters
            for (var hasFilters in scope.filters) {
              break;
            }
            if (!hasFilters) {
              items = scope._items;
            }
          }

          scope.pageCount = items.length / itemCount;

          scope.pages = [];
          for(var i=0; i<scope.pageCount; i++) {
            scope.pages.push(items.slice((i * itemCount), (i * itemCount) + itemCount));
          }

          scope.setPage(page);
        };

        scope.toggleAll = function() {
          scope.$parent.showBatchActions = !scope.$parent.showBatchActions;
          angular.forEach(scope.items, function(item) {
            item.selected = scope.isToggled;
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
          scope.asc = !scope.asc;
          scope.sortBy = name;
          scope._items = $filter('orderBy')(scope._items, name, scope.asc);
          scope.calcPages(scope.currentPage);
        };

        scope.filter = function() {
          scope.filteredItems = $filter('filter')(scope._items, scope.filters);
          scope.calcPages(0);
        };

        // show batch actions if an item is selected
        scope.$watch('_items', function(items) {
          scope.$parent.showBatchActions = false;

          angular.forEach(items, function(item) {
            if (item.selected) {
              scope.$parent.showBatchActions = true;

              return;
            }
          });
        }, true);

        // init first page
        scope.calcPages(0);
      };
    }
  };
}]);

