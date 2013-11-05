describe('easy-table', function() {
  var el, scope, rows;

  beforeEach(module('EasyTable'));

  beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;

      el = angular.element(
        '<table ez-table="users" data-count="6">' +
          '<tr ng-repeat="user in items">' +
            '<td><input type="checkbox" ng-model="user.selected"/></td>' +
            '<td data-title="First Name" data-field="firstName">{{ user.firstName }}</td>' +
            '<td data-title="Last Name" data-field="lastName">{{ user.lastName }}</td>' +
            '<td><a><i class="icon-pencil">Edit</a></td>' +
          '</tr>' +
        '</table>'
      );

      scope.users = [
        {firstName: "Joe", lastName: "Smith"},
        {firstName: "Bob", lastName: "Jones"},
        {firstName: "Pete", lastName: "Barker"},
        {firstName: "Don", lastName: "Draper"},
        {firstName: "Bobby", lastName: "Simpson"},
        {firstName: "Joey", lastName: "Diaz"},
        {firstName: "Zoe", lastName: "Dejawhatever"},
        {firstName: "Tom", lastName: "Jones"}
      ];

      $compile(el)(scope);
      scope.$digest();

  }));

  it('is a table element', function() {
    expect(el.prop('tagName')).toBe('TABLE');
    expect(el.find('thead').find('tr').length).toBe(2);
  });

  it('it renders table header automatically', function() {
    expect(el.find('thead th:first-child input').length).toBe(1);
    expect(el.find('thead th:nth-child(2) a').text()).toBe('First Name');
    expect(el.find('thead th:nth-child(3) a').text()).toBe('Last Name');
    expect(el.find('thead th:nth-child(4)').text()).toBe('');
  });

  it('it renders table footer automatically', function() {
    expect(el.find('tfoot').length).toBe(1);
  });

  it('it renders paginator automatically', function() {
    expect(el.find('.pagination').length).toBe(1);
    expect(el.find('.pagination li').length).toBe(4);
  });

  it('it renders filter search toggle', function() {
    expect(el.find('tfoot button').text()).toBe('Search');
  });

  it('template should bind the users', function() {
    expect(scope.users.length).toBe(8);
  });

  it('should have rows equal to count option', function() {
    var rows = el.find('tbody tr');
    expect(rows.length).toBe(6);
  });

  it('should sort items on header click', function() {
    expect(el.find('tbody tr:first-child td:nth-child(2)').text()).toBe('Joe');

    el.find('thead tr:first-child th:nth-child(2) a').click();
    expect(el.find('tbody tr:first-child td:nth-child(2)').text()).toBe('Bob');

    el.find('thead tr:first-child th:nth-child(2) a').click();
    expect(el.find('tbody tr:first-child td:nth-child(2)').text()).toBe('Zoe');

    el.find('thead tr:first-child th:nth-child(3) a').click();
    expect(el.find('tbody tr:first-child td:nth-child(3)').text()).toBe('Barker');

    el.find('thead tr:first-child th:nth-child(3) a').click();
    expect(el.find('tbody tr:first-child td:nth-child(3)').text()).toBe('Smith');
  });

  it('should be able to toggle filter', function() {
    expect(el.find('thead tr:nth-child(2)').hasClass('ng-hide')).toBe(true);
    el.find('.filter-toggle').click();
    expect(el.find('thead tr:nth-child(2)').hasClass('ng-hide')).toBe(false);
    el.find('.filter-toggle').click();
    expect(el.find('thead tr:nth-child(2)').hasClass('ng-hide')).toBe(true);
  });

  it('should be able to filter the list', function() {
    el.find('.filter-toggle').click();

    el.find('thead tr:nth-child(2) th:nth-child(2) .form-control').autotype('Bo').trigger('input');
    rows = el.find('tbody tr');
    expect(rows.length).toBe(2);

    el.find('thead tr:nth-child(2) th:nth-child(2) .form-control').autotype('bby').trigger('input');
    rows = el.find('tbody tr');
    expect(rows.length).toBe(1);

    el.find('thead tr:nth-child(2) th:nth-child(2) .form-control').autotype('{back}{back}{back}{back}{back}').trigger('input');
  });

  it('should update table on pagination', function() {
    el.find('.pagination li:nth-child(3) a').click();
    rows = el.find('tbody tr');
    expect(rows.length).toBe(2);

    el.find('.pagination li:first-child a').click();
    rows = el.find('tbody tr');
    expect(rows.length).toBe(6);

    el.find('.pagination li:first-child a').click();
    rows = el.find('tbody tr');
    expect(rows.length).toBe(6);

    el.find('.pagination li:last-child a').click();
    rows = el.find('tbody tr');
    expect(rows.length).toBe(2);

    el.find('.pagination li:last-child a').click();
    rows = el.find('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('Should toggle all rows on toggle all click and show batch actions', function() {
    el.find('thead input[type="checkbox"]').click();
    angular.forEach(el.scope().items, function(item) {
      expect(item.selected).toBe(true);
    });

    expect(el.next().hasClass('well')).toBe(true);
    expect(el.next().find('button:first-child').text()).toBe('Edit');
    expect(el.next().find('button:nth-child(2)').text()).toBe('Delete');
  });

  it('Should toggle off all rows on repeat toggle all click', function() {
    el.find('thead input[type="checkbox"]').attr('checked', false).trigger('input');
    angular.forEach(el.scope().items, function(item) {
      expect(item.selected).not.toBe(true);
    });
  });

});
