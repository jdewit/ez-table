Angular Table Directive
=======================

A simple table directive that requires minimal markup.
This directive is rigid and small (~3kb). 
If you are looking for flexibility, try ngTable, ngGrid, or angular-table.

Features
--------

- filtering 
- checkboxes
- sorting 
- Twitter bootstrap styling



```html
<table s-table="users">
  <tr ng-repeat="user in items">
    <td><input type="checkbox" ng-model="user.selected"/></td>
    <td data-title="Name">{{ user.name }}</td>
    <td><a class="btn" ng-click="editUser()">Edit</a></td>
  </tr>
</table>
```
    


